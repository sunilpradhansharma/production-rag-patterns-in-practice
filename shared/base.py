"""
Module: shared.base
RAG Layer: Cross-cutting

Abstract base classes for RAG pipelines and retrievers. All pattern-specific
implementations in modules/ subclass these to guarantee a consistent interface
across all 26 patterns.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from abc import ABC, abstractmethod
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.types import PipelineOutput, RetrievedChunk


class BaseRetriever(ABC):
    """Abstract retriever interface.

    All retrievers in this workshop accept a query string and return a ranked
    list of RetrievedChunk objects. Subclass this to implement pattern-specific
    retrieval strategies (dense, sparse, hybrid, hypothetical, etc.).
    """

    @abstractmethod
    def retrieve(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        """Retrieve the top-k chunks most relevant to the query.

        Args:
            query: Natural language query string.
            k: Maximum number of chunks to return.

        Returns:
            List of RetrievedChunk objects, sorted by descending relevance score.
        """

    def __call__(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        """Allow retrievers to be called directly as functions."""
        return self.retrieve(query, k)


class BaseRAGPipeline(ABC):
    """Abstract RAG pipeline interface.

    A pipeline wires together a retriever, optional reranker, and LLM to
    produce a grounded answer for a given query. Each of the 26 pattern modules
    implements (or wraps) this interface so notebooks share a consistent
    call signature.
    """

    @abstractmethod
    def run(self, query: str, **kwargs: Any) -> PipelineOutput:
        """Execute the full RAG pipeline for a query.

        Args:
            query: Natural language query string.
            **kwargs: Pattern-specific keyword arguments (e.g., k, filters).

        Returns:
            PipelineOutput containing the answer, retrieved chunks, and metadata.
        """

    def __call__(self, query: str, **kwargs: Any) -> PipelineOutput:
        """Allow pipelines to be called directly as functions."""
        return self.run(query, **kwargs)

    def batch(self, queries: list[str], **kwargs: Any) -> list[PipelineOutput]:
        """Run the pipeline on multiple queries sequentially.

        Args:
            queries: List of query strings.
            **kwargs: Forwarded to each ``run`` call.

        Returns:
            List of PipelineOutput objects in the same order as queries.
        """
        return [self.run(q, **kwargs) for q in queries]
