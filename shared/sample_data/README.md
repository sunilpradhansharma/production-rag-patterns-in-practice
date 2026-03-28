# Sample Data

All documents in this directory are **synthetic** — they simulate real fintech
document structures without containing any real personal, financial, or proprietary
data. They are designed to be realistic enough for meaningful RAG retrieval
demonstrations while being entirely safe to distribute.

---

## Documents

### `fintech_policy.txt`
**What it is:** Synthetic consumer lending policy for a fictional bank ("Meridian Bank").
**Structure:** 8 sections — purpose/scope, credit eligibility (FICO tiers, DTI),
product parameters (personal loan, auto, HELOC), underwriting workflow (AUS +
manual escalation), fair lending, exceptions/overrides, document retention, and
**default remediation** (DPD triggers, hardship programs, charge-off, post-charge-off
collections, credit bureau reporting).
**Why it's useful for RAG:** Dense cross-references between sections (e.g., Section
4 refers to Section 2 criteria). Tests whether chunking preserves policy context
and whether retrieval can answer questions that span multiple sections.
**Best for modules:** 01 (Naive), 02 (Advanced), 10 (Parent Document), 11 (Sentence
Window), 13 (Contextual RAG)

---

### `basel_iii_excerpt.txt`
**What it is:** Synthetic regulatory text modelled on Basel III capital adequacy
requirements.
**Structure:** 6 parts — minimum capital ratios (CET1/Tier 1/Total Capital),
countercyclical buffer, leverage ratio, liquidity standards (LCR and NSFR),
**risk-weighted asset calculations** (standardized approach risk weights by exposure
class, CCFs for off-balance sheet items, IRB overview), and G-SIB surcharges.
**Why it's useful for RAG:** Regulatory text combines precise numerical thresholds
(4.5% CET1, 75% retail risk weight) with defined terms that are referenced across
sections. Tests keyword-dense retrieval where exact numbers and regulatory citations
matter.
**Best for modules:** 03 (Hybrid), 06 (HyDE), 07 (Step-Back), 16 (Self-RAG),
17 (Corrective RAG)

---

### `isda_excerpt.txt`
**What it is:** Synthetic excerpt from an ISDA Master Agreement with Credit Support
Annex (CSA).
**Structure:** Sections covering the CSA (**margin call trigger conditions**,
**collateral posting requirements** including eligible collateral haircut table,
initial margin under SIMM, dispute resolution), general obligations, events of
default (failure to pay, breach, credit support default, misrepresentation,
cross-default), and early termination/close-out netting.
**Why it's useful for RAG:** Legal contracts have defined terms that resolve to
multi-paragraph definitions elsewhere in the document. Tests multi-hop retrieval
(e.g., "what triggers a margin call?" requires the CSA section plus the definition
of "Credit Support Amount"). The nested clause structure (5(a)(iii)(1)) also
stresses parent-document retrieval.
**Best for modules:** 10 (Parent Document), 12 (RAPTOR), 14 (Multi-Vector),
15 (Long Context), 23 (Multi-Hop RAG)

---

### `earnings_report.txt`
**What it is:** Synthetic Q3 2024 earnings release for a fictional diversified bank
holding company ("Pinnacle Financial Group").
**Structure:** Executive summary, segment performance table, three segment narratives
(Retail Banking, Commercial Banking, Investment Banking), consolidated financial
metrics table (15 KPIs with QoQ and YoY), and updated full-year 2024 guidance.
**Why it's useful for RAG:** Earnings reports mix structured data (markdown tables
of KPIs) with analytical narrative (MD&A sections). Tests retrieval over
heterogeneous content — a query like "what drove NIM compression?" requires
reading the narrative, while "what was diluted EPS?" is answerable from the table.
**Best for modules:** 04 (RAG Fusion), 05 (Multi-Query), 19 (Speculative),
20 (Adaptive), 22 (Agentic RAG)

---

## Loading documents in notebooks

Standard loading pattern for use in `demo.ipynb` Cell 2:

```python
import os

# Resolve path relative to this file's location — works regardless of where
# the notebook is launched from.
SAMPLE_DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),   # shared/sample_data/
    "..", "..",                                    # repo root
    "shared", "sample_data"
)

def load_document(filename: str) -> str:
    """Load a sample document by filename."""
    path = os.path.join(SAMPLE_DATA_DIR, filename)
    with open(path, encoding="utf-8") as f:
        return f.read()

policy_text = load_document("fintech_policy.txt")
print(f"Loaded {len(policy_text):,} characters")
```

For notebooks running from the repo root (the common case when launched with
`jupyter notebook` from the project directory):

```python
policy_text = open("shared/sample_data/fintech_policy.txt", encoding="utf-8").read()
```
