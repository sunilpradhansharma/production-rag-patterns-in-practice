"""
Module: shared.builders
RAG Layer: Orchestration

RAGPipelineBuilder — fluent builder for assembling RAG pipelines step by
step. Notebooks use this to construct pipelines without needing to know
the internal wiring of retriever, reranker, and LLM components.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRetriever
from shared.pipeline import RAGPipeline
from shared.types import PipelineConfig


class RAGPipelineBuilder:
    """Fluent builder for RAGPipeline instances.

    Example::

        pipeline = (
            RAGPipelineBuilder()
            .with_retriever(my_retriever)
            .with_llm(anthropic_client)
            .with_k(8)
            .verbose()
            .build()
        )
        output = pipeline.run("What is the Basel III capital requirement?")
    """

    def __init__(self) -> None:
        self._retriever: BaseRetriever | None = None
        self._llm_client: Any = None
        self._k: int = 5
        self._rerank: bool = False
        self._verbose: bool = False
        self._max_tokens: int = 1024
        self._system_prompt: str | None = None

    def with_retriever(self, retriever: BaseRetriever) -> RAGPipelineBuilder:
        """Set the retriever component."""
        self._retriever = retriever
        return self

    def with_llm(self, client: Any) -> RAGPipelineBuilder:
        """Set the LLM client (Anthropic client instance)."""
        self._llm_client = client
        return self

    def with_k(self, k: int) -> RAGPipelineBuilder:
        """Override the default retrieval k (default: 5)."""
        self._k = k
        return self

    def with_rerank(self, enabled: bool = True) -> RAGPipelineBuilder:
        """Enable or disable reranking (default: disabled)."""
        self._rerank = enabled
        return self

    def with_max_tokens(self, max_tokens: int) -> RAGPipelineBuilder:
        """Override max generation tokens (default: 1024)."""
        self._max_tokens = max_tokens
        return self

    def with_system_prompt(self, prompt: str) -> RAGPipelineBuilder:
        """Override the system prompt used for generation."""
        self._system_prompt = prompt
        return self

    def verbose(self, enabled: bool = True) -> RAGPipelineBuilder:
        """Enable verbose logging of pipeline steps."""
        self._verbose = enabled
        return self

    def build(self) -> RAGPipeline:
        """Assemble and return the configured RAGPipeline.

        Raises:
            ValueError: If no retriever has been provided.
        """
        if self._retriever is None:
            msg = "RAGPipelineBuilder requires a retriever. Call .with_retriever() first."
            raise ValueError(msg)

        config = PipelineConfig(
            top_k=self._k,
            rerank=self._rerank,
            verbose=self._verbose,
            max_tokens=self._max_tokens,
        )
        pipeline = RAGPipeline(
            retriever=self._retriever,
            config=config,
            llm_client=self._llm_client,
        )
        if self._system_prompt:
            pipeline._system_prompt = self._system_prompt
        return pipeline
