"""
Module: shared.factories
RAG Layer: Retrieval

RetrieverFactory — centralises the construction of retriever objects so
notebooks don't need to repeat boilerplate setup code. Each pattern module
can call the factory with a strategy name and get a ready-to-use retriever.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRetriever


class RetrieverFactory:
    """Creates retriever instances by strategy name.

    Supported strategies (registered on demand as modules are built):
    - ``"dense"``   — pure vector similarity search (Chroma + OpenAI embeddings)
    - ``"sparse"``  — BM25 keyword search (rank_bm25)
    - ``"hybrid"``  — weighted combination of dense + sparse (Module 03)
    - ``"parent"``  — parent document retrieval (Module 10)
    - ``"contextual"`` — Anthropic contextual RAG (Module 13)

    New strategies are registered via ``RetrieverFactory.register()``.
    """

    _registry: dict[str, type[BaseRetriever]] = {}

    @classmethod
    def register(cls, name: str, retriever_class: type[BaseRetriever]) -> None:
        """Register a retriever class under a strategy name.

        Args:
            name: Short strategy identifier (e.g. ``"dense"``).
            retriever_class: Concrete BaseRetriever subclass to instantiate.
        """
        cls._registry[name] = retriever_class

    @classmethod
    def create(cls, strategy: str, **kwargs: Any) -> BaseRetriever:
        """Instantiate a retriever for the given strategy.

        Args:
            strategy: Strategy name (must be previously registered).
            **kwargs: Constructor arguments forwarded to the retriever class.

        Returns:
            Configured BaseRetriever instance.

        Raises:
            ValueError: If the strategy name is not registered.
        """
        if strategy not in cls._registry:
            available = ", ".join(sorted(cls._registry)) or "(none registered yet)"
            msg = f"Unknown retrieval strategy '{strategy}'. Available: {available}"
            raise ValueError(msg)
        return cls._registry[strategy](**kwargs)

    @classmethod
    def available(cls) -> list[str]:
        """Return a sorted list of registered strategy names."""
        return sorted(cls._registry)
