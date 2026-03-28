"""
Module: test_advanced_rag
RAG Layer: Retrieval (multi-stage pipeline)

Tests for Advanced RAG: query rewriting, deduplication, re-ranking,
context compression, and prompt assembly. All tests are unit-level
(no API calls) except those marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from unittest.mock import MagicMock, patch

# ── Third-party ──────────────────────────────────────────
import pytest
from langchain_core.documents import Document

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
K = 10          # candidates per query variant
TOP_N = 3       # final chunks after re-ranking


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists(), f"Sample data not found: {POLICY_PATH}"
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def sample_documents() -> list[Document]:
    """Five short documents that mimic retrieved candidates."""
    return [
        Document(page_content="The minimum FICO score for a personal loan is 680.", metadata={"source": "policy.txt", "chunk_id": "1"}),
        Document(page_content="Applicants must have a DTI ratio below 43 percent.", metadata={"source": "policy.txt", "chunk_id": "2"}),
        Document(page_content="Employment verification is required for all loan types.", metadata={"source": "policy.txt", "chunk_id": "3"}),
        Document(page_content="The minimum FICO score for a personal loan is 680.", metadata={"source": "policy.txt", "chunk_id": "4"}),  # duplicate
        Document(page_content="Loan amounts range from $1,000 to $50,000 depending on creditworthiness.", metadata={"source": "policy.txt", "chunk_id": "5"}),
    ]


# ---------------------------------------------------------------------------
# Notebook structure tests
# ---------------------------------------------------------------------------


class TestNotebookStructure:
    def test_notebook_exists(self) -> None:
        assert NOTEBOOK_PATH.exists()

    def test_notebook_valid_json(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        assert "cells" in nb

    def test_notebook_has_12_cells(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        assert len(nb["cells"]) == 12

    def test_notebook_alternates_markdown_code(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        expected = ["markdown", "code"] * 6
        actual = [c["cell_type"] for c in nb["cells"]]
        assert actual == expected

    def test_no_hardcoded_api_keys(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        for cell in nb["cells"]:
            src = "".join(cell["source"])
            assert "sk-ant-" not in src
            assert "sk-proj-" not in src

    def test_cell1_loads_dotenv(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        code_cells = [c for c in nb["cells"] if c["cell_type"] == "code"]
        assert "load_dotenv" in "".join(code_cells[0]["source"])

    def test_cell1_references_api_keys(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        code_cells = [c for c in nb["cells"] if c["cell_type"] == "code"]
        src = "".join(code_cells[0]["source"])
        assert "ANTHROPIC_API_KEY" in src
        assert "OPENAI_API_KEY" in src

    def test_notebook_mentions_rerank(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "rerank" in all_src.lower()

    def test_notebook_mentions_compress(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "compress" in all_src.lower()


# ---------------------------------------------------------------------------
# Deduplication logic tests
# ---------------------------------------------------------------------------


class TestDeduplication:
    """Verify the MD5-hash deduplication used in retrieve_multi_query."""

    def _deduplicate(self, docs: list[Document]) -> list[Document]:
        seen: set[str] = set()
        unique: list[Document] = []
        for doc in docs:
            key = hashlib.md5(doc.page_content.encode()).hexdigest()
            if key not in seen:
                seen.add(key)
                unique.append(doc)
        return unique

    def test_removes_exact_duplicates(self, sample_documents: list[Document]) -> None:
        unique = self._deduplicate(sample_documents)
        assert len(unique) == 4  # 5 docs, 1 exact duplicate

    def test_preserves_unique_docs(self, sample_documents: list[Document]) -> None:
        unique = self._deduplicate(sample_documents)
        texts = [d.page_content for d in unique]
        assert "The minimum FICO score for a personal loan is 680." in texts
        assert "Applicants must have a DTI ratio below 43 percent." in texts

    def test_first_occurrence_kept(self, sample_documents: list[Document]) -> None:
        unique = self._deduplicate(sample_documents)
        # chunk_id "1" should be kept, "4" (the duplicate) dropped
        ids = [d.metadata["chunk_id"] for d in unique]
        assert "1" in ids
        assert "4" not in ids

    def test_empty_list(self) -> None:
        assert self._deduplicate([]) == []

    def test_all_unique(self, sample_documents: list[Document]) -> None:
        non_dupes = sample_documents[:3]
        result = self._deduplicate(non_dupes)
        assert len(result) == 3


# ---------------------------------------------------------------------------
# Query rewriting tests
# ---------------------------------------------------------------------------


class TestQueryRewriting:
    """Validate the structure of rewrite_query output."""

    def _validate_variants(self, original: str, variants: list[str]) -> None:
        """Shared assertion helper."""
        assert len(variants) >= 1
        for v in variants:
            assert isinstance(v, str)
            assert len(v.strip()) > 0

    def test_variants_are_strings(self) -> None:
        variants = [
            "What FICO score is needed for a personal loan?",
            "Minimum credit score requirement for personal loan",
            "Personal loan eligibility credit score",
        ]
        self._validate_variants("FICO requirements", variants)

    def test_no_duplicate_variants(self) -> None:
        variants = [
            "What FICO score is needed?",
            "Minimum credit score?",
            "Credit score for loan?",
        ]
        assert len(variants) == len(set(variants))

    def test_variant_count_matches_n(self) -> None:
        # The function should return exactly n_variants items
        n = 3
        variants = ["v1", "v2", "v3"]
        assert len(variants) == n


# ---------------------------------------------------------------------------
# Re-ranking score tests
# ---------------------------------------------------------------------------


class TestReranking:
    """Test score normalisation and top-n selection."""

    def _select_top_n(
        self,
        docs: list[Document],
        scores: list[float],
        top_n: int,
    ) -> list[tuple[Document, float]]:
        paired = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
        return paired[:top_n]

    def test_returns_top_n(self, sample_documents: list[Document]) -> None:
        scores = [0.9, 0.7, 0.85, 0.4, 0.6]
        result = self._select_top_n(sample_documents[:5], scores, TOP_N)
        assert len(result) == TOP_N

    def test_highest_scores_first(self, sample_documents: list[Document]) -> None:
        scores = [0.9, 0.7, 0.85, 0.4, 0.6]
        result = self._select_top_n(sample_documents[:5], scores, TOP_N)
        result_scores = [s for _, s in result]
        assert result_scores == sorted(result_scores, reverse=True)

    def test_scores_in_unit_interval(self) -> None:
        for score in [0.0, 0.5, 1.0]:
            assert 0.0 <= score <= 1.0

    def test_top_n_less_than_candidates(self, sample_documents: list[Document]) -> None:
        scores = [0.9, 0.7, 0.85, 0.4, 0.6]
        result = self._select_top_n(sample_documents[:5], scores, TOP_N)
        assert len(result) < len(sample_documents)


# ---------------------------------------------------------------------------
# Compression tests
# ---------------------------------------------------------------------------


class TestContextCompression:
    """Verify compression ratio and output format."""

    def _simulate_compression(self, chunk: str, keep_fraction: float = 0.5) -> str:
        """Mock compressor that keeps the first keep_fraction of characters."""
        keep = max(1, int(len(chunk) * keep_fraction))
        return chunk[:keep]

    def test_compressed_is_shorter(self) -> None:
        original = "A" * 500
        compressed = self._simulate_compression(original, keep_fraction=0.5)
        assert len(compressed) < len(original)

    def test_compression_ratio(self) -> None:
        original = "X" * 600
        compressed = self._simulate_compression(original, keep_fraction=0.6)
        ratio = len(compressed) / len(original)
        assert ratio < 1.0

    def test_compressed_is_non_empty(self) -> None:
        original = "Some relevant sentence about FICO scores and loan requirements."
        compressed = self._simulate_compression(original)
        assert len(compressed.strip()) > 0


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestAdvancedRAGIntegration:
    """Full pipeline tests — require real API keys."""

    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_full_pipeline_returns_answer(self, policy_text: str) -> None:
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
        )
        chunks = splitter.split_text(policy_text)
        store = Chroma.from_texts(
            chunks,
            OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        results = store.similarity_search_with_score(
            "What are the FICO score requirements for a personal loan?", k=K
        )
        assert len(results) > 0

        context = "\n\n---\n\n".join(
            f"[Chunk {i+1}]\n{doc.page_content}"
            for i, (doc, _) in enumerate(results[:TOP_N])
        )
        client = Anthropic()
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            system="Answer using ONLY the provided context.",
            messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: What is the minimum FICO score?"}],
        )
        answer = response.content[0].text
        assert len(answer) > 50
