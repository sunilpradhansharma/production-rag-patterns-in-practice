# Attendee Setup Guide

> Complete this before the workshop. Setup takes approximately 20 minutes.
> If you encounter issues, contact the instructor at least 24 hours before the session.

---

## What You Need

- A laptop with Python 3.11 or later
- ~500 MB of free disk space (for dependencies)
- Internet access during the workshop (for API calls)
- Two API keys (see Section 3)

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/sunilpradhansharma/production-rag-patterns-in-practice.git
cd production-rag-patterns-in-practice
```

Verify the clone succeeded:

```bash
ls modules/
# Should show 26 directories: 01_naive_rag through 26_temporal_rag
```

---

## Step 2 — Python Environment

### Option A: venv (recommended)

```bash
python3 -m venv .venv
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows

pip install --upgrade pip
pip install -r requirements.txt
```

### Option B: conda

```bash
conda create -n rag-workshop python=3.11 -y
conda activate rag-workshop
pip install -r requirements.txt
```

### Verify the install

```bash
python -c "import anthropic, langchain, chromadb, networkx; print('All dependencies OK')"
```

Expected output: `All dependencies OK`

If you see an import error, run:
```bash
pip install -r requirements.txt --force-reinstall
```

---

## Step 3 — API Keys

The workshop requires two API keys. A third is optional.

### Required: Anthropic API Key

Used for: LLM generation (all modules), vision descriptions (Module 25)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. Add $5–10 in credits to your account (the full workshop costs ~$1–2)

### Required: OpenAI API Key

Used for: text embeddings (`text-embedding-3-small`) in all modules

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-...`)
5. Add $5 in credits to your account (the full workshop costs < $0.50 in embeddings)

### Optional: Tavily API Key

Used for: web search fallback in Corrective RAG (Module 17) and Agentic RAG (Module 22)

Without this key, Modules 17 and 22 fall back to corpus-only retrieval. The demos still run; the web search branch is skipped.

1. Go to [tavily.com](https://tavily.com)
2. Sign up for the free tier
3. Copy your API key from the dashboard

---

## Step 4 — Environment File

Create a `.env` file in the repository root:

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in your keys:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
TAVILY_API_KEY=tvly-your-key-here    # optional
```

**Security note**: The `.gitignore` already excludes `.env`. Never commit your API keys to git.

Verify the keys are loaded:

```bash
python -c "
from dotenv import load_dotenv
import os
load_dotenv()
assert os.environ.get('ANTHROPIC_API_KEY'), 'ANTHROPIC_API_KEY missing'
assert os.environ.get('OPENAI_API_KEY'), 'OPENAI_API_KEY missing'
print('API keys loaded OK')
"
```

---

## Step 5 — Jupyter

Start Jupyter:

```bash
jupyter notebook
# or
jupyter lab
```

Open `modules/01_naive_rag/demo.ipynb`. Run Cell 1. You should see:

```
Naive RAG — Module 01
  Model      : claude-haiku-4-5-20251001
  Embeddings : text-embedding-3-small
  Vector store: chromadb (in-memory)
  Chunk size  : 400 tokens
  Chunk overlap: 80 tokens
```

If Cell 1 runs without errors, your environment is ready.

---

## Step 6 — Pre-Flight Test

Run the pre-flight check to verify API connectivity:

```bash
python -c "
from dotenv import load_dotenv
load_dotenv()

# Test Anthropic
from anthropic import Anthropic
client = Anthropic()
r = client.messages.create(
    model='claude-haiku-4-5-20251001',
    max_tokens=10,
    messages=[{'role': 'user', 'content': 'Say OK'}]
)
print(f'Anthropic: {r.content[0].text.strip()}')

# Test OpenAI embeddings
from langchain_openai import OpenAIEmbeddings
emb = OpenAIEmbeddings(model='text-embedding-3-small')
v = emb.embed_query('test')
print(f'OpenAI embeddings: {len(v)}-dim vector OK')

print('Pre-flight complete. You are ready for the workshop.')
"
```

Expected output:
```
Anthropic: OK
OpenAI embeddings: 1536-dim vector OK
Pre-flight complete. You are ready for the workshop.
```

---

## Estimated API Costs

The workshop demos (Tier 1 modules, live demos only) cost approximately:

| Demo module | Estimated cost |
|-------------|---------------|
| 01 Naive RAG | $0.02 |
| 03 Hybrid RAG | $0.03 |
| 13 Contextual RAG | $0.15 (index-time context generation) |
| 17 Corrective RAG | $0.05 |
| 22 Agentic RAG | $0.10 |
| **Total (workshop demos)** | **~$0.35** |

Running all 26 notebooks end-to-end costs approximately **$2–5** total.

---

## Troubleshooting

### `ModuleNotFoundError: No module named 'anthropic'`
Your virtual environment is not activated. Run `source .venv/bin/activate` (macOS/Linux) or `.venv\Scripts\activate` (Windows) and retry.

### `AuthenticationError: invalid x-api-key`
Your `.env` file has the wrong key, or `load_dotenv()` is not finding the file. Verify the `.env` file is in the repository root (same directory as `CLAUDE.md`), not in a subdirectory.

### `chromadb.errors.InvalidCollectionException`
A previous run left a stale ChromaDB collection on disk. Delete the `chroma_*` directory in the module folder:
```bash
find modules/ -name "chroma_*" -type d -exec rm -rf {} + 2>/dev/null
```

### Jupyter kernel crashes on Cell 1
Usually caused by a missing dependency. Re-run `pip install -r requirements.txt`. If the issue persists, check that your Python version is 3.11+: `python --version`.

### API calls time out
The workshop venue may have restrictive firewall rules. Verify you can reach `api.anthropic.com` and `api.openai.com` from the venue network before the session starts.

---

## What to Bring

- Your laptop with the setup above completed and verified
- Headphones (optional — some exercises run audio notifications)
- The pre-flight check output screenshot (if you want to show the instructor you're set up)

---

## Repository Structure (Quick Reference)

```
production-rag-patterns-in-practice/
├── modules/
│   ├── 01_naive_rag/         ← Start here
│   │   ├── SKILL.md          ← Pattern reference
│   │   ├── demo.ipynb        ← Runnable notebook
│   │   ├── slides.md         ← Workshop slides
│   │   └── README.md         ← Speaker notes + Q&A
│   └── ... (26 modules total)
├── shared/
│   └── sample_data/          ← Synthetic fintech documents
├── docs/
│   ├── architecture/         ← Design guides
│   └── workshop/             ← This guide + cheatsheet
├── .env.example              ← Copy to .env, add your keys
└── requirements.txt          ← pip install -r requirements.txt
```
