"""
Module: shared.visitors
RAG Layer: Pre/Post-processing

Document visitors that transform chunks before indexing or after retrieval.
PIIRedactor removes sensitive financial data from chunks before they are
stored or returned. MetadataEnricher adds structured metadata fields.
"""

from __future__ import annotations

# ── Standard library ─────────────────────────────────────────────────────────
import re
from abc import ABC, abstractmethod

# ── Local ────────────────────────────────────────────────────────────────────
from shared.types import RetrievedChunk


class ChunkVisitor(ABC):
    """Abstract visitor for RetrievedChunk transformation."""

    @abstractmethod
    def visit(self, chunk: RetrievedChunk) -> RetrievedChunk:
        """Transform a chunk and return the result.

        Args:
            chunk: Input chunk to transform.

        Returns:
            Transformed chunk (may be a new instance).
        """

    def visit_all(self, chunks: list[RetrievedChunk]) -> list[RetrievedChunk]:
        """Apply the visitor to every chunk in a list."""
        return [self.visit(chunk) for chunk in chunks]


class PIIRedactor(ChunkVisitor):
    """Redacts common PII patterns from chunk content.

    Targets: credit card numbers, SSNs, phone numbers, email addresses,
    and US bank account number patterns. Returns a new RetrievedChunk with
    redacted content; all other fields are preserved.

    Note: This is a best-effort pattern-based redactor for demo purposes.
    Production systems should use a dedicated NLP-based PII detection service.
    """

    _PATTERNS: list[tuple[str, str]] = [
        # Credit card (Visa, MC, Amex — with or without dashes/spaces)
        (r"\b(?:\d[ -]?){13,16}\b", "[CARD_REDACTED]"),
        # US SSN
        (r"\b\d{3}[- ]\d{2}[- ]\d{4}\b", "[SSN_REDACTED]"),
        # US phone
        (r"\b(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b", "[PHONE_REDACTED]"),
        # Email address
        (r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b", "[EMAIL_REDACTED]"),
        # US routing/account numbers (9-digit)
        (r"\b\d{9}\b", "[ACCOUNT_REDACTED]"),
    ]

    def visit(self, chunk: RetrievedChunk) -> RetrievedChunk:
        content = chunk.content
        for pattern, replacement in self._PATTERNS:
            content = re.sub(pattern, replacement, content)
        return RetrievedChunk(
            content=content,
            score=chunk.score,
            source=chunk.source,
            chunk_id=chunk.chunk_id,
            metadata={**chunk.metadata, "pii_redacted": True},
        )


class MetadataEnricher(ChunkVisitor):
    """Adds computed metadata fields to each chunk.

    Adds: ``token_count`` (approximate), ``char_count``, and
    any static ``extra_fields`` provided at construction time.

    Args:
        extra_fields: Static key/value pairs to add to every chunk's metadata.
    """

    def __init__(self, extra_fields: dict[str, str] | None = None) -> None:
        self._extra = extra_fields or {}

    def visit(self, chunk: RetrievedChunk) -> RetrievedChunk:
        enriched_metadata = {
            **chunk.metadata,
            "char_count": len(chunk.content),
            # Approximate token count: ~0.75 tokens per word
            "token_count_approx": int(len(chunk.content.split()) * 1.33),
            **self._extra,
        }
        return RetrievedChunk(
            content=chunk.content,
            score=chunk.score,
            source=chunk.source,
            chunk_id=chunk.chunk_id,
            metadata=enriched_metadata,
        )
