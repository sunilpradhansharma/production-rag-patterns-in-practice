"""
Module: shared.decorators
RAG Layer: Retrieval, Observability

Retriever decorators that add cross-cutting behaviour (caching, reranking,
logging) without modifying the underlying retriever. Demonstrated in the
Modular RAG and Advanced RAG pattern modules.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
import hashlib
import json
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRetriever
from shared.types import RetrievedChunk
from shared.utils import get_logger

logger = get_logger(__name__)


class CachedRetriever(BaseRetriever):
    """Wraps a retriever with an in-process LRU-style cache.

    Caches the top-k results for each (query, k) pair. Useful for demos and
    evaluation loops that issue the same query multiple times.

    Args:
        retriever: The underlying retriever to cache.
        max_size: Maximum number of cache entries (default: 128).
    """

    def __init__(self, retriever: BaseRetriever, max_size: int = 128) -> None:
        self._retriever = retriever
        self._max_size = max_size
        self._cache: dict[str, list[RetrievedChunk]] = {}

    def _cache_key(self, query: str, k: int) -> str:
        payload = json.dumps({"q": query, "k": k}, sort_keys=True)
        return hashlib.sha256(payload.encode()).hexdigest()[:16]

    def retrieve(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        key = self._cache_key(query, k)
        if key in self._cache:
            logger.debug("Cache hit for query: %r", query[:60])
            return self._cache[key]

        results = self._retriever.retrieve(query, k=k)

        # Evict oldest entry if cache is full
        if len(self._cache) >= self._max_size:
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]

        self._cache[key] = results
        return results

    @property
    def cache_size(self) -> int:
        return len(self._cache)

    def clear_cache(self) -> None:
        self._cache.clear()


class RerankedRetriever(BaseRetriever):
    """Wraps a retriever with a reranking step.

    Retrieves more candidates than requested (``fetch_k``), then reranks
    them using the provided reranker and returns the top ``k``.

    Args:
        retriever: Base retriever for initial candidate fetch.
        reranker: Any object with a ``rerank(query, chunks, top_n)`` method.
        fetch_k: How many candidates to fetch before reranking (default: 20).
    """

    def __init__(
        self,
        retriever: BaseRetriever,
        reranker: Any,
        fetch_k: int = 20,
    ) -> None:
        self._retriever = retriever
        self._reranker = reranker
        self._fetch_k = fetch_k

    def retrieve(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        candidates = self._retriever.retrieve(query, k=self._fetch_k)
        return self._reranker.rerank(query, candidates, top_n=k)


class LoggedRetriever(BaseRetriever):
    """Wraps a retriever with structured logging of every call.

    Logs query, number of results, top score, and latency. Useful for
    debugging retrieval quality during development and evaluation.

    Args:
        retriever: The underlying retriever to log.
        log_level: Python logging level (default: logging.INFO).
    """

    def __init__(self, retriever: BaseRetriever, log_level: int = 20) -> None:
        self._retriever = retriever
        self._log_level = log_level

    def retrieve(self, query: str, k: int = 5) -> list[RetrievedChunk]:
        import time
        start = time.perf_counter()
        results = self._retriever.retrieve(query, k=k)
        elapsed_ms = (time.perf_counter() - start) * 1000

        top_score = results[0].score if results else 0.0
        logger.log(
            self._log_level,
            "retrieve | query=%r | k=%d | returned=%d | top_score=%.3f | %.1fms",
            query[:60],
            k,
            len(results),
            top_score,
            elapsed_ms,
        )
        return results
