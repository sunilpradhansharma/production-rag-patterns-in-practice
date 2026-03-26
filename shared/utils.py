"""
Module: shared.utils
RAG Layer: Cross-cutting

Timing, logging, and token-counting helpers used across all RAG pattern
modules. Keep these stateless and free of heavy dependencies.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
import logging
import time
from collections.abc import Generator
from contextlib import contextmanager
from functools import wraps
from typing import Any, Callable, TypeVar

F = TypeVar("F", bound=Callable[..., Any])

# ── Logging ───────────────────────────────────────────────────────────────────

def setup_logging(level: int = logging.INFO, fmt: str | None = None) -> None:
    """Configure root-level logging for the whole application.

    Call once at notebook or script startup (Cell 1) to set a consistent
    format across all shared/ modules. Subsequent calls to ``get_logger()``
    will inherit this configuration automatically.

    Args:
        level: Root log level (e.g. ``logging.DEBUG``, ``logging.WARNING``).
            Defaults to ``logging.INFO``.
        fmt: Log format string. Defaults to the workshop standard format
            ``"%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"``.
    """
    fmt = fmt or "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    logging.basicConfig(level=level, format=fmt, force=True)


def get_logger(name: str) -> logging.Logger:
    """Return a consistently configured logger for the given module name.

    Args:
        name: Logger name — pass ``__name__`` from the calling module.

    Returns:
        Configured ``logging.Logger`` instance.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")
        )
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


# ── Timing ────────────────────────────────────────────────────────────────────

@contextmanager
def timer(label: str = "") -> Generator[dict[str, float], None, None]:
    """Context manager that records elapsed milliseconds.

    Usage::

        with timer("retrieval") as t:
            chunks = retriever.retrieve(query)
        print(f"Took {t['ms']:.1f} ms")
    """
    result: dict[str, float] = {"ms": 0.0}
    start = time.perf_counter()
    try:
        yield result
    finally:
        result["ms"] = (time.perf_counter() - start) * 1000
        if label:
            print(f"[{label}] {result['ms']:.1f} ms")


def timing_decorator(label: str = "") -> Callable[[F], F]:
    """Decorator that prints the execution time of a function.

    Wraps any function and prints ``[<label>] X.X ms`` after each call.
    Use this in notebooks to instrument retrieval and generation steps
    without restructuring the code under measurement.

    Args:
        label: Human-readable label for the timing output. Defaults to the
            function name if not provided.

    Returns:
        Decorated function with the same signature.

    Example::

        @timing_decorator("embed_query")
        def embed(text: str) -> list[float]:
            return model.embed(text)
    """
    def decorator(fn: F) -> F:
        @wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            tag = label or fn.__name__
            with timer(tag):
                return fn(*args, **kwargs)
        return wrapper  # type: ignore[return-value]
    return decorator


# ── Token counting ────────────────────────────────────────────────────────────

def count_tokens(text: str, model: str = "cl100k_base") -> int:
    """Estimate token count for a string using tiktoken.

    Falls back to a word-based approximation if tiktoken is not installed.

    Args:
        text: The text to count tokens for.
        model: tiktoken encoding name. Defaults to ``cl100k_base`` (GPT-4 / Ada v2).

    Returns:
        Estimated token count.
    """
    try:
        import tiktoken
        enc = tiktoken.get_encoding(model)
        return len(enc.encode(text))
    except ImportError:
        # Rough approximation: ~0.75 tokens per word
        return int(len(text.split()) * 1.33)


def truncate_to_tokens(text: str, max_tokens: int, model: str = "cl100k_base") -> str:
    """Truncate text to at most ``max_tokens`` tokens.

    Args:
        text: Input text.
        max_tokens: Maximum number of tokens to retain.
        model: tiktoken encoding name.

    Returns:
        Truncated text. If already within limit, returns text unchanged.
    """
    try:
        import tiktoken
        enc = tiktoken.get_encoding(model)
        tokens = enc.encode(text)
        if len(tokens) <= max_tokens:
            return text
        return enc.decode(tokens[:max_tokens])
    except ImportError:
        # Rough word-based fallback
        words = text.split()
        cutoff = int(max_tokens / 1.33)
        return " ".join(words[:cutoff])


# ── Display helpers ───────────────────────────────────────────────────────────

def print_chunks(chunks: list[Any], max_content_len: int = 200) -> None:
    """Pretty-print a list of RetrievedChunk objects for notebook output.

    Args:
        chunks: List of RetrievedChunk instances.
        max_content_len: Maximum characters to display per chunk.
    """
    for i, chunk in enumerate(chunks, 1):
        content_preview = chunk.content[:max_content_len].replace("\n", " ")
        if len(chunk.content) > max_content_len:
            content_preview += "..."
        print(f"  [{i}] score={chunk.score:.3f} | source={chunk.source!r}")
        print(f"      {content_preview}")
        print()


def print_answer(query: str, answer: str, sources: list[str] | None = None) -> None:
    """Print a formatted query/answer block for notebook output.

    Args:
        query: The user query.
        answer: The generated answer.
        sources: Optional list of source document names to cite.
    """
    print("=" * 70)
    print(f"QUERY:  {query}")
    print("-" * 70)
    print(f"ANSWER: {answer}")
    if sources:
        print("-" * 70)
        print("SOURCES:")
        for src in sources:
            print(f"  • {src}")
    print("=" * 70)
