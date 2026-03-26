"""
Module: shared.proxy
RAG Layer: Retrieval

SemanticCacheProxy — wraps a full RAGPipeline and returns cached answers for
semantically similar queries. Reduces API costs during demos and evaluation
by avoiding redundant LLM calls for near-duplicate questions.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from dataclasses import dataclass
from typing import Any

# ── Third-party ───────────────────────────────────────────────────────────────
import numpy as np

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRAGPipeline
from shared.types import PipelineOutput
from shared.utils import get_logger

logger = get_logger(__name__)


@dataclass
class _CacheEntry:
    query: str
    embedding: list[float]
    output: PipelineOutput


class SemanticCacheProxy(BaseRAGPipeline):
    """Semantic cache layer in front of a RAG pipeline.

    On each call, embeds the query and checks if a sufficiently similar query
    has been answered before. If the cosine similarity to a cached query
    exceeds ``threshold``, the cached answer is returned immediately.

    Args:
        pipeline: The underlying RAGPipeline to call on cache misses.
        embeddings: An embedding model with an ``embed_query(text)`` method.
        threshold: Cosine similarity threshold for cache hits (default: 0.92).
        max_size: Maximum number of cached entries (default: 256).
    """

    def __init__(
        self,
        pipeline: BaseRAGPipeline,
        embeddings: Any,
        threshold: float = 0.92,
        max_size: int = 256,
    ) -> None:
        self._pipeline = pipeline
        self._embeddings = embeddings
        self._threshold = threshold
        self._max_size = max_size
        self._cache: list[_CacheEntry] = []
        self._hits = 0
        self._misses = 0

    def run(self, query: str, **kwargs: Any) -> PipelineOutput:
        query_emb = self._embeddings.embed_query(query)

        # Check for a semantic cache hit
        for entry in self._cache:
            sim = self._cosine_similarity(query_emb, entry.embedding)
            if sim >= self._threshold:
                self._hits += 1
                logger.debug(
                    "Semantic cache hit (sim=%.3f) for query: %r", sim, query[:60]
                )
                return entry.output

        # Cache miss — call the real pipeline
        self._misses += 1
        output = self._pipeline.run(query, **kwargs)

        # Evict oldest entry if cache is full
        if len(self._cache) >= self._max_size:
            self._cache.pop(0)

        self._cache.append(_CacheEntry(query=query, embedding=query_emb, output=output))
        return output

    @property
    def hit_rate(self) -> float:
        total = self._hits + self._misses
        return self._hits / total if total > 0 else 0.0

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        va = np.array(a, dtype=np.float32)
        vb = np.array(b, dtype=np.float32)
        denom = np.linalg.norm(va) * np.linalg.norm(vb)
        return float(np.dot(va, vb) / denom) if denom > 0 else 0.0
