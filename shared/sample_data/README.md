# Sample Data

All documents in this directory are **synthetic** — they simulate real fintech document structures without containing any real personal, financial, or proprietary data. They are designed to be realistic enough for meaningful RAG retrieval demonstrations.

---

## Documents

### `fintech_policy.txt`
**What it is:** Synthetic consumer lending policy document for a fictional bank ("Meridian Bank").
**Why it exists:** Represents the most common enterprise RAG use case — internal policy Q&A. Contains numbered sections, nested subsections, tables of eligibility criteria, and cross-references between sections. Tests chunking strategies that need to preserve section context.
**Good for modules:** 01 (Naive), 02 (Advanced), 10 (Parent Document), 11 (Sentence Window), 13 (Contextual)

---

### `basel_iii_excerpt.txt`
**What it is:** Synthetic regulatory text modelled on Basel III capital adequacy requirements.
**Why it exists:** Regulatory text has a highly formal, citation-heavy structure with precise numerical thresholds. It tests retrieval over dense, technical language where exact numbers and definitions matter. Common in compliance Q&A use cases.
**Good for modules:** 03 (Hybrid), 06 (HyDE), 07 (Step-Back), 16 (Self-RAG), 17 (Corrective)

---

### `isda_excerpt.txt`
**What it is:** Synthetic excerpt from an ISDA Master Agreement (derivatives contract).
**Why it exists:** Legal contracts have highly nested clause structures, extensive defined terms, and cross-references by section number. Tests retrieval over long-form legal text where context window and parent-child relationships matter.
**Good for modules:** 10 (Parent Document), 12 (RAPTOR), 14 (Multi-Vector), 15 (Long Context), 23 (Multi-Hop)

---

### `earnings_report.txt`
**What it is:** Synthetic quarterly earnings report for a fictional fintech company ("Apex Payments Inc.").
**Why it exists:** Earnings reports mix structured data (tables of financials) with narrative prose (MD&A section). Tests retrieval over heterogeneous content including numbers, percentages, and forward-looking statements.
**Good for modules:** 04 (RAG Fusion), 05 (Multi-Query), 19 (Speculative), 20 (Adaptive), 22 (Agentic)

---

## Usage in notebooks

```python
import os

SAMPLE_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "shared", "sample_data")

def load_document(filename: str) -> str:
    path = os.path.join(SAMPLE_DATA_DIR, filename)
    with open(path) as f:
        return f.read()

policy_text = load_document("fintech_policy.txt")
```

Or using the helper in `shared/utils.py`:

```python
from shared.utils import load_sample_document
policy_text = load_sample_document("fintech_policy.txt")
```
