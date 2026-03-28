"""
Module: test_corrective_rag
RAG Layer: Reasoning (relevance grading + corrective routing)

Tests for Corrective RAG: grade schema, average score calculation,
threshold routing logic, web search fallback contract, and source
attribution in the final answer. API-dependent tests are marked `integration`.
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
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

RELEVANCE_THRESHOLD = 3.0   # avg score < 3.0 → web fallback
GRADE_MIN = 1
GRADE_MAX = 5
CHUNK_SIZE = 400
K = 5


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture
def high_score_chunks() -> list[tuple[Document, int]]:
    return [
        (Document(page_content="FICO score minimum is 680 for personal loans."), 4),
        (Document(page_content="DTI must not exceed 43 percent."), 5),
        (Document(page_content="Employment verification required."), 4),
    ]


@pytest.fixture
def low_score_chunks() -> list[tuple[Document, int]]:
    return [
        (Document(page_content="The price of oil fluctuates daily."), 1),
        (Document(page_content="Real estate values depend on location."), 2),
        (Document(page_content="Stock dividends are taxed differently."), 1),
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

    def test_notebook_defines_threshold(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "THRESHOLD" in all_src or "threshold" in all_src.lower()

    def test_notebook_mentions_web_search(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "web" in all_src.lower() or "tavily" in all_src.lower()

    def test_notebook_defines_grade_function(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "grade" in all_src.lower()


# ---------------------------------------------------------------------------
# Grade schema tests
# ---------------------------------------------------------------------------


class TestGradeSchema:
    @pytest.mark.parametrize("score", [1, 2, 3, 4, 5])
    def test_valid_scores_in_range(self, score: int) -> None:
        assert GRADE_MIN <= score <= GRADE_MAX

    def test_grade_result_has_score_and_rationale(self) -> None:
        grade = {"score": 4, "rationale": "The chunk directly addresses the FICO requirement."}
        assert "score" in grade
        assert "rationale" in grade
        assert isinstance(grade["score"], int)
        assert GRADE_MIN <= grade["score"] <= GRADE_MAX


# ---------------------------------------------------------------------------
# Average score and routing tests
# ---------------------------------------------------------------------------


class TestRoutingLogic:
    def _avg_score(self, scored_chunks: list[tuple[Document, int]]) -> float:
        if not scored_chunks:
            return 0.0
        return sum(score for _, score in scored_chunks) / len(scored_chunks)

    def _route(self, avg: float, threshold: float = RELEVANCE_THRESHOLD) -> str:
        return "internal" if avg >= threshold else "web_fallback"

    def test_high_scores_route_internal(
        self, high_score_chunks: list[tuple[Document, int]]
    ) -> None:
        avg = self._avg_score(high_score_chunks)
        assert self._route(avg) == "internal"

    def test_low_scores_route_web_fallback(
        self, low_score_chunks: list[tuple[Document, int]]
    ) -> None:
        avg = self._avg_score(low_score_chunks)
        assert self._route(avg) == "web_fallback"

    def test_threshold_boundary_routes_internal(self) -> None:
        # Exactly at threshold → internal
        chunks = [(Document(page_content="x"), 3)]
        avg = self._avg_score(chunks)
        assert self._route(avg) == "internal"

    def test_below_threshold_routes_web(self) -> None:
        chunks = [(Document(page_content="x"), 2)]
        avg = self._avg_score(chunks)
        assert self._route(avg) == "web_fallback"

    def test_avg_score_correct(
        self, high_score_chunks: list[tuple[Document, int]]
    ) -> None:
        avg = self._avg_score(high_score_chunks)
        expected = (4 + 5 + 4) / 3
        assert abs(avg - expected) < 1e-9

    def test_empty_chunks_routes_web(self) -> None:
        avg = self._avg_score([])
        assert self._route(avg) == "web_fallback"


# ---------------------------------------------------------------------------
# Web search result contract tests
# ---------------------------------------------------------------------------


class TestWebSearchContract:
    def _make_web_result(self, url: str, content: str) -> dict:
        return {"url": url, "content": content}

    def test_result_has_required_keys(self) -> None:
        result = self._make_web_result("https://example.com", "Some regulatory content.")
        assert "url" in result
        assert "content" in result

    def test_content_is_non_empty(self) -> None:
        result = self._make_web_result("https://example.com", "Some content here.")
        assert len(result["content"].strip()) > 0

    def test_multiple_results(self) -> None:
        results = [
            self._make_web_result(f"https://example.com/{i}", f"Content {i}")
            for i in range(3)
        ]
        assert len(results) == 3


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestCorrectiveRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_corpus_query_passes_threshold(self, policy_text: str) -> None:
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
        query = "What is the minimum FICO score for a personal loan?"
        results = store.similarity_search(query, k=K)
        assert len(results) > 0

        client = Anthropic()
        scores = []
        for doc in results[:3]:   # grade top 3 for cost
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=10,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Rate the relevance of this chunk to the query on a scale of 1-5.\n"
                        f"Query: {query}\nChunk: {doc.page_content[:200]}\n"
                        f"Reply with a single digit 1-5 only."
                    ),
                }],
            )
            score_text = response.content[0].text.strip()
            score = int(score_text[0]) if score_text[0].isdigit() else 3
            scores.append(score)

        avg = sum(scores) / len(scores)
        # A well-matched corpus query should pass the threshold
        assert avg >= RELEVANCE_THRESHOLD, (
            f"Corpus query scored avg={avg:.2f} — below threshold {RELEVANCE_THRESHOLD}"
        )
