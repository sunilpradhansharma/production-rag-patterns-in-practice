"""
Module: shared.pipeline
RAG Layer: Orchestration

RAGPipeline facade — the primary entry point for running a RAG query.
Composes a retriever, optional reranker, and LLM into a single callable
object. Pattern modules either use this directly or subclass BaseRAGPipeline
to implement custom orchestration logic.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
import time
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRAGPipeline, BaseRetriever
from shared.types import PipelineConfig, PipelineOutput, RetrievedChunk
from shared.utils import get_logger

logger = get_logger(__name__)


class RAGPipeline(BaseRAGPipeline):
    """Concrete RAG pipeline that wires retriever + LLM.

    This is the standard pipeline used by Naive RAG and serves as the
    reference implementation that more sophisticated patterns extend.

    Args:
        retriever: Any BaseRetriever implementation.
        config: Runtime configuration (top_k, model, temperature, max_tokens, rerank, verbose).
        llm_client: Anthropic client instance. If None, generation is skipped
            and only retrieval results are returned (useful for testing).
    """

    def __init__(
        self,
        retriever: BaseRetriever,
        config: PipelineConfig | None = None,
        llm_client: Any = None,
    ) -> None:
        self.retriever = retriever
        self.config = config or PipelineConfig()
        self.llm_client = llm_client
        self._system_prompt = (
            "You are a helpful financial analyst assistant. Answer the user's question "
            "using only the provided context. If the context does not contain enough "
            "information to answer, say so. Always cite the source of your information."
        )

    def run(self, query: str, **kwargs: Any) -> PipelineOutput:
        """Execute retrieve → generate for a query.

        Args:
            query: Natural language query.
            **kwargs: Overrides for top_k, max_tokens, system_prompt.

        Returns:
            PipelineOutput with answer, chunks, and timing metadata.
        """
        start = time.perf_counter()
        k = kwargs.get("top_k", self.config.top_k)

        if self.config.verbose:
            logger.info("Retrieving %d chunks for query: %r", k, query[:80])

        chunks: list[RetrievedChunk] = self.retriever.retrieve(query, k=k)

        if not chunks:
            return PipelineOutput(
                query=query,
                answer="No relevant documents found.",
                chunks=[],
                latency_ms=(time.perf_counter() - start) * 1000,
            )

        answer = self._generate(query, chunks, **kwargs)
        latency_ms = (time.perf_counter() - start) * 1000

        if self.config.verbose:
            logger.info("Pipeline completed in %.1f ms", latency_ms)

        return PipelineOutput(
            query=query,
            answer=answer,
            chunks=chunks,
            latency_ms=latency_ms,
        )

    def _generate(self, query: str, chunks: list[RetrievedChunk], **kwargs: Any) -> str:
        """Call the LLM to generate an answer grounded in retrieved chunks.

        Args:
            query: The user's question.
            chunks: Retrieved context chunks.
            **kwargs: max_tokens, system_prompt overrides.

        Returns:
            Generated answer string.
        """
        if self.llm_client is None:
            # No LLM configured — return a formatted context block for inspection.
            context_preview = "\n".join(
                f"[{i+1}] {c.content[:100]}..." for i, c in enumerate(chunks)
            )
            return f"[No LLM configured. Retrieved context:\n{context_preview}]"

        context = "\n\n".join(
            f"Source: {c.source}\n{c.content}" for c in chunks
        )
        user_message = f"Context:\n{context}\n\nQuestion: {query}"
        max_tokens = kwargs.get("max_tokens", self.config.max_tokens)
        system = kwargs.get("system_prompt", self._system_prompt)

        response = self.llm_client.messages.create(
            model=self.config.model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user_message}],
        )
        return str(response.content[0].text)
