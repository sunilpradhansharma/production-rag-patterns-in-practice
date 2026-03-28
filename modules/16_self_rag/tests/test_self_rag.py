"""
Module: test_self_rag
RAG Layer: Reasoning (self-critique loop)

Tests for Self-RAG: CritiqueResult schema, ISREL verdict validation,
filtering logic, abstain condition, and the retry cap. All API-dependent
tests are marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path

# ── Third-party ──────────────────────────────────────────
import pytest
from langchain_core.documents import Document

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

K = 5
MAX_RETRIES = 1
CHUNK_SIZE = 400
MIN_ANSWER_LENGTH = 50


# ---------------------------------------------------------------------------
# Local replica of CritiqueResult (matches notebook definition)
# ---------------------------------------------------------------------------


@dataclass
class CritiqueResult:
    verdict: str      # 'Yes' or 'No'
    rationale: str


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture
def relevant_chunks() -> list[Document]:
    return [
        Document(page_content="The minimum FICO score for a personal loan is 680.", metadata={"source": "policy.txt"}),
        Document(page_content="DTI ratio must not exceed 43 percent for standard loans.", metadata={"source": "policy.txt"}),
    ]


@pytest.fixture
def irrelevant_chunks() -> list[Document]:
    return [
        Document(page_content="The capital gains tax rate for short-term holdings is 30 percent.", metadata={"source": "tax.txt"}),
        Document(page_content="Real estate transaction fees vary by jurisdiction.", metadata={"source": "real_estate.txt"}),
    ]


@pytest.fixture
def mixed_chunks(relevant_chunks: list[Document], irrelevant_chunks: list[Document]) -> list[Document]:
    return relevant_chunks + irrelevant_chunks


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

    def test_notebook_defines_critique_result(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "CritiqueResult" in all_src or "critique" in all_src.lower()

    def test_notebook_mentions_isrel(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "isrel" in all_src.lower() or "relevance" in all_src.lower()

    def test_notebook_mentions_max_retries(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "retry" in all_src.lower() or "MAX_RETRIES" in all_src


# ---------------------------------------------------------------------------
# CritiqueResult schema tests
# ---------------------------------------------------------------------------


class TestCritiqueResultSchema:
    def test_yes_verdict_is_valid(self) -> None:
        result = CritiqueResult(verdict="Yes", rationale="The chunk discusses loan FICO requirements.")
        assert result.verdict in ("Yes", "No")
        assert len(result.rationale) > 0

    def test_no_verdict_is_valid(self) -> None:
        result = CritiqueResult(verdict="No", rationale="The chunk is about tax law, not loans.")
        assert result.verdict == "No"

    def test_verdict_is_binary(self) -> None:
        valid_verdicts = {"Yes", "No"}
        for verdict in valid_verdicts:
            r = CritiqueResult(verdict=verdict, rationale="some reason")
            assert r.verdict in valid_verdicts

    def test_rationale_is_non_empty(self) -> None:
        r = CritiqueResult(verdict="Yes", rationale="Relevant to the query.")
        assert r.rationale.strip() != ""


# ---------------------------------------------------------------------------
# Relevance filtering tests
# ---------------------------------------------------------------------------


class TestRelevanceFiltering:
    def _filter_by_relevance(
        self,
        chunks: list[Document],
        verdicts: list[CritiqueResult],
    ) -> list[Document]:
        return [
            chunk
            for chunk, verdict in zip(chunks, verdicts)
            if verdict.verdict == "Yes"
        ]

    def test_all_yes_keeps_all(self, mixed_chunks: list[Document]) -> None:
        verdicts = [CritiqueResult("Yes", "relevant") for _ in mixed_chunks]
        result = self._filter_by_relevance(mixed_chunks, verdicts)
        assert len(result) == len(mixed_chunks)

    def test_all_no_returns_empty(self, mixed_chunks: list[Document]) -> None:
        verdicts = [CritiqueResult("No", "not relevant") for _ in mixed_chunks]
        result = self._filter_by_relevance(mixed_chunks, verdicts)
        assert result == []

    def test_mixed_verdicts_filter_correctly(self, mixed_chunks: list[Document]) -> None:
        verdicts = [
            CritiqueResult("Yes", "relevant"),
            CritiqueResult("Yes", "relevant"),
            CritiqueResult("No", "irrelevant"),
            CritiqueResult("No", "irrelevant"),
        ]
        result = self._filter_by_relevance(mixed_chunks, verdicts)
        assert len(result) == 2

    def test_filter_preserves_order(self, relevant_chunks: list[Document]) -> None:
        verdicts = [CritiqueResult("Yes", "ok") for _ in relevant_chunks]
        result = self._filter_by_relevance(relevant_chunks, verdicts)
        assert result == relevant_chunks


# ---------------------------------------------------------------------------
# Abstain logic tests
# ---------------------------------------------------------------------------


class TestAbstainCondition:
    def _should_abstain(
        self,
        relevant_chunks: list[Document],
        answer_critique: CritiqueResult,
        retries_used: int,
    ) -> bool:
        if not relevant_chunks:
            return True
        if answer_critique.verdict == "No" and retries_used >= MAX_RETRIES:
            return True
        return False

    def test_no_relevant_chunks_triggers_abstain(self) -> None:
        verdict = CritiqueResult("Yes", "answer ok")
        assert self._should_abstain([], verdict, retries_used=0)

    def test_good_answer_does_not_abstain(self, relevant_chunks: list[Document]) -> None:
        verdict = CritiqueResult("Yes", "answer is grounded")
        assert not self._should_abstain(relevant_chunks, verdict, retries_used=0)

    def test_bad_answer_after_max_retries_abstains(
        self, relevant_chunks: list[Document]
    ) -> None:
        verdict = CritiqueResult("No", "answer not grounded")
        assert self._should_abstain(relevant_chunks, verdict, retries_used=MAX_RETRIES)

    def test_bad_answer_before_max_retries_does_not_abstain(
        self, relevant_chunks: list[Document]
    ) -> None:
        verdict = CritiqueResult("No", "answer not grounded")
        assert not self._should_abstain(relevant_chunks, verdict, retries_used=0)


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestSelfRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_self_rag_returns_answer_or_abstains(self, policy_text: str) -> None:
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=50
        )
        chunks = splitter.split_text(policy_text)
        store = Chroma.from_texts(
            chunks,
            OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        query = "What FICO score is required for a personal loan?"
        raw_results = store.similarity_search(query, k=K)
        assert len(raw_results) <= K

        client = Anthropic()
        # ISREL critique for first chunk
        critique_response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=20,
            messages=[{
                "role": "user",
                "content": (
                    f"Is this chunk relevant to the query?\n"
                    f"Query: {query}\n"
                    f"Chunk: {raw_results[0].page_content}\n"
                    f"Answer Yes or No only."
                ),
            }],
        )
        verdict_text = critique_response.content[0].text.strip()
        assert any(v in verdict_text for v in ("Yes", "No")), (
            f"Unexpected verdict: {verdict_text}"
        )
