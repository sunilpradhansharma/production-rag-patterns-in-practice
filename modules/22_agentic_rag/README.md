# Module 22: Agentic RAG — Speaker Notes

## Timing

**10–12 minutes total** — live demo is essential; the tool trace is the key moment

| Segment | Time | Notes |
|---------|------|-------|
| Problem slide | 1.5 min | Read the failure table — name each limitation explicitly |
| Solution + architecture | 2 min | Walk the ReAct loop; say "retrieval is now a tool call" |
| Live demo | 5 min | Run ESG query; narrate each tool call as it fires |
| Tradeoffs | 1.5 min | Be direct about latency and cost — don't undersell the constraints |
| Transition | 1 min | Deliver transition line; open pattern selection discussion |

---

## Framing

> "We started with Naive RAG — retrieve once, generate once. Every pattern since added one more degree of freedom. Agentic RAG removes all the constraints: let the model plan, retrieve as many times as it needs, use any tool. This is where RAG is heading."

---

## Live Demo

Run `demo.ipynb` from Cell 4. Narrate each tool call:

1. **retrieve_client_profile** — "Decided it needs the client mandate before anything else."
2. **retrieve_portfolio_holdings** — "Retrieval order is conditioned on the risk profile."
3. **retrieve_esg_ratings** — "Three energy holdings — fetches ESG scores for each."
4. **calculate_exposure** — "Building toward the gap analysis — sector weight now."
5. **Final answer** — show the tool trace in Cell 5. "Every step logged. This is the audit trail."

Point to `max_steps`: "Without this, a runaway loop sends the bill."

---

## Anticipated Questions

**"How do you control cost?"**
Set `max_steps` (8–12 for complex queries). Log tool call counts — alert at 8+. Gate expensive queries with an Adaptive RAG classifier first. Streaming shows users progress rather than a silent wait.

**"What if the agent calls the wrong tool?"**
Errors compound — step 3 is conditioned on step 2's mistake. Write narrow, unambiguous tool descriptions. The tool trace makes misrouting visible; run it through your eval harness.

**"When is this overkill?"**
When the retrieval path is predictable. If every query follows the same 3-step sequence, hard-code it. The agent earns its cost only when the path is genuinely unknown in advance.

---

## Transition

> "You now have 22 patterns in your toolkit. The question is no longer what patterns exist — it's which one this query needs. Let's discuss selection."
