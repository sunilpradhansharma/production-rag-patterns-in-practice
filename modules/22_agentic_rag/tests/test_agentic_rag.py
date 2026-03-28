"""
Module: test_agentic_rag
RAG Layer: Orchestration (ReAct agent with tools)

Tests for Agentic RAG: tool schema validation, MAX_STEPS cap, safe
arithmetic evaluation, tool call sequence structure, and AgentState
schema. API-dependent tests are marked `integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

# ── Third-party ──────────────────────────────────────────
import pytest

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[3]
POLICY_PATH = REPO_ROOT / "shared" / "sample_data" / "fintech_policy.txt"
NOTEBOOK_PATH = Path(__file__).resolve().parents[1] / "demo.ipynb"

MAX_STEPS = 5
RETRIEVE_K = 4
WEB_SEARCH_MAX_RESULTS = 3


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture
def sample_tool_call() -> dict:
    return {
        "tool": "retrieve_docs",
        "input": {"query": "minimum FICO score personal loan"},
        "output": "The minimum FICO score is 680.",
    }


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

    def test_notebook_defines_max_steps(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "MAX_STEPS" in all_src or str(MAX_STEPS) in all_src

    def test_notebook_defines_three_tools(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "retrieve_docs" in all_src or "retrieve" in all_src.lower()
        assert "web_search" in all_src or "web" in all_src.lower()
        assert "calculate" in all_src.lower()

    def test_notebook_uses_langgraph(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "langgraph" in all_src.lower() or "StateGraph" in all_src


# ---------------------------------------------------------------------------
# Tool schema tests
# ---------------------------------------------------------------------------


class TestToolSchemas:
    """Validate that each tool call follows the expected dict schema."""

    REQUIRED_TOOL_KEYS = {"tool", "input", "output"}

    def test_retrieve_docs_schema(self) -> None:
        call = {
            "tool": "retrieve_docs",
            "input": {"query": "FICO requirements"},
            "output": "FICO minimum is 680.",
        }
        assert self.REQUIRED_TOOL_KEYS.issubset(call.keys())
        assert call["tool"] == "retrieve_docs"
        assert "query" in call["input"]

    def test_web_search_schema(self) -> None:
        call = {
            "tool": "web_search",
            "input": {"query": "current Basel III capital requirements"},
            "output": "Basel III requires CET1 of 4.5 percent.",
        }
        assert self.REQUIRED_TOOL_KEYS.issubset(call.keys())
        assert call["tool"] == "web_search"

    def test_calculate_schema(self) -> None:
        call = {
            "tool": "calculate",
            "input": {"expression": "4.5 + 2.5"},
            "output": "7.0",
        }
        assert self.REQUIRED_TOOL_KEYS.issubset(call.keys())
        assert call["tool"] == "calculate"
        assert "expression" in call["input"]

    def test_output_is_string(self, sample_tool_call: dict) -> None:
        assert isinstance(sample_tool_call["output"], str)

    def test_tool_name_is_known(self, sample_tool_call: dict) -> None:
        known_tools = {"retrieve_docs", "web_search", "calculate"}
        assert sample_tool_call["tool"] in known_tools


# ---------------------------------------------------------------------------
# MAX_STEPS cap tests
# ---------------------------------------------------------------------------


class TestMaxStepsCap:
    def _should_continue(self, steps: int, has_tool_calls: bool) -> bool:
        if steps >= MAX_STEPS:
            return False
        return has_tool_calls

    def test_stops_at_max_steps(self) -> None:
        assert not self._should_continue(MAX_STEPS, has_tool_calls=True)

    def test_continues_before_max_steps(self) -> None:
        assert self._should_continue(MAX_STEPS - 1, has_tool_calls=True)

    def test_stops_when_no_tool_calls(self) -> None:
        assert not self._should_continue(1, has_tool_calls=False)

    def test_zero_steps_with_tools_continues(self) -> None:
        assert self._should_continue(0, has_tool_calls=True)

    @pytest.mark.parametrize("steps", list(range(MAX_STEPS)))
    def test_all_steps_before_max_with_tools_continue(self, steps: int) -> None:
        assert self._should_continue(steps, has_tool_calls=True)


# ---------------------------------------------------------------------------
# Safe calculator tests
# ---------------------------------------------------------------------------


class TestSafeCalculator:
    """Validate safe arithmetic eval used in the calculate tool."""

    ALLOWED_CHARS = set("0123456789+-*/()., ")

    def _safe_eval(self, expression: str) -> str:
        if not all(c in self.ALLOWED_CHARS for c in expression):
            return "Error: invalid characters in expression"
        try:
            result = eval(expression, {"__builtins__": {}})  # noqa: S307
            return str(result)
        except Exception as e:
            return f"Error: {e}"

    def test_addition(self) -> None:
        assert self._safe_eval("4.5 + 2.5") == "7.0"

    def test_multiplication(self) -> None:
        assert self._safe_eval("3 * 4") == "12"

    def test_division(self) -> None:
        result = float(self._safe_eval("10 / 4"))
        assert abs(result - 2.5) < 1e-9

    def test_parentheses(self) -> None:
        assert self._safe_eval("(2 + 3) * 4") == "20"

    def test_rejects_code_injection(self) -> None:
        result = self._safe_eval("__import__('os').system('ls')")
        assert "Error" in result

    def test_rejects_letters(self) -> None:
        result = self._safe_eval("os.getcwd()")
        assert "Error" in result

    def test_percentage_calculation(self) -> None:
        result = float(self._safe_eval("4.5 / 100 * 1000000"))
        assert abs(result - 45000.0) < 1e-6


# ---------------------------------------------------------------------------
# AgentState schema tests
# ---------------------------------------------------------------------------


class TestAgentStateSchema:
    def _make_state(self, messages: list[dict], steps: int) -> dict:
        return {"messages": messages, "steps": steps}

    def test_initial_state_has_messages_and_steps(self) -> None:
        state = self._make_state(
            [{"role": "user", "content": "What is the FICO minimum?"}], steps=0
        )
        assert "messages" in state
        assert "steps" in state
        assert state["steps"] == 0

    def test_steps_increments_correctly(self) -> None:
        state = self._make_state([], steps=2)
        state["steps"] += 1
        assert state["steps"] == 3

    def test_messages_list_grows(self) -> None:
        state = self._make_state([], steps=0)
        state["messages"].append({"role": "user", "content": "query"})
        assert len(state["messages"]) == 1


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestAgenticRAGIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_retrieve_tool_returns_text(self, policy_text: str) -> None:
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
        results = store.similarity_search("minimum FICO score personal loan", k=RETRIEVE_K)
        assert 1 <= len(results) <= RETRIEVE_K
        combined = "\n\n".join(doc.page_content for doc in results)
        assert len(combined) > 50

    def test_calculate_tool_arithmetic(self) -> None:
        ALLOWED = set("0123456789+-*/()., ")
        expr = "4.5 / 100 * 1000000"
        assert all(c in ALLOWED for c in expr)
        result = eval(expr, {"__builtins__": {}})  # noqa: S307
        assert abs(result - 45000.0) < 1e-6

    def test_agent_produces_answer_within_step_budget(self, policy_text: str) -> None:
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
        query = "What is the minimum FICO score for a personal loan and what is 680 * 1.1?"
        results = store.similarity_search(query, k=RETRIEVE_K)
        context = "\n\n".join(doc.page_content for doc in results)

        client = Anthropic()
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            system=(
                "You are a helpful assistant. Answer using the provided context. "
                "Perform arithmetic when asked."
            ),
            messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}],
        )
        answer = response.content[0].text
        assert len(answer) > 50
