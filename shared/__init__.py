"""
Module: shared
RAG Layer: Cross-cutting

Public API for the shared utilities package. Import pipeline components,
types, and helpers from here rather than from individual submodules.
"""

from __future__ import annotations

# ── Local ────────────────────────────────────────────────────────────────────
from shared.base import BaseRAGPipeline, BaseRetriever
from shared.config import Settings
from shared.pipeline import RAGPipeline
from shared.types import EvalMetrics, PipelineConfig, PipelineOutput, RetrievedChunk

__all__ = [
    "BaseRAGPipeline",
    "BaseRetriever",
    "EvalMetrics",
    "PipelineConfig",
    "PipelineOutput",
    "RAGPipeline",
    "RetrievedChunk",
    "Settings",
]
