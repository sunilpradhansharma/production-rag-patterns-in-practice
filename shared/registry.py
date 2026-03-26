"""
Module: shared.registry
RAG Layer: Indexing

EmbeddingModelRegistry — maps model names to instantiated embedding objects.
Prevents multiple notebooks from creating duplicate embedding model instances
and allows easy model swapping for evaluation experiments.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.utils import get_logger

logger = get_logger(__name__)


class EmbeddingModelRegistry:
    """Registry of named embedding model instances.

    Models are lazily instantiated on first access and cached for reuse.
    Notebooks call ``EmbeddingModelRegistry.get("openai-small")`` instead of
    constructing embeddings directly.
    """

    _instances: dict[str, Any] = {}

    # Map of short names → (provider, model_id) tuples
    _MODEL_CATALOG: dict[str, tuple[str, str]] = {
        "openai-small": ("openai", "text-embedding-3-small"),
        "openai-large": ("openai", "text-embedding-3-large"),
        "openai-ada": ("openai", "text-embedding-ada-002"),
        "sentence-mpnet": ("sentence_transformers", "all-mpnet-base-v2"),
        "sentence-minilm": ("sentence_transformers", "all-MiniLM-L6-v2"),
    }

    @classmethod
    def get(cls, name: str, **kwargs: Any) -> Any:
        """Return (and cache) an embedding model instance.

        Args:
            name: Short model name from the catalog (e.g. ``"openai-small"``).
            **kwargs: Extra constructor kwargs forwarded to the embedding class.

        Returns:
            Instantiated embedding model object.

        Raises:
            ValueError: If the name is not in the catalog.
        """
        if name not in cls._MODEL_CATALOG:
            available = ", ".join(sorted(cls._MODEL_CATALOG))
            msg = f"Unknown embedding model '{name}'. Available: {available}"
            raise ValueError(msg)

        if name not in cls._instances:
            provider, model_id = cls._MODEL_CATALOG[name]
            cls._instances[name] = cls._build(provider, model_id, **kwargs)
            logger.info("Instantiated embedding model '%s' (%s)", name, model_id)

        return cls._instances[name]

    @classmethod
    def _build(cls, provider: str, model_id: str, **kwargs: Any) -> Any:
        if provider == "openai":
            from langchain_openai import OpenAIEmbeddings
            return OpenAIEmbeddings(model=model_id, **kwargs)
        if provider == "sentence_transformers":
            from langchain_community.embeddings import HuggingFaceEmbeddings
            return HuggingFaceEmbeddings(model_name=model_id, **kwargs)
        msg = f"Unknown embedding provider: {provider}"
        raise ValueError(msg)

    @classmethod
    def clear(cls) -> None:
        """Clear all cached instances (useful between test runs)."""
        cls._instances.clear()

    @classmethod
    def available(cls) -> list[str]:
        """Return sorted list of registered model names."""
        return sorted(cls._MODEL_CATALOG)
