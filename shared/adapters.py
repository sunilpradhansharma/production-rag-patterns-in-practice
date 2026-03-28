"""
Module: shared.adapters
RAG Layer: Orchestration

LlamaIndex ↔ LangChain adapters. Some patterns (Sentence Window, RAPTOR)
are implemented using LlamaIndex. These adapters wrap LlamaIndex query
engines so they can be used as BaseRetriever instances in a LangChain-style
pipeline, and vice versa.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRetriever
from shared.types import RetrievedChunk


class LlamaIndexRetrieverAdapter(BaseRetriever):
    """Wraps a LlamaIndex retriever as a BaseRetriever.

    Converts LlamaIndex ``NodeWithScore`` objects to ``RetrievedChunk``
    so they can be used in any LangChain-based pipeline without modification.

    Args:
        llama_retriever: Any LlamaIndex retriever with a ``retrieve(query)``
            method that returns a list of NodeWithScore objects.
    """

    def __init__(self, llama_retriever: Any) -> None:
        self._retriever = llama_retriever

    def retrieve(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        nodes = self._retriever.retrieve(query)[:k]
        chunks: list[RetrievedChunk] = []
        for node in nodes:
            source = ""
            if hasattr(node.node, "metadata"):
                source = node.node.metadata.get("file_name", "") or node.node.metadata.get(
                    "source", ""
                )
            chunks.append(
                RetrievedChunk(
                    content=node.node.get_content(),
                    score=float(node.score) if node.score is not None else 0.0,
                    source=source,
                    chunk_id=node.node.node_id,
                    metadata=node.node.metadata if hasattr(node.node, "metadata") else {},
                )
            )
        return chunks


class LangChainRetrieverAdapter:
    """Wraps a BaseRetriever as a LangChain-compatible retriever.

    Implements the LangChain ``get_relevant_documents(query)`` interface so
    a shared BaseRetriever can be dropped into any LangChain chain or agent.

    Args:
        retriever: Any BaseRetriever implementation.
        k: Number of documents to return per query.
    """

    def __init__(self, retriever: BaseRetriever, k: int = 5) -> None:
        self._retriever = retriever
        self._k = k

    def get_relevant_documents(self, query: str) -> list[Any]:
        """Return LangChain Document objects for the query.

        Args:
            query: Natural language query.

        Returns:
            List of ``langchain_core.documents.Document`` objects.
        """
        from langchain_core.documents import Document

        chunks = self._retriever.retrieve(query, k=self._k)
        return [
            Document(
                page_content=chunk.content,
                metadata={
                    "source": chunk.source,
                    "score": chunk.score,
                    "chunk_id": chunk.chunk_id,
                    **chunk.metadata,
                },
            )
            for chunk in chunks
        ]

    async def aget_relevant_documents(self, query: str) -> list[Any]:
        """Async variant — delegates to the synchronous implementation."""
        return self.get_relevant_documents(query)
