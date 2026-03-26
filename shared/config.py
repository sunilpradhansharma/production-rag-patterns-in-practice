"""
Module: shared.config
RAG Layer: Cross-cutting

Pydantic settings model for the RAG pipeline. All configuration is read
from environment variables (or .env file via python-dotenv), never hardcoded.
"""

from __future__ import annotations

# ── Third-party ───────────────────────────────────────────────────────────────
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Global settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── API Keys ──────────────────────────────────────────────────────────────
    anthropic_api_key: str = Field(default="", description="Anthropic API key for LLM generation")
    openai_api_key: str = Field(default="", description="OpenAI API key for embeddings")
    cohere_api_key: str = Field(default="", description="Cohere API key for reranking (optional)")
    tavily_api_key: str = Field(default="", description="Tavily API key for web search (optional)")

    # ── Model selection ───────────────────────────────────────────────────────
    llm_model: str = Field(default="claude-sonnet-4-6", description="Anthropic model ID")
    embedding_model: str = Field(
        default="text-embedding-3-small", description="OpenAI embedding model"
    )

    # ── Retrieval defaults ────────────────────────────────────────────────────
    retrieval_k: int = Field(default=5, description="Number of chunks to retrieve")
    chunk_size: int = Field(default=512, description="Default chunk size in tokens")
    chunk_overlap: int = Field(default=64, description="Default chunk overlap in tokens")

    # ── Storage ───────────────────────────────────────────────────────────────
    chroma_persist_dir: str = Field(
        default="./chroma_db", description="ChromaDB persistence directory"
    )

    # ── Offline mode ─────────────────────────────────────────────────────────
    rag_offline_mode: bool = Field(
        default=False,
        description="Use pre-cached fixtures instead of live API calls",
    )


# Module-level singleton — import and use directly in notebooks and modules.
settings = Settings()
