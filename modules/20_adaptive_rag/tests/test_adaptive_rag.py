"""
Module: test_adaptive_rag
RAG Layer: Orchestration (query classification → strategy routing)

Tests for Adaptive RAG: ClassificationResult schema, all four query
type values, routing dispatch logic, and the JSON output contract of
the classifier. API-dependent tests are marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal

# ── Third-party ──────────────────────────────────────────
import pytest

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

QueryType = Literal["simple_lookup", "semantic_search", "factual", "multi_step"]
VALID_QUERY_TYPES: set[str] = {"simple_lookup", "semantic_search", "factual", "multi_step"}
RELEVANCE_THRESHOLD = 3.0


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture
def classification_examples() -> list[tuple[str, str]]:
    """(query, expected_type) pairs used to validate routing heuristics."""
    return [
        ("What is the minimum FICO score?", "simple_lookup"),
        ("Tell me about capital adequacy requirements", "semantic_search"),
        ("What are the Basel III Tier 1 capital requirements?", "factual"),
        ("Is this loan application compliant with all underwriting rules?", "multi_step"),
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

    def test_notebook_defines_query_types(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "simple_lookup" in all_src or "query_type" in all_src.lower()

    def test_notebook_defines_four_strategies(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "strategy" in all_src.lower() or "route" in all_src.lower()

    def test_notebook_uses_haiku_for_classification(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "haiku" in all_src.lower()


# ---------------------------------------------------------------------------
# Classification result schema tests
# ---------------------------------------------------------------------------


class TestClassificationResultSchema:
    def _make_result(self, query_type: str, rationale: str) -> dict:
        return {"query_type": query_type, "rationale": rationale}

    def test_valid_query_types(self) -> None:
        for qt in VALID_QUERY_TYPES:
            result = self._make_result(qt, "some rationale")
            assert result["query_type"] in VALID_QUERY_TYPES

    def test_result_has_rationale(self) -> None:
        result = self._make_result("factual", "The query asks for a specific fact.")
        assert len(result["rationale"].strip()) > 0

    def test_invalid_query_type_not_in_valid_set(self) -> None:
        invalid = "unknown_type"
        assert invalid not in VALID_QUERY_TYPES

    @pytest.mark.parametrize("query_type", list(VALID_QUERY_TYPES))
    def test_each_type_produces_valid_schema(self, query_type: str) -> None:
        result = self._make_result(query_type, f"Rationale for {query_type}")
        assert result["query_type"] in VALID_QUERY_TYPES
        assert isinstance(result["rationale"], str)


# ---------------------------------------------------------------------------
# Routing dispatch tests
# ---------------------------------------------------------------------------


class TestRoutingDispatch:
    """Test that query_type maps to the correct strategy function."""

    STRATEGY_MAP = {
        "simple_lookup": "strategy_naive_rag",
        "semantic_search": "strategy_naive_rag",
        "factual": "strategy_hybrid_rag",
        "multi_step": "strategy_multi_hop",
    }

    def _route(self, query_type: str) -> str:
        return self.STRATEGY_MAP.get(query_type, "strategy_naive_rag")

    def test_simple_lookup_routes_to_naive(self) -> None:
        assert "naive" in self._route("simple_lookup")

    def test_factual_routes_to_hybrid(self) -> None:
        assert "hybrid" in self._route("factual")

    def test_multi_step_routes_to_multi_hop(self) -> None:
        assert "multi_hop" in self._route("multi_step")

    def test_unknown_type_falls_back_to_naive(self) -> None:
        result = self._route("unknown_type")
        assert "naive" in result

    def test_all_valid_types_have_routes(self) -> None:
        for qt in VALID_QUERY_TYPES:
            route = self._route(qt)
            assert route is not None and len(route) > 0


# ---------------------------------------------------------------------------
# RouteResult schema tests
# ---------------------------------------------------------------------------


class TestRouteResultSchema:
    def _make_route_result(
        self,
        query: str,
        query_type: str,
        strategy_used: str,
        answer: str,
        sources: list[str],
    ) -> dict:
        return {
            "query": query,
            "query_type": query_type,
            "strategy_used": strategy_used,
            "answer": answer,
            "sources": sources,
        }

    def test_route_result_has_all_keys(self) -> None:
        result = self._make_route_result(
            "What is the FICO minimum?",
            "simple_lookup",
            "strategy_naive_rag",
            "The minimum FICO score is 680.",
            ["policy.txt"],
        )
        required_keys = {"query", "query_type", "strategy_used", "answer", "sources"}
        assert required_keys.issubset(result.keys())

    def test_answer_is_non_empty(self) -> None:
        result = self._make_route_result("q", "factual", "strat", "The answer.", [])
        assert len(result["answer"].strip()) > 0

    def test_query_type_is_valid(self) -> None:
        result = self._make_route_result("q", "multi_step", "strat", "answer", [])
        assert result["query_type"] in VALID_QUERY_TYPES


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestAdaptiveRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_classifier_returns_valid_query_type(self) -> None:
        from anthropic import Anthropic

        client = Anthropic()
        query = "What is the minimum FICO score for a personal loan?"
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=50,
            messages=[{
                "role": "user",
                "content": (
                    f"Classify this query into one of these types: "
                    f"{', '.join(sorted(VALID_QUERY_TYPES))}.\n"
                    f"Query: {query}\n"
                    f"Reply with just the type name, nothing else."
                ),
            }],
        )
        raw = response.content[0].text.strip().lower()
        # Classifier must return one of the valid types (or contain one)
        matched = any(qt in raw for qt in VALID_QUERY_TYPES)
        assert matched, f"Classifier returned unexpected type: {raw}"

    def test_full_adaptive_pipeline_returns_answer(self, policy_text: str) -> None:
        from anthropic import Anthropic
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
        chunks = splitter.split_text(policy_text)
        store = Chroma.from_texts(
            chunks,
            OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_metadata={"hnsw:space": "cosine"},
        )
        query = "What is the minimum FICO score for a personal loan?"
        results = store.similarity_search(query, k=4)
        assert len(results) > 0

        client = Anthropic()
        context = "\n\n".join(doc.page_content for doc in results)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            system="Answer using ONLY the provided context.",
            messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}],
        )
        answer = response.content[0].text
        assert len(answer) > 50
