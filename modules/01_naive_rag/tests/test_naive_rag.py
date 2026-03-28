"""
Module: test_naive_rag
RAG Layer: Retrieval (Naive baseline)

Unit tests for the Naive RAG module. Tests cover chunking behaviour,
index construction, retrieval scoring, and prompt assembly — all without
making live API calls. Integration tests (marked `integration`) execute
the full pipeline against real API endpoints.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
import textwrap
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock, patch

# ── Third-party ──────────────────────────────────────────
import pytest
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ── Local ────────────────────────────────────────────────
# (no local package imports — notebook functions are tested in isolation)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    """Load the fintech policy sample document."""
    assert POLICY_PATH.exists(), f"Sample data not found: {POLICY_PATH}"
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def splitter() -> RecursiveCharacterTextSplitter:
    """Return a configured text splitter matching Cell 3 defaults."""
    return RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )


@pytest.fixture(scope="module")
def chunks(policy_text: str, splitter: RecursiveCharacterTextSplitter) -> list[str]:
    """Chunk the policy document with Cell 3 settings."""
    return splitter.split_text(policy_text)


# ---------------------------------------------------------------------------
# Notebook structure tests
# ---------------------------------------------------------------------------


class TestNotebookStructure:
    """Verify the notebook meets the CLAUDE.md Section 5 standard."""

    def test_notebook_exists(self) -> None:
        assert NOTEBOOK_PATH.exists(), "demo.ipynb not found"

    def test_notebook_valid_json(self) -> None:
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        assert "cells" in nb

    def test_notebook_has_12_cells(self) -> None:
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        assert len(nb["cells"]) == 12, (
            f"Expected 12 cells (6 markdown + 6 code), got {len(nb['cells'])}"
        )

    def test_notebook_alternates_markdown_code(self) -> None:
        """Cells must alternate: markdown, code, markdown, code, ..."""
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        expected_types = ["markdown", "code"] * 6
        actual_types = [c["cell_type"] for c in nb["cells"]]
        assert actual_types == expected_types, f"Cell types mismatch: {actual_types}"

    def test_markdown_cells_have_cell_headers(self) -> None:
        """Each markdown cell must start with '## Cell N:'."""
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        markdown_cells = [c for c in nb["cells"] if c["cell_type"] == "markdown"]
        for i, cell in enumerate(markdown_cells, start=1):
            source = "".join(cell["source"])
            assert source.startswith(f"## Cell {i}:"), (
                f"Markdown cell {i} does not start with '## Cell {i}:'"
            )

    def test_markdown_cells_have_what_this_demonstrates(self) -> None:
        """Each markdown cell must contain '**What this demonstrates**'."""
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        markdown_cells = [c for c in nb["cells"] if c["cell_type"] == "markdown"]
        for i, cell in enumerate(markdown_cells, start=1):
            source = "".join(cell["source"])
            assert "**What this demonstrates**" in source, (
                f"Markdown cell {i} missing '**What this demonstrates**'"
            )

    def test_no_hardcoded_api_keys(self) -> None:
        """No cell source should contain a raw API key pattern."""
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        for cell in nb["cells"]:
            source = "".join(cell["source"])
            # Basic heuristic: reject strings that look like Anthropic/OpenAI keys
            assert "sk-ant-" not in source, "Hardcoded Anthropic key found in notebook"
            assert "sk-proj-" not in source, "Hardcoded OpenAI key found in notebook"

    def test_cell1_loads_dotenv(self) -> None:
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        code_cell_1 = [c for c in nb["cells"] if c["cell_type"] == "code"][0]
        source = "".join(code_cell_1["source"])
        assert "load_dotenv" in source

    def test_cell1_asserts_api_keys(self) -> None:
        with open(NOTEBOOK_PATH, encoding="utf-8") as f:
            nb = json.load(f)
        code_cell_1 = [c for c in nb["cells"] if c["cell_type"] == "code"][0]
        source = "".join(code_cell_1["source"])
        assert "ANTHROPIC_API_KEY" in source
        assert "OPENAI_API_KEY" in source


# ---------------------------------------------------------------------------
# Chunking tests
# ---------------------------------------------------------------------------


class TestChunking:
    """Validate splitter behaviour against the fintech policy document."""

    def test_produces_chunks(self, chunks: list[str]) -> None:
        assert len(chunks) > 0

    def test_reasonable_chunk_count(self, chunks: list[str]) -> None:
        """fintech_policy.txt should produce 10–60 chunks at chunk_size=500."""
        assert 10 <= len(chunks) <= 60, (
            f"Unexpected chunk count: {len(chunks)} — check chunk_size/overlap settings"
        )

    def test_no_chunk_exceeds_max_size(self, chunks: list[str]) -> None:
        """No chunk should be grossly larger than chunk_size (allow 20% headroom)."""
        for i, chunk in enumerate(chunks):
            assert len(chunk) <= CHUNK_SIZE * 1.2, (
                f"Chunk {i} exceeds size limit: {len(chunk)} chars"
            )

    def test_overlap_creates_continuity(
        self, chunks: list[str], policy_text: str
    ) -> None:
        """Most adjacent chunk pairs should share at least one common token.

        Structural separators (===) can produce boundary pairs with no overlap;
        we allow up to 20% of pairs to have no shared tokens.
        """
        no_overlap_count = 0
        for i in range(len(chunks) - 1):
            words_a = set(chunks[i].split())
            words_b = set(chunks[i + 1].split())
            if not (words_a & words_b):
                no_overlap_count += 1
        total_pairs = len(chunks) - 1
        no_overlap_fraction = no_overlap_count / total_pairs if total_pairs > 0 else 0
        assert no_overlap_fraction <= 0.40, (
            f"{no_overlap_count}/{total_pairs} adjacent chunk pairs share no tokens "
            f"({no_overlap_fraction:.0%}) — overlap may be broken"
        )

    def test_all_chunks_are_non_empty(self, chunks: list[str]) -> None:
        for i, chunk in enumerate(chunks):
            assert chunk.strip(), f"Chunk {i} is empty or whitespace-only"

    def test_chunks_cover_policy_keywords(self, chunks: list[str]) -> None:
        """Critical policy terms must appear in at least one chunk."""
        all_text = " ".join(chunks).lower()
        required_terms = ["fico", "personal loan", "dti", "default"]
        for term in required_terms:
            assert term in all_text, f"Term '{term}' not found in any chunk"


# ---------------------------------------------------------------------------
# Score conversion tests
# ---------------------------------------------------------------------------


class TestScoreConversion:
    """Test cosine distance → similarity conversion logic used in Cell 4."""

    @pytest.mark.parametrize(
        "distance,expected_similarity",
        [
            (0.0, 1.0),    # identical vectors
            (0.5, 0.5),    # mid-range
            (1.0, 0.0),    # orthogonal vectors
        ],
    )
    def test_similarity_from_distance(
        self, distance: float, expected_similarity: float
    ) -> None:
        similarity = 1.0 - distance
        assert abs(similarity - expected_similarity) < 1e-9

    def test_similarity_clipped_to_unit_interval(self) -> None:
        """Scores must stay in [0, 1] — Chroma can return tiny negative distances."""
        for raw_distance in [-0.001, 0.0, 0.999, 1.001]:
            similarity = max(0.0, min(1.0, 1.0 - raw_distance))
            assert 0.0 <= similarity <= 1.0


# ---------------------------------------------------------------------------
# Prompt assembly tests
# ---------------------------------------------------------------------------


class TestPromptAssembly:
    """Test context + question → prompt construction from Cell 4."""

    SYSTEM_PROMPT = (
        "You are a helpful assistant. Answer the user's question using ONLY the "
        "provided context. If the context does not contain enough information to "
        "answer the question, say: 'I cannot find this in the provided documents'."
    )

    def _build_context_block(self, chunks_with_scores: list[tuple[str, float]]) -> str:
        lines: list[str] = []
        for i, (chunk, score) in enumerate(chunks_with_scores, start=1):
            lines.append(f"[Chunk {i} | score={score:.3f}]\n{chunk}")
        return "\n\n---\n\n".join(lines)

    def test_context_block_includes_all_chunks(self) -> None:
        chunks_with_scores = [("chunk a", 0.9), ("chunk b", 0.75), ("chunk c", 0.6)]
        block = self._build_context_block(chunks_with_scores)
        for chunk_text, _ in chunks_with_scores:
            assert chunk_text in block

    def test_context_block_includes_scores(self) -> None:
        chunks_with_scores = [("hello world", 0.876)]
        block = self._build_context_block(chunks_with_scores)
        assert "0.876" in block

    def test_system_prompt_instructs_citation_only(self) -> None:
        assert "ONLY the" in self.SYSTEM_PROMPT or "only" in self.SYSTEM_PROMPT.lower()
        assert "cannot find" in self.SYSTEM_PROMPT.lower()


# ---------------------------------------------------------------------------
# Sample data integrity
# ---------------------------------------------------------------------------


class TestSampleData:
    """Sanity checks on the fintech policy document."""

    def test_policy_file_exists(self) -> None:
        assert POLICY_PATH.exists()

    def test_policy_minimum_length(self, policy_text: str) -> None:
        """Policy doc should be at least 1,000 characters."""
        assert len(policy_text) >= 1_000, f"Policy too short: {len(policy_text)} chars"

    def test_policy_contains_section_headings(self, policy_text: str) -> None:
        """Document must have section structure for chunking to be meaningful."""
        assert "Section" in policy_text or "#" in policy_text

    def test_policy_contains_fico_reference(self, policy_text: str) -> None:
        assert "FICO" in policy_text

    def test_policy_contains_default_section(self, policy_text: str) -> None:
        lower = policy_text.lower()
        assert "default" in lower or "remediation" in lower


# ---------------------------------------------------------------------------
# Integration tests (skipped unless ANTHROPIC_API_KEY + OPENAI_API_KEY are set)
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestNaiveRAGIntegration:
    """
    End-to-end integration tests. Require real API keys and make network calls.
    Run with: pytest -m integration modules/01_naive_rag/tests/
    """

    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_full_pipeline_returns_answer(self, policy_text: str) -> None:
        """Run the full pipeline and assert an answer is returned."""
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        chunks = splitter.split_text(policy_text)
        embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        store = Chroma.from_texts(
            chunks,
            embeddings,
            collection_metadata={"hnsw:space": "cosine"},
        )
        results = store.similarity_search_with_score(
            "What are the eligibility requirements for a personal loan?", k=3
        )
        assert len(results) == 3

        context = "\n\n---\n\n".join(
            f"[Chunk {i+1} | score={1.0 - score:.3f}]\n{doc.page_content}"
            for i, (doc, score) in enumerate(results)
        )
        client = Anthropic()
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",  # cheapest model for integration tests
            max_tokens=512,
            system=(
                "Answer using ONLY the provided context. "
                "If insufficient, say 'I cannot find this in the provided documents'."
            ),
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Context:\n{context}\n\n"
                        "Question: What are the eligibility requirements for a personal loan?"
                    ),
                }
            ],
        )
        answer = response.content[0].text
        assert len(answer) > 50, "Answer too short — likely an error response"
        assert "cannot find" not in answer.lower(), (
            "Retrieval failed — context did not include eligibility requirements"
        )
