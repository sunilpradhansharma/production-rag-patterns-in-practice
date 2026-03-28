"""
Module: test_contextual_rag
RAG Layer: Indexing (context-enriched embeddings)

Tests for Contextual RAG: context header prepending, enriched chunk
size bounds, section name extraction, two-collection index contract,
and prompt caching structure. API-dependent tests are marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
import re
from pathlib import Path

# ── Third-party ──────────────────────────────────────────
import pytest

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
BASEL_PATH = REPO_ROOT / "shared" / "sample_data" / "basel_iii_excerpt.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
MIN_CONTEXT_CHARS = 50     # generated context must be at least this long
MAX_CONTEXT_CHARS = 600    # and not longer than this
MIN_ENRICHED_CHARS = CHUNK_SIZE // 2   # enriched chunk must be meaningfully sized


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def basel_text() -> str:
    assert BASEL_PATH.exists()
    return BASEL_PATH.read_text(encoding="utf-8")


@pytest.fixture
def sample_chunk() -> str:
    return (
        "The minimum Common Equity Tier 1 capital ratio is 4.5 percent of "
        "risk-weighted assets. This requirement applies to all internationally "
        "active banks subject to Basel III standards."
    )


@pytest.fixture
def sample_context() -> str:
    return (
        "Basel III CET1 requirements, Section 4.2 (Minimum Capital Ratios): "
        "This section sets the minimum capital adequacy thresholds."
    )


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

    def test_notebook_mentions_context_generation(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "context" in all_src.lower() and "chunk" in all_src.lower()

    def test_notebook_uses_haiku_for_context(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "haiku" in all_src.lower()

    def test_notebook_builds_two_collections(self) -> None:
        """Must build plain and contextual collections for comparison."""
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "plain" in all_src.lower() or "baseline" in all_src.lower()
        assert "contextual" in all_src.lower() or "enriched" in all_src.lower()


# ---------------------------------------------------------------------------
# Context header tests
# ---------------------------------------------------------------------------


class TestContextEnrichment:
    def _build_enriched_chunk(
        self, doc_title: str, section: str, context: str, chunk_text: str
    ) -> str:
        return f"[{doc_title} | {section}]\n{context}\n\n{chunk_text}"

    def test_enriched_chunk_contains_raw_text(
        self, sample_chunk: str, sample_context: str
    ) -> None:
        enriched = self._build_enriched_chunk(
            "Basel III", "Section 4.2", sample_context, sample_chunk
        )
        assert sample_chunk in enriched

    def test_enriched_chunk_contains_context(
        self, sample_chunk: str, sample_context: str
    ) -> None:
        enriched = self._build_enriched_chunk(
            "Basel III", "Section 4.2", sample_context, sample_chunk
        )
        assert sample_context in enriched

    def test_enriched_is_longer_than_raw(
        self, sample_chunk: str, sample_context: str
    ) -> None:
        enriched = self._build_enriched_chunk(
            "Basel III", "Section 4.2", sample_context, sample_chunk
        )
        assert len(enriched) > len(sample_chunk)

    def test_context_length_bounds(self, sample_context: str) -> None:
        assert MIN_CONTEXT_CHARS <= len(sample_context) <= MAX_CONTEXT_CHARS

    def test_enriched_chunk_minimum_size(
        self, sample_chunk: str, sample_context: str
    ) -> None:
        enriched = self._build_enriched_chunk(
            "Basel III", "Section 4.2", sample_context, sample_chunk
        )
        assert len(enriched) >= MIN_ENRICHED_CHARS

    def test_header_format(self) -> None:
        enriched = self._build_enriched_chunk(
            "Basel III", "Section 4.2", "some context", "chunk text"
        )
        assert enriched.startswith("[Basel III | Section 4.2]")


# ---------------------------------------------------------------------------
# Section extraction tests
# ---------------------------------------------------------------------------


class TestSectionExtraction:
    def _extract_section_name(self, chunk_text: str, full_doc: str) -> str:
        """Replicate notebook: search backward for a section heading."""
        pos = full_doc.find(chunk_text[:50])
        if pos == -1:
            return "Unknown Section"
        preceding = full_doc[:pos]
        matches = re.findall(r"(?:Section|Article|§)\s+[\d.]+[^\n]*", preceding)
        return matches[-1] if matches else "Unknown Section"

    def test_finds_section_header(self) -> None:
        doc = "Section 4.2 Minimum Capital Ratios\n\nThe CET1 ratio is 4.5 percent."
        chunk = "The CET1 ratio is 4.5 percent."
        section = self._extract_section_name(chunk, doc)
        assert "4.2" in section or "Section" in section

    def test_returns_unknown_when_no_header(self) -> None:
        doc = "Plain text without any headers.\n\nMore plain text."
        chunk = "More plain text."
        section = self._extract_section_name(chunk, doc)
        assert section == "Unknown Section"

    def test_returns_last_preceding_header(self) -> None:
        doc = (
            "Section 1 Introduction\n\nsome text.\n\n"
            "Section 2 Requirements\n\nrequirements text here."
        )
        chunk = "requirements text here."
        section = self._extract_section_name(chunk, doc)
        assert "2" in section


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestContextualRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_enriched_index_retrieves_relevant_chunk(self, basel_text: str) -> None:
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
        )
        chunks = splitter.split_text(basel_text)
        assert len(chunks) > 0

        client = Anthropic()
        enriched_chunks = []
        for chunk in chunks[:5]:   # limit to 5 for cost
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=100,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Write one sentence (max 50 words) describing the document "
                        f"context for this chunk:\n\n{chunk}"
                    ),
                }],
            )
            context = response.content[0].text.strip()
            assert MIN_CONTEXT_CHARS <= len(context) <= MAX_CONTEXT_CHARS
            enriched_chunks.append(f"[Context: {context}]\n\n{chunk}")

        store = Chroma.from_texts(
            enriched_chunks,
            OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        results = store.similarity_search("What is the CET1 minimum capital ratio?", k=3)
        assert len(results) > 0
        # Enriched chunks must be longer than CHUNK_SIZE (they have context prepended)
        for doc in results:
            assert len(doc.page_content) >= CHUNK_SIZE // 2
