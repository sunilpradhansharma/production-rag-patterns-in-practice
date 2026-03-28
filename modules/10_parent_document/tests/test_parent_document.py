"""
Module: test_parent_document
RAG Layer: Indexing (parent-child two-layer retrieval)

Tests for Parent Document RAG: chunk hierarchy, context expansion
ratio, parent lookup, and the invariant that retrieved documents are
parents (not children). All API-dependent tests are marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
from pathlib import Path

# ── Third-party ──────────────────────────────────────────
import pytest
from langchain_core.documents import Document

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
BASEL_PATH = REPO_ROOT / "shared" / "sample_data" / "basel_iii_excerpt.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

PARENT_SIZE = 2000
CHILD_SIZE = 400
CHILD_OVERLAP = 50
MIN_CONTEXT_EXPANSION = 3.0    # parent / child size ratio


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def basel_text() -> str:
    assert BASEL_PATH.exists(), f"Sample data not found: {BASEL_PATH}"
    return BASEL_PATH.read_text(encoding="utf-8")


@pytest.fixture(scope="module")
def synthetic_parents() -> list[Document]:
    """Three synthetic parent documents for hierarchy tests."""
    return [
        Document(page_content="A" * PARENT_SIZE, metadata={"doc_id": "p1"}),
        Document(page_content="B" * PARENT_SIZE, metadata={"doc_id": "p2"}),
        Document(page_content="C" * PARENT_SIZE, metadata={"doc_id": "p3"}),
    ]


@pytest.fixture(scope="module")
def synthetic_children(synthetic_parents: list[Document]) -> list[Document]:
    """Children produced by splitting each parent into CHILD_SIZE chunks."""
    children = []
    for parent in synthetic_parents:
        text = parent.page_content
        start = 0
        child_index = 0
        while start < len(text):
            end = min(start + CHILD_SIZE, len(text))
            children.append(
                Document(
                    page_content=text[start:end],
                    metadata={
                        "parent_doc_id": parent.metadata["doc_id"],
                        "child_index": child_index,
                    },
                )
            )
            start += CHILD_SIZE - CHILD_OVERLAP
            child_index += 1
    return children


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

    def test_notebook_mentions_parent(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "parent" in all_src.lower()

    def test_notebook_mentions_child(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "child" in all_src.lower()

    def test_notebook_defines_parent_size(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert str(PARENT_SIZE) in all_src

    def test_notebook_defines_child_size(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert str(CHILD_SIZE) in all_src


# ---------------------------------------------------------------------------
# Hierarchy tests
# ---------------------------------------------------------------------------


class TestChunkHierarchy:
    def test_child_count_exceeds_parent_count(
        self,
        synthetic_parents: list[Document],
        synthetic_children: list[Document],
    ) -> None:
        assert len(synthetic_children) > len(synthetic_parents)

    def test_each_child_has_parent_reference(
        self, synthetic_children: list[Document]
    ) -> None:
        for child in synthetic_children:
            assert "parent_doc_id" in child.metadata

    def test_all_parent_ids_referenced(
        self,
        synthetic_parents: list[Document],
        synthetic_children: list[Document],
    ) -> None:
        parent_ids = {p.metadata["doc_id"] for p in synthetic_parents}
        child_parent_ids = {c.metadata["parent_doc_id"] for c in synthetic_children}
        assert parent_ids == child_parent_ids

    def test_children_per_parent_reasonable(
        self,
        synthetic_parents: list[Document],
        synthetic_children: list[Document],
    ) -> None:
        for parent in synthetic_parents:
            pid = parent.metadata["doc_id"]
            count = sum(
                1 for c in synthetic_children if c.metadata["parent_doc_id"] == pid
            )
            # PARENT_SIZE=2000, CHILD_SIZE=400, OVERLAP=50 → ~5–6 children
            assert 3 <= count <= 10, f"Parent {pid} has unexpected child count: {count}"


# ---------------------------------------------------------------------------
# Context expansion tests
# ---------------------------------------------------------------------------


class TestContextExpansion:
    def test_parent_is_larger_than_child(self) -> None:
        assert PARENT_SIZE > CHILD_SIZE

    def test_expansion_ratio_exceeds_minimum(self) -> None:
        ratio = PARENT_SIZE / CHILD_SIZE
        assert ratio >= MIN_CONTEXT_EXPANSION

    def test_child_is_substring_of_parent(self) -> None:
        parent_text = "Hello world this is a long regulatory document section." * 40
        child_text = parent_text[:CHILD_SIZE]
        assert child_text in parent_text

    @pytest.mark.parametrize("parent_size,child_size", [
        (2000, 400),
        (1500, 300),
        (3000, 500),
    ])
    def test_various_size_ratios(self, parent_size: int, child_size: int) -> None:
        assert parent_size / child_size >= MIN_CONTEXT_EXPANSION


# ---------------------------------------------------------------------------
# Parent lookup tests
# ---------------------------------------------------------------------------


class TestParentLookup:
    def _find_parent_for(
        self,
        child_text: str,
        parents: list[Document],
    ) -> str | None:
        for parent in parents:
            if child_text in parent.page_content:
                return parent.metadata["doc_id"]
        return None

    def test_find_parent_by_substring(
        self, synthetic_parents: list[Document]
    ) -> None:
        parent = synthetic_parents[0]
        child_text = parent.page_content[:CHILD_SIZE]
        found_id = self._find_parent_for(child_text, synthetic_parents)
        assert found_id == parent.metadata["doc_id"]

    def test_unknown_child_returns_none(
        self, synthetic_parents: list[Document]
    ) -> None:
        result = self._find_parent_for("ZZZZZ_not_in_any_parent", synthetic_parents)
        assert result is None


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestParentDocumentIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_parent_document_retriever_returns_parents(self, basel_text: str) -> None:
        from langchain.storage import InMemoryStore
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from langchain.retrievers import ParentDocumentRetriever

        child_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHILD_SIZE, chunk_overlap=CHILD_OVERLAP
        )
        parent_splitter = RecursiveCharacterTextSplitter(
            chunk_size=PARENT_SIZE, chunk_overlap=100
        )
        store = Chroma(
            embedding_function=OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        docstore = InMemoryStore()
        retriever = ParentDocumentRetriever(
            vectorstore=store,
            docstore=docstore,
            child_splitter=child_splitter,
            parent_splitter=parent_splitter,
        )
        retriever.add_documents([Document(page_content=basel_text, metadata={"source": "basel_iii"})])
        results = retriever.invoke("What is the minimum Tier 1 capital ratio?")
        assert len(results) > 0
        # Retrieved documents must be parents (larger than child size)
        for doc in results:
            assert len(doc.page_content) > CHILD_SIZE, (
                f"Retrieved doc appears to be a child ({len(doc.page_content)} chars)"
            )
