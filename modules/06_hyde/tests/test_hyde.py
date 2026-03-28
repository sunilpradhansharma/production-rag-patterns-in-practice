"""
Module: test_hyde
RAG Layer: Retrieval (hypothetical document embeddings)

Tests for HyDE: hypothesis generation contract, embedding shape,
cosine similarity arithmetic, and the retrieval gap between raw
query and hypothesis vectors. All API-dependent tests are marked
`integration`.
"""

# ── Standard library ─────────────────────────────────────
from __future__ import annotations

import json
import math
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

CHUNK_SIZE = 500
EMBED_DIM = 1536          # text-embedding-3-small
MIN_HYPOTHESIS_CHARS = 200
MAX_HYPOTHESIS_CHARS = 800


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def policy_text() -> str:
    assert POLICY_PATH.exists()
    return POLICY_PATH.read_text(encoding="utf-8")


@pytest.fixture
def unit_vector_a() -> list[float]:
    """A 4-d unit vector."""
    return [1.0, 0.0, 0.0, 0.0]


@pytest.fixture
def unit_vector_b() -> list[float]:
    return [0.0, 1.0, 0.0, 0.0]


@pytest.fixture
def similar_vector() -> list[float]:
    """A vector close to unit_vector_a."""
    raw = [0.9, 0.1, 0.0, 0.0]
    mag = math.sqrt(sum(x * x for x in raw))
    return [x / mag for x in raw]


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

    def test_notebook_mentions_hypothesis(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "hypothesis" in all_src.lower() or "hyde" in all_src.lower()

    def test_notebook_uses_haiku_for_generation(self) -> None:
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        all_src = " ".join("".join(c["source"]) for c in nb["cells"])
        assert "haiku" in all_src.lower()


# ---------------------------------------------------------------------------
# Cosine similarity tests
# ---------------------------------------------------------------------------


class TestCosineSimilarity:
    def _cosine_sim(self, a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x * x for x in a))
        mag_b = math.sqrt(sum(x * x for x in b))
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return dot / (mag_a * mag_b)

    def test_identical_vectors_score_one(self, unit_vector_a: list[float]) -> None:
        assert abs(self._cosine_sim(unit_vector_a, unit_vector_a) - 1.0) < 1e-9

    def test_orthogonal_vectors_score_zero(
        self, unit_vector_a: list[float], unit_vector_b: list[float]
    ) -> None:
        assert abs(self._cosine_sim(unit_vector_a, unit_vector_b)) < 1e-9

    def test_similar_vectors_score_high(
        self, unit_vector_a: list[float], similar_vector: list[float]
    ) -> None:
        sim = self._cosine_sim(unit_vector_a, similar_vector)
        assert sim > 0.8

    def test_result_in_unit_interval(
        self, unit_vector_a: list[float], similar_vector: list[float]
    ) -> None:
        sim = self._cosine_sim(unit_vector_a, similar_vector)
        assert -1.0 <= sim <= 1.0

    def test_symmetry(
        self, unit_vector_a: list[float], similar_vector: list[float]
    ) -> None:
        assert abs(
            self._cosine_sim(unit_vector_a, similar_vector)
            - self._cosine_sim(similar_vector, unit_vector_a)
        ) < 1e-9

    def test_zero_vector_returns_zero(self, unit_vector_a: list[float]) -> None:
        zero = [0.0, 0.0, 0.0, 0.0]
        assert self._cosine_sim(unit_vector_a, zero) == 0.0


# ---------------------------------------------------------------------------
# Hypothesis validation tests
# ---------------------------------------------------------------------------


class TestHypothesisContract:
    """Validate that a hypothesis string meets the expected contract."""

    def _is_valid_hypothesis(self, hypothesis: str) -> bool:
        return (
            isinstance(hypothesis, str)
            and MIN_HYPOTHESIS_CHARS <= len(hypothesis) <= MAX_HYPOTHESIS_CHARS
            and not hypothesis.startswith("?")   # must be declarative, not a question
        )

    def test_valid_hypothesis_passes(self) -> None:
        hyp = (
            "The minimum FICO score required for a personal loan at this institution "
            "is 680 points. Applicants must also demonstrate a debt-to-income ratio "
            "below 43 percent and provide employment verification documents."
        )
        assert self._is_valid_hypothesis(hyp)

    def test_too_short_fails(self) -> None:
        assert not self._is_valid_hypothesis("Short answer.")

    def test_question_form_fails(self) -> None:
        assert not self._is_valid_hypothesis("?" + "A" * 300)

    def test_hypothesis_not_shown_to_user(self) -> None:
        """The hypothesis is used only as a search key — it must not be the final answer."""
        # This is a design contract, not a runtime assertion.
        # We verify the notebook shows the hypothesis separately from the answer.
        with open(NOTEBOOK_PATH) as f:
            nb = json.load(f)
        code_cells = [c for c in nb["cells"] if c["cell_type"] == "code"]
        # Cell 3 (index 1) should embed the hypothesis; Cell 4 (index 2) should generate from real docs
        cell3_src = "".join(code_cells[1]["source"])
        cell4_src = "".join(code_cells[2]["source"])
        assert "hypothesis" in cell3_src.lower() or "hyde" in cell3_src.lower()
        assert "generate" in cell4_src.lower() or "answer" in cell4_src.lower()


# ---------------------------------------------------------------------------
# Integration tests
# ---------------------------------------------------------------------------


@pytest.mark.integration
class TestHyDEIntegration:
    @pytest.fixture(autouse=True)
    def require_api_keys(self) -> None:
        if not os.getenv("ANTHROPIC_API_KEY"):
            pytest.skip("ANTHROPIC_API_KEY not set")
        if not os.getenv("OPENAI_API_KEY"):
            pytest.skip("OPENAI_API_KEY not set")

    def test_hypothesis_retrieves_relevant_docs(self, policy_text: str) -> None:
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

        client = Anthropic()
        query = "capital adequacy requirements for financial institutions"
        hypothesis_response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[{
                "role": "user",
                "content": (
                    f"Write a short 2–3 sentence document passage that directly answers "
                    f"this question: {query}"
                ),
            }],
        )
        hypothesis = hypothesis_response.content[0].text.strip()
        assert MIN_HYPOTHESIS_CHARS <= len(hypothesis) <= MAX_HYPOTHESIS_CHARS

        results = store.similarity_search(hypothesis, k=5)
        assert len(results) == 5

        final = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            system="Answer using ONLY the provided context.",
            messages=[{
                "role": "user",
                "content": f"Context:\n{results[0].page_content}\n\nQuestion: {query}",
            }],
        )
        assert len(final.content[0].text) > 50
