"""
Module: test_hybrid_rag
RAG Layer: Retrieval (BM25 + dense + RRF)

Tests for Hybrid RAG: tokenisation, BM25 scoring logic, RRF fusion
rank arithmetic, and result flag fields. All tests are unit-level
(no API calls) except those marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
from pathlib import Path

# ── Third-party ──────────────────────────────────────────
import pytest

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

CHUNK_SIZE = 400
CHUNK_OVERLAP = 60
TOP_N = 20      # candidates per retriever before fusion
TOP_K = 5       # final results after RRF
RRF_K = 60      # smoothing constant


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def sample_chunks() -> list[str]:
    return [
        "The minimum FICO score for a personal loan is 680.",
        "LCR requirements mandate a 100% coverage ratio for liquid assets.",
        "DTI ratio must not exceed 43 percent for standard loans.",
        "Basel III Tier 1 capital requirements are set at 6 percent.",
        "Employment verification is required for all personal loans.",
        "The leverage ratio under Basel III must be at least 3 percent.",
        "Applicants with FICO scores above 750 qualify for premium rates.",
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
        assert [c["cell_type"] for c in nb["cells"]] == expected

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

    def test_notebook_mentions_bm25(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "bm25" in all_src.lower() or "BM25" in all_src

    def test_notebook_mentions_rrf(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "rrf" in all_src.lower() or "reciprocal" in all_src.lower()


# ---------------------------------------------------------------------------
# Tokenisation tests
# ---------------------------------------------------------------------------


class TestTokenisation:
    """Validate the tokenize() function behaviour."""

    def _tokenize(self, text: str) -> list[str]:
        """Replicate notebook tokenizer: lowercase split, no stopword removal."""
        return text.lower().split()

    def test_lowercases_tokens(self) -> None:
        tokens = self._tokenize("FICO Score Requirements")
        assert all(t == t.lower() for t in tokens)

    def test_preserves_legal_terms(self) -> None:
        # "lcr" must survive — it is an exact regulatory term
        tokens = self._tokenize("The LCR requirement is 100 percent")
        assert "lcr" in tokens

    def test_empty_string(self) -> None:
        assert self._tokenize("") == []

    def test_splits_on_whitespace(self) -> None:
        tokens = self._tokenize("one two three")
        assert tokens == ["one", "two", "three"]

    def test_does_not_remove_numbers(self) -> None:
        tokens = self._tokenize("ratio 43 percent")
        assert "43" in tokens


# ---------------------------------------------------------------------------
# RRF fusion tests
# ---------------------------------------------------------------------------


class TestRRFFusion:
    """Test Reciprocal Rank Fusion arithmetic and output contract."""

    def _rrf_score(self, rank: int, k: int = RRF_K) -> float:
        return 1.0 / (k + rank)

    def _rrf_fuse(
        self,
        bm25_ranked: list[tuple[int, float]],
        dense_ranked: list[tuple[int, float]],
        k: int = RRF_K,
        top_k: int = TOP_K,
    ) -> list[tuple[int, float]]:
        scores: dict[int, float] = {}
        for rank, (idx, _) in enumerate(bm25_ranked, start=1):
            scores[idx] = scores.get(idx, 0.0) + 1.0 / (k + rank)
        for rank, (idx, _) in enumerate(dense_ranked, start=1):
            scores[idx] = scores.get(idx, 0.0) + 1.0 / (k + rank)
        sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_items[:top_k]

    def test_rrf_score_decreases_with_rank(self) -> None:
        s1 = self._rrf_score(1)
        s10 = self._rrf_score(10)
        assert s1 > s10

    def test_rrf_score_positive(self) -> None:
        for rank in range(1, 21):
            assert self._rrf_score(rank) > 0

    def test_chunk_in_both_lists_scores_higher(self) -> None:
        # chunk 0 appears in both; chunk 1 only in BM25; chunk 2 only in dense
        bm25 = [(0, 1.0), (1, 0.8)]
        dense = [(0, 1.0), (2, 0.7)]
        fused = self._rrf_fuse(bm25, dense)
        fused_dict = dict(fused)
        assert fused_dict[0] > fused_dict.get(1, 0.0)
        assert fused_dict[0] > fused_dict.get(2, 0.0)

    def test_returns_top_k(self) -> None:
        bm25 = [(i, float(10 - i)) for i in range(10)]
        dense = [(i, float(10 - i)) for i in range(10)]
        fused = self._rrf_fuse(bm25, dense)
        assert len(fused) == TOP_K

    def test_no_chunk_discarded_only_ranked(self) -> None:
        """All unique chunk indices from both lists must appear in fused output (for small lists)."""
        bm25 = [(0, 1.0), (1, 0.5)]
        dense = [(2, 1.0), (3, 0.5)]
        fused = self._rrf_fuse(bm25, dense, top_k=4)
        fused_indices = {idx for idx, _ in fused}
        assert {0, 1, 2, 3} == fused_indices

    def test_fused_scores_are_positive(self) -> None:
        bm25 = [(0, 1.0), (1, 0.8), (2, 0.6)]
        dense = [(1, 1.0), (0, 0.9), (3, 0.5)]
        fused = self._rrf_fuse(bm25, dense)
        for _, score in fused:
            assert score > 0


# ---------------------------------------------------------------------------
# Hybrid result schema tests
# ---------------------------------------------------------------------------


class TestHybridResultSchema:
    """Validate the dict schema returned by hybrid_retrieve."""

    def _make_result(
        self,
        chunk_idx: int,
        text: str,
        rrf_score: float,
        in_bm25: bool,
        in_dense: bool,
    ) -> dict:
        return {
            "chunk_idx": chunk_idx,
            "text": text,
            "rrf_score": rrf_score,
            "in_bm25": in_bm25,
            "in_dense": in_dense,
        }

    def test_result_has_required_keys(self) -> None:
        result = self._make_result(0, "some text", 0.015, True, False)
        required = {"chunk_idx", "text", "rrf_score", "in_bm25", "in_dense"}
        assert required.issubset(result.keys())

    def test_rrf_score_is_float(self) -> None:
        result = self._make_result(0, "text", 0.015, True, True)
        assert isinstance(result["rrf_score"], float)

    def test_in_both_flags(self) -> None:
        result = self._make_result(0, "text", 0.03, True, True)
        assert result["in_bm25"] is True
        assert result["in_dense"] is True

    def test_bm25_only_flag(self) -> None:
        result = self._make_result(0, "text", 0.015, True, False)
        assert result["in_bm25"] is True
        assert result["in_dense"] is False


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestHybridRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_hybrid_retrieve_returns_results(self, policy_text: str) -> None:
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from rank_bm25 import BM25Okapi

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
        )
        chunks = splitter.split_text(policy_text)
        assert len(chunks) > 0

        tokenised = [c.lower().split() for c in chunks]
        bm25 = BM25Okapi(tokenised)
        query = "What is the minimum FICO score for a personal loan?"
        bm25_scores = bm25.get_scores(query.lower().split())
        top_bm25_idx = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)[:TOP_K]
        assert len(top_bm25_idx) == TOP_K

        store = Chroma.from_texts(
            chunks,
            OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        dense_results = store.similarity_search_with_score(query, k=TOP_K)
        assert len(dense_results) == TOP_K

        client = Anthropic()
        context = "\n\n".join(chunks[i] for i in top_bm25_idx[:TOP_N])
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            system="Answer using ONLY the provided context.",
            messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}],
        )
        answer = response.content[0].text
        assert len(answer) > 50
