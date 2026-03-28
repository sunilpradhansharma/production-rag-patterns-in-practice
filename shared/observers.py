"""
Module: shared.observers
RAG Layer: Observability

Observers that attach to a RAGPipeline to collect metrics, evaluation scores,
and latency data without coupling these concerns to the core pipeline logic.
Demonstrated in the Advanced RAG and Adaptive RAG modules.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
import time
from abc import ABC, abstractmethod
from typing import Any

# ── Local ────────────────────────────────────────────────────────────────────
from shared.types import PipelineOutput
from shared.utils import get_logger

logger = get_logger(__name__)


class PipelineObserver(ABC):
    """Base observer interface for RAG pipeline events."""

    @abstractmethod
    def on_run_complete(self, output: PipelineOutput) -> None:
        """Called after each pipeline.run() completes.

        Args:
            output: The complete PipelineOutput from the run.
        """


class LatencyObserver(PipelineObserver):
    """Tracks per-run latency and prints a rolling summary.

    Stores all observed latencies in memory. Call ``summary()`` to print
    min/max/mean stats.
    """

    def __init__(self) -> None:
        self.latencies: list[float] = []

    def on_run_complete(self, output: PipelineOutput) -> None:
        self.latencies.append(output.latency_ms)

    def summary(self) -> dict[str, float]:
        """Return latency statistics (min, max, mean, p95) in milliseconds."""
        if not self.latencies:
            return {}
        sorted_lats = sorted(self.latencies)
        n = len(sorted_lats)
        p95_idx = max(0, int(n * 0.95) - 1)
        return {
            "count": float(n),
            "min_ms": sorted_lats[0],
            "max_ms": sorted_lats[-1],
            "mean_ms": sum(sorted_lats) / n,
            "p95_ms": sorted_lats[p95_idx],
        }

    def print_summary(self) -> None:
        stats = self.summary()
        if not stats:
            print("LatencyObserver: no runs recorded.")
            return
        print(f"Latency summary ({int(stats['count'])} runs):")
        print(f"  min={stats['min_ms']:.1f}ms  mean={stats['mean_ms']:.1f}ms  "
              f"p95={stats['p95_ms']:.1f}ms  max={stats['max_ms']:.1f}ms")


class EvalObserver(PipelineObserver):
    """Collects query/answer/chunk data for offline evaluation.

    Stores runs in memory so they can be passed to a RAGAS evaluator or
    written to a JSONL file for batch evaluation.
    """

    def __init__(self) -> None:
        self.runs: list[dict[str, Any]] = []

    def on_run_complete(self, output: PipelineOutput) -> None:
        self.runs.append({
            "query": output.query,
            "answer": output.answer,
            "contexts": [c.content for c in output.chunks],
            "sources": output.top_sources,
            "latency_ms": output.latency_ms,
        })

    def export_jsonl(self, path: str) -> None:
        """Write all collected runs to a JSONL file for batch evaluation.

        Args:
            path: Destination file path (will be overwritten if exists).
        """
        import json
        with open(path, "w") as f:
            for run in self.runs:
                f.write(json.dumps(run) + "\n")
        logger.info("Exported %d runs to %s", len(self.runs), path)
