"""
Module: shared.strategies
RAG Layer: Retrieval

Retrieval and rerank strategy interfaces. Define the contracts that
concrete strategy implementations must fulfil. Used by RetrieverFactory
and RAGPipelineBuilder.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from abc import ABC, abstractmethod
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.types import RetrievedChunk


class RetrievalStrategy(ABC):
    """Strategy interface for retrieval algorithms.

    Implementations include dense vector search, BM25, hybrid, HyDE, etc.
    """

    @abstractmethod
    def search(self, query: str, k: int, **kwargs: Any) -> list[RetrievedChunk]:
        """Search for the top-k chunks relevant to the query.

        Args:
            query: Natural language query.
            k: Maximum number of results.
            **kwargs: Strategy-specific parameters.

        Returns:
            Ranked list of RetrievedChunk objects.
        """


class RerankStrategy(ABC):
    """Strategy interface for reranking algorithms.

    Applied after initial retrieval to re-score and reorder candidates.
    Implementations include Cohere Rerank, cross-encoder, LLM-based rerank.
    """

    @abstractmethod
    def rerank(
        self, query: str, chunks: list[RetrievedChunk], top_n: int
    ) -> list[RetrievedChunk]:
        """Rerank a list of retrieved chunks for a given query.

        Args:
            query: The original query string.
            chunks: Initial retrieval results to rerank.
            top_n: Number of top results to return after reranking.

        Returns:
            Reranked list of RetrievedChunk objects (length ≤ top_n).
        """


class FusionStrategy(ABC):
    """Strategy interface for result fusion.

    Merges ranked lists from multiple retrievers (e.g., Reciprocal Rank
    Fusion used in RAG Fusion and Hybrid RAG patterns).
    """

    @abstractmethod
    def fuse(self, ranked_lists: list[list[RetrievedChunk]]) -> list[RetrievedChunk]:
        """Fuse multiple ranked lists into a single unified ranking.

        Args:
            ranked_lists: One list per retriever, each already sorted by
                descending relevance.

        Returns:
            Single fused and ranked list of RetrievedChunk objects.
        """
