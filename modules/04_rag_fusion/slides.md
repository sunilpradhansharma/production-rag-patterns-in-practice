# 04: RAG Fusion — Query Perspective Diversity

---

## The Problem: One Query, One Slice of the Corpus

A single query retrieves documents that match *your* phrasing. Documents covering the same topic under different terminology are silently missed.

A compliance analyst asking "reporting obligations for suspicious transactions" misses:

| Phrasing | Retrieved? |
|----------|-----------|
| "SAR filing requirements" | ✗ |
| "unusual activity reporting" | ✗ |
| "AML disclosure thresholds" | ✗ |
| "suspicious transaction reporting obligations" | ✓ |

Different phrasings retrieve different relevant chunks — fuse them for completeness.

---

## The Solution: Multiple Angles, One Fused Result

Generate 3–5 rephrasings of the original query, retrieve for each, then merge all ranked lists using Reciprocal Rank Fusion.

```
Query → Generate N variants → Retrieve for each → RRF merge → Top-k → Generate
```

**Reciprocal Rank Fusion** scores each document across all lists: `score = Σ 1 / (60 + rank)`. Documents appearing in multiple lists receive additive boosts.

---

## Architecture

![Architecture](architecture.png)

---

## Fintech: Market Sentiment Analysis

**Query:** *"What is the market outlook for emerging market bonds?"*

| Variant | Angle |
|---------|-------|
| Original | "market outlook for emerging market bonds" |
| Variant 1 | "EM bond yield forecasts and risk appetite" |
| Variant 2 | "developing country fixed income sentiment" |
| Variant 3 | "sovereign debt outlook in frontier markets" |

Each variant surfaces different analyst reports and news sources. Fusion delivers a complete picture across all coverage angles.

---

## Tradeoffs

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Retrieval coverage | ★★★★☆ | Multi-angle retrieval catches vocabulary-mismatched documents |
| Answer quality | ★★★★☆ | Richer, more complete context improves open-ended responses |
| Latency | ★★☆☆☆ | N retrieval calls — parallelise in production |
| Cost | ★★☆☆☆ | One LLM call for variants + N × retrieval cost |
| Complexity | ★★★☆☆ | RRF is simple; variant quality depends on prompt engineering |

**When to skip**: unambiguous single-angle queries or latency-critical paths.

→ **Module 05: Multi-Query RAG** — instead of rephrasing, decompose the query into sub-questions.
