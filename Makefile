.PHONY: install install-dev test eval lint format typecheck clean help

# ── Default ───────────────────────────────────────────────────────────────────
help:
	@echo "RAG Patterns in Practice — build targets"
	@echo ""
	@echo "  make install      Install production dependencies"
	@echo "  make install-dev  Install all dependencies (prod + dev)"
	@echo "  make test         Run unit tests (no API keys required)"
	@echo "  make test-all     Run all tests including integration tests"
	@echo "  make eval         Run RAGAS evaluation pipeline"
	@echo "  make lint         Run ruff linter"
	@echo "  make format       Auto-fix formatting with ruff"
	@echo "  make typecheck    Run mypy type checker"
	@echo "  make notebooks    Execute all Tier 1 notebooks (requires API keys)"
	@echo "  make clean        Remove caches and build artifacts"

# ── Installation ──────────────────────────────────────────────────────────────
install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements.txt -r requirements-dev.txt

# ── Testing ───────────────────────────────────────────────────────────────────
test:
	pytest -m "not integration" -v --tb=short

test-all:
	pytest -v --tb=short

# Run tests for a single module: make test-module MODULE=01_naive_rag
test-module:
	pytest modules/$(MODULE)/tests/ -v --tb=short

# ── Evaluation ────────────────────────────────────────────────────────────────
eval:
	@echo "Running RAGAS evaluation pipeline..."
	python -m shared.eval_runner

# ── Code quality ──────────────────────────────────────────────────────────────
lint:
	ruff check shared/ modules/

format:
	ruff check --fix shared/ modules/
	ruff format shared/ modules/

typecheck:
	mypy shared/

# ── Notebooks ─────────────────────────────────────────────────────────────────
# Execute all Tier 1 notebooks in order (requires ANTHROPIC_API_KEY + OPENAI_API_KEY)
notebooks:
	@echo "Executing Tier 1 notebooks..."
	jupyter nbconvert --to notebook --execute modules/01_naive_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/02_advanced_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/03_hybrid_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/06_hyde/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/10_parent_document/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/13_contextual_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/16_self_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/17_corrective_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/20_adaptive_rag/demo.ipynb --output demo_executed.ipynb
	jupyter nbconvert --to notebook --execute modules/22_agentic_rag/demo.ipynb --output demo_executed.ipynb
	@echo "All Tier 1 notebooks executed."

# Run a single notebook: make notebook MODULE=01_naive_rag
notebook:
	jupyter nbconvert --to notebook --execute modules/$(MODULE)/demo.ipynb --output demo_executed.ipynb

# ── Cleanup ───────────────────────────────────────────────────────────────────
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ipynb_checkpoints" -exec rm -rf {} + 2>/dev/null || true
	find . -name "demo_executed.ipynb" -delete 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	@echo "Clean complete."
