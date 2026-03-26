"""
Module: shared.types
RAG Layer: Cross-cutting

Shared dataclass definitions used across all RAG pattern modules.
Centralising types here avoids circular imports and keeps interfaces stable
as patterns evolve.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from dataclasses import dataclass, field
from typing import Any


@dataclass
class RetrievedChunk:
    """A single retrieved document chunk with its retrieval score and provenance.

    Args:
        content: The raw text of the chunk.
        score: Retrieval relevance score (higher = more relevant). Normalised
            to [0, 1] for vector similarity; raw BM25 scores are left as-is.
        source: Source document identifier (filename or URL).
        chunk_id: Unique identifier for this chunk within the index.
        metadata: Arbitrary key/value pairs from the index (page number,
            section heading, timestamp, etc.).
    """

    content: str
    score: float
    source: str = ""
    chunk_id: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)

    def __repr__(self) -> str:
        preview = self.content[:80].replace("\n", " ")
        return (
            f"RetrievedChunk(score={self.score:.3f}, "
            f"source={self.source!r}, "
            f"content={preview!r}...)"
        )


@dataclass
class PipelineConfig:
    """Runtime configuration for a single RAG pipeline run.

    Separate from ``Settings`` (which is loaded from environment variables at
    import time). Pass a ``PipelineConfig`` instance at call time to control
    model choice and retrieval behaviour per query.

    Args:
        model: Anthropic model ID to use for generation.
        temperature: Sampling temperature for generation (0.0 = deterministic).
        max_tokens: Maximum tokens to generate in the answer.
        top_k: Number of chunks to retrieve from the index.
        rerank: Whether to apply a second-stage reranker after initial retrieval.
        verbose: Whether to emit per-step log messages during the pipeline run.
    """

    model: str = "claude-sonnet-4-6"
    temperature: float = 0.0
    max_tokens: int = 1024
    top_k: int = 5
    rerank: bool = False
    verbose: bool = False


@dataclass
class PipelineOutput:
    """The complete output of a RAG pipeline run.

    Args:
        query: The original user query.
        answer: The LLM-generated answer string.
        chunks: Retrieved chunks used as context for generation.
        latency_ms: Wall-clock time for the full pipeline run in milliseconds.
        metadata: Pattern-specific metadata (e.g. routing decision, grade scores).
    """

    query: str
    answer: str
    chunks: list[RetrievedChunk]
    latency_ms: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def num_chunks(self) -> int:
        """Number of chunks retrieved."""
        return len(self.chunks)

    @property
    def top_sources(self) -> list[str]:
        """Unique source documents cited, in order of first appearance."""
        seen: set[str] = set()
        sources: list[str] = []
        for chunk in self.chunks:
            if chunk.source and chunk.source not in seen:
                seen.add(chunk.source)
                sources.append(chunk.source)
        return sources


@dataclass
class EvalMetrics:
    """Evaluation scores for a single pipeline run.

    Supports both RAGAS metrics (faithfulness, answer_relevancy, etc.) and
    the three headline metrics most useful for comparing patterns side-by-side:
    retrieval precision, answer relevance, and latency.

    Args:
        query: The query that was evaluated.
        answer: The pipeline's generated answer.
        ground_truth: The reference answer used for comparison.
        retrieval_precision: Fraction of retrieved chunks that are relevant
            to the query (0.0–1.0).
        answer_relevance: How relevant the generated answer is to the query,
            as scored by the evaluator (0.0–1.0).
        latency_ms: End-to-end pipeline latency in milliseconds.
        faithfulness: RAGAS faithfulness score (answer grounded in context).
        context_recall: RAGAS context recall (ground truth covered by context).
        metadata: Additional scores or debug information from the evaluator.
    """

    query: str
    answer: str
    ground_truth: str = ""
    retrieval_precision: float = 0.0
    answer_relevance: float = 0.0
    latency_ms: float = 0.0
    faithfulness: float = 0.0
    context_recall: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)
