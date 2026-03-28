/**
 * Architecture diagrams for all 26 RAG patterns.
 * Source: modules/{nn}_{name}/SKILL.md  (## Architecture section)
 * Keyed by numeric pattern id (1–26) matching PATTERNS in patterns.js.
 */

export const DIAGRAMS = {
  1: `flowchart LR
    D[Documents] -->|chunk + embed| VDB[(Vector DB)]
    Q[User query] -->|embed| QV[Query vector]
    QV -->|similarity search top-k| VDB
    VDB -->|retrieved chunks| P[Prompt assembly]
    Q --> P
    P -->|context + question| LLM[LLM]
    LLM --> A[Answer]

    style D fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style VDB fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  2: `flowchart LR
    Q[User query] --> RW[Query rewriter\\nLLM generates N variants]
    RW --> RET[Retrieve\\ntop-K candidates per variant]
    D[(Vector DB)] --> RET
    RET --> RR[Reranker\\nCross-encoder scores all candidates]
    RR --> CC[Context compressor\\nExtract query-relevant sentences]
    CC --> P[Prompt assembly]
    Q --> P
    P --> LLM[LLM]
    LLM --> A[Answer]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style D fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style RW fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style RR fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CC fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  3: `flowchart TD
    Q[User query] --> S1[Sparse BM25]
    Q --> S2[Dense vector]
    S1 -->|ranked list 1| F[RRF Fusion\\nk=60]
    S2 -->|ranked list 2| F
    F -->|unified top-k| P[Prompt]
    P --> LLM[LLM]
    LLM --> A[Answer]
    D1[(BM25 index)] --> S1
    D2[(Vector DB)] --> S2

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style S1 fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style S2 fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style F fill:#FAEEDA,stroke:#854F0B,color:#633806
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  4: `flowchart TD
    Q[User query] --> VG[Generate\\nN variants]
    VG --> R1[Retrieve\\nfor variant 1]
    VG --> R2[Retrieve\\nfor variant 2]
    VG --> RN[Retrieve\\nfor variant N]
    R1 --> RRF[RRF fusion\\nmerge ranked lists]
    R2 --> RRF
    RN --> RRF
    RRF --> DD[Deduplicate]
    DD --> GEN[Generate\\nfinal answer]
    GEN --> A[Answer]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style VG fill:#FAEEDA,stroke:#854F0B,color:#633806
    style R1 fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style R2 fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style RN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style RRF fill:#FAEEDA,stroke:#854F0B,color:#633806
    style DD fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  5: `flowchart TD
    Q[Complex query] --> QG[Generate\\n3-5 perspectives]
    QG --> R1[Retrieve\\nperspective 1]
    QG --> R2[Retrieve\\nperspective 2]
    QG --> RN[Retrieve\\nperspective N]
    R1 --> U[Union +\\ndeduplicate]
    R2 --> U
    RN --> U
    U --> GEN[Generate\\nfinal answer]
    GEN --> A[Answer]

    style Q   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style QG  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style R1  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style R2  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style RN  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style U   fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A   fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  6: `flowchart TD
    Q[User query] --> LLM1[LLM generates\\nhypothetical answer]
    LLM1 --> HE[Embed hypothetical\\n→ answer space]
    HE -->|hypothetical vector| VDB[(Vector DB)]
    VDB -->|real docs matched| P[Prompt]
    Q --> P
    P --> LLM2[LLM] --> A[Grounded answer]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style LLM1 fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style HE fill:#FAEEDA,stroke:#854F0B,color:#633806
    style VDB fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  7: `flowchart TD
    Q[Specific query] --> AG[Generate\\nstep-back query]
    Q --> R2[Retrieve on\\noriginal query]
    AG --> R1[Retrieve on\\nabstract query]
    R1 --> C[Combine contexts\\nprinciple + specific]
    R2 --> C
    C --> GEN[Generate\\nfinal answer]
    GEN --> A[Answer]

    style Q   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style AG  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style R1  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style R2  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style C   fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A   fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  8: `flowchart TD
    Q[Query + initial context] --> GEN1[Generate sentence\\nusing current context]
    GEN1 --> UD{Uncertain\\nspans detected?}
    UD -- No --> ACC[Accept sentence\\nappend to output]
    ACC --> DONE{Generation\\ncomplete?}
    DONE -- No --> GEN1
    DONE -- Yes --> OUT[Final output\\nfully grounded]
    UD -- Yes --> RET[Retrieve on\\nuncertain span]
    RET --> INJ[Inject retrieved docs\\ninto context]
    INJ --> REGEN[Regenerate sentence\\nwith retrieved context]
    REGEN --> ACC

    style Q    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style GEN1 fill:#FAEEDA,stroke:#854F0B,color:#633806
    style UD   fill:#FEF3CD,stroke:#856404,color:#5C4400
    style RET  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style INJ  fill:#F3EEF9,stroke:#6B3FA0,color:#4A1F80
    style REGEN fill:#FAEEDA,stroke:#854F0B,color:#633806
    style ACC  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style DONE fill:#FEF3CD,stroke:#856404,color:#5C4400
    style OUT  fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  9: `flowchart TD
    Q[User query]
    Q --> R1[BM25 Retriever]
    Q --> R2[Dense Vector\\nRetriever]
    Q --> R3[Keyword\\nRetriever]
    R1 -->|ranked chunks| C[Ensemble Combiner\\nRRF + weights]
    R2 -->|ranked chunks| C
    R3 -->|ranked chunks| C
    C -->|top-k merged chunks| LLM[LLM]
    LLM -->|grounded answer| A[Answer]

    style Q fill:#E6F1FB,stroke:#185FA5
    style R1 fill:#EEEDFE,stroke:#534AB7
    style R2 fill:#EEEDFE,stroke:#534AB7
    style R3 fill:#EEEDFE,stroke:#534AB7
    style C fill:#FAEEDA,stroke:#854F0B
    style LLM fill:#E1F5EE,stroke:#0F6E56
    style A fill:#EAF3DE,stroke:#3B6D11`,

  10: `flowchart TD
    D[Document] -->|split| PAR[Parent chunks 512t\\nstored in DocStore]
    PAR -->|split further| CHILD[Child chunks 128t\\nembedded in VectorDB]
    Q[Query] --> E[Embed] -->|search| VDB[(Vector DB)]
    VDB -->|child match| LOOKUP[Look up parent ID]
    LOOKUP -->|full parent| CTX[Rich context 512t]
    CTX --> G[Generate] --> A[Answer]

    style D fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CHILD fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style PAR fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  11: `flowchart TD
    D[Document] --> SP[Sentence parser\\nSentenceWindowNodeParser]
    SP --> S1[Sentence node 1\\n+ window metadata]
    SP --> S2[Sentence node 2\\n+ window metadata]
    SP --> SN[Sentence node N\\n+ window metadata]
    S1 --> IDX[Sentence-level\\nvector index]
    S2 --> IDX
    SN --> IDX
    Q[Query] --> IDX
    IDX --> MS[Matched sentence\\n+/- k window in metadata]
    MS --> WE[Window expansion\\nMetadataReplacementPostProcessor]
    WE --> GEN[Generate\\nfinal answer]
    GEN --> A[Answer]

    style D   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style SP  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style S1  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style S2  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style SN  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style IDX fill:#FAEEDA,stroke:#854F0B,color:#633806
    style Q   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style MS  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style WE  fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A   fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  12: `flowchart TD
    D[Documents] --> LC[Leaf chunking\\n400-char chunks]
    LC --> E[Embed chunks]
    E --> UM[UMAP dimensionality\\nreduction]
    UM --> CL[GMM clustering\\noptimal K]
    CL --> S1[Summarize each\\ncluster Level 1]
    S1 --> CL2[Re-cluster\\nLevel 1 summaries]
    CL2 --> S2[Summarize clusters\\nLevel 2]
    S2 --> ROOT[Root summary\\nentire corpus]
    ROOT --> IDX[Unified index\\nleaf + all summary nodes]
    Q[Query] --> IDX
    IDX --> R[Retrieve from\\nany tree level]
    R --> GEN[Generate answer]
    GEN --> A[Answer]

    style D    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style LC   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style E    fill:#FAEEDA,stroke:#854F0B,color:#633806
    style UM   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style CL   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style S1   fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style CL2  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style S2   fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style ROOT fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style IDX  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style Q    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style R    fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style GEN  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A    fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  13: `flowchart TD
    D[Document] -->|split| CHUNKS[Raw chunks]
    CHUNKS --> CTX_GEN[Claude generates context\\nper chunk]
    CTX_GEN --> ENRICH[Prepend context to chunk]
    ENRICH -->|embed enriched| VDB[(Vector DB)]
    Q[Query] -->|embed| VDB
    VDB --> G[Generate] --> A[Answer with\\ndocument awareness]

    style D fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CTX_GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style ENRICH fill:#FAEEDA,stroke:#854F0B,color:#633806
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  14: `flowchart TD
    D[Document] --> C[Chunk\\n400-char splits]
    C --> SG[Generate summary\\nper chunk]
    C --> QG[Generate questions\\nper chunk]
    C --> RT[Raw text\\nchunk itself]
    SG --> ES[Embed summary]
    QG --> EQ[Embed questions]
    RT --> ER[Embed raw text]
    ES --> VS[Vector store\\nall reps tagged with doc_id]
    EQ --> VS
    ER --> VS
    C --> DS[Document store\\ndoc_id → original chunk]
    Q[Query] --> EQR[Embed query]
    EQR --> VS
    VS --> |top-k doc_ids| DS
    DS --> |original chunks| GEN[Generate answer]
    GEN --> A[Answer]

    style D    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style C    fill:#FAEEDA,stroke:#854F0B,color:#633806
    style SG   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style QG   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style RT   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style VS   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style DS   fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style Q    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style GEN  fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A    fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  15: `flowchart TD
    Q[User query]
    D[Full document\\nor document set]
    Q --> CTX[Context assembler\\nquery + full text]
    D --> CTX
    CTX -->|full context| LLM[Long-context LLM\\nClaude 200K]
    LLM -->|grounded answer| A[Answer]

    style Q   fill:#E6F1FB,stroke:#185FA5
    style D   fill:#E6F1FB,stroke:#185FA5
    style CTX fill:#EEEDFE,stroke:#534AB7
    style LLM fill:#E1F5EE,stroke:#0F6E56
    style A   fill:#EAF3DE,stroke:#3B6D11`,

  16: `flowchart TD
    Q[User query] --> R{Retrieve?}
    R -->|No| GD[Generate directly]
    R -->|Yes| VDB[(Vector DB)]
    VDB -->|candidates| REL{ISREL\\nper document}
    REL -->|Not relevant| DISC[Discard]
    REL -->|Relevant| GEN[Generate\\nwith context]
    GEN --> SUP{ISSUP\\nper claim}
    SUP -->|Not supported| DEC{Decide}
    SUP -->|Supported| USE{ISUSE\\noverall utility}
    DEC -->|Retry| VDB
    DEC -->|Abstain| FLAG[Abstain with\\nexplanation]
    USE -->|Not useful| FLAG
    USE -->|Useful| A[Grounded answer\\nwith citations]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style R fill:#FAEEDA,stroke:#854F0B,color:#633806
    style REL fill:#FAEEDA,stroke:#854F0B,color:#633806
    style SUP fill:#FAEEDA,stroke:#854F0B,color:#633806
    style USE fill:#FAEEDA,stroke:#854F0B,color:#633806
    style DEC fill:#FAEEDA,stroke:#854F0B,color:#633806
    style VDB fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style FLAG fill:#FAECE7,stroke:#993C1D,color:#7A2E14
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  17: `flowchart TD
    Q[User query] --> RET[(Vector DB\\nretrieve top-k)]
    RET -->|retrieved docs| GRD{Grade\\nrelevance}
    GRD -->|Correct — high score| REF1[Strip irrelevant\\npassages]
    GRD -->|Incorrect — low score| WEB[Web search\\nTavily]
    GRD -->|Ambiguous — mixed| REF2[Use relevant\\n+ web search]
    WEB --> KR[Knowledge\\nrefinement]
    REF2 --> KR
    REF1 --> GEN[Generate]
    KR --> GEN
    GEN --> A[Grounded answer]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style RET fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style GRD fill:#FAEEDA,stroke:#854F0B,color:#633806
    style WEB fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style KR fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  18: `flowchart TD
    Q[User query]
    Q --> R1[Reason: step 1\\nwrite first CoT sentence]
    R1 -->|needs more info?| D1{Retrieve?}
    D1 -- yes --> RET1[Retrieve\\nrelevant docs]
    D1 -- no  --> R2
    RET1 --> R2[Reason: step 2\\nnext CoT sentence\\nwith retrieved context]
    R2 -->|needs more info?| D2{Retrieve?}
    D2 -- yes --> RET2[Retrieve\\nnew query]
    D2 -- no  --> R3
    RET2 --> R3[Reason: step N\\n...]
    R3 -->|done?| D3{Complete?}
    D3 -- no  --> D2
    D3 -- yes --> A[Final answer\\n+ reasoning trace]

    style Q    fill:#E6F1FB,stroke:#185FA5
    style R1   fill:#EEEDFE,stroke:#534AB7
    style R2   fill:#EEEDFE,stroke:#534AB7
    style R3   fill:#EEEDFE,stroke:#534AB7
    style D1   fill:#FAEEDA,stroke:#854F0B
    style D2   fill:#FAEEDA,stroke:#854F0B
    style D3   fill:#FAEEDA,stroke:#854F0B
    style RET1 fill:#E1F5EE,stroke:#0F6E56
    style RET2 fill:#E1F5EE,stroke:#0F6E56
    style A    fill:#EAF3DE,stroke:#3B6D11`,

  19: `flowchart TD
    Q[Query] --> SD[Speculative draft\\nHaiku — fast, parametric]
    Q --> RET[Retrieve top-k docs]
    SD --> VER[Verify + refine\\nSonnet — draft + docs]
    RET --> VER
    VER --> FA[Final answer\\ngrounded + corrected]

    style Q   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style SD  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style RET fill:#FAEEDA,stroke:#854F0B,color:#633806
    style VER fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style FA  fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  20: `flowchart TD
    Q[User query] --> CLS[Complexity\\nclassifier]
    CLS -->|Tier 0 — simple| D[Direct LLM\\nno retrieval]
    CLS -->|Tier 1 — medium| R1[Single-step RAG\\nretrieve + generate]
    CLS -->|Tier 2 — complex| R2[Multi-step RAG\\niterative retrieval]
    D  --> A[Answer]
    R1 --> A
    R2 --> A

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style CLS fill:#FAEEDA,stroke:#854F0B,color:#633806
    style D fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style R1 fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style R2 fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  21: `flowchart TD
    Q[Query] --> P[RAGPipeline\\nassemble from modules]
    P --> R[RetrieverModule\\nprotocol interface]
    R --> RR[RerankerModule\\nprotocol interface]
    RR --> G[GeneratorModule\\nprotocol interface]
    G --> A[Answer]
    R1[BM25Retriever] -.->|implements| R
    R2[ChromaRetriever] -.->|implements| R
    RR1[CohereReranker] -.->|implements| RR
    RR2[CrossEncoderReranker] -.->|implements| RR
    G1[HaikuGenerator] -.->|implements| G
    G2[SonnetGenerator] -.->|implements| G

    style Q   fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style P   fill:#F3EEF9,stroke:#6B3FA0,color:#4A1F80
    style R   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style RR  fill:#FAEEDA,stroke:#854F0B,color:#633806
    style G   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style A   fill:#EAF3DE,stroke:#3B6D11,color:#27500A
    style R1  fill:#F9F9F9,stroke:#AAAAAA,color:#444444
    style R2  fill:#F9F9F9,stroke:#AAAAAA,color:#444444
    style RR1 fill:#F9F9F9,stroke:#AAAAAA,color:#444444
    style RR2 fill:#F9F9F9,stroke:#AAAAAA,color:#444444
    style G1  fill:#F9F9F9,stroke:#AAAAAA,color:#444444
    style G2  fill:#F9F9F9,stroke:#AAAAAA,color:#444444`,

  22: `flowchart TD
    Q[User query] --> AG[Agent\\nreasoning step]
    AG -->|needs retrieval| TR[Retrieve tool\\nvector store]
    AG -->|needs web data| WS[Web search\\ntool]
    AG -->|needs calculation| CL[Calculator\\ntool]
    TR --> OB[Observe result]
    WS --> OB
    CL --> OB
    OB -->|more steps needed| AG
    OB -->|evidence complete| GEN[Generate\\nfinal answer]
    GEN --> A[Grounded answer\\n+ tool trace]

    style Q fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style AG fill:#FAEEDA,stroke:#854F0B,color:#633806
    style TR fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style WS fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style CL fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    style OB fill:#FAEEDA,stroke:#854F0B,color:#633806
    style GEN fill:#E1F5EE,stroke:#0F6E56,color:#085041
    style A fill:#EAF3DE,stroke:#3B6D11,color:#27500A`,

  23: `flowchart TD
    Q[Initial query] --> H1[Hop 1\\nretrieve top-k docs]
    H1 --> E1[Extract bridge entity\\nfrom hop 1 docs]
    E1 --> TC1{Terminal?\\nor hop limit?}
    TC1 -- No --> H2[Hop 2\\nretrieve on bridge entity]
    H2 --> E2[Extract bridge entity\\nfrom hop 2 docs]
    E2 --> TC2{Terminal?\\nor hop limit?}
    TC2 -- No --> H3[Hop 3\\nretrieve on bridge entity]
    H3 --> TC2b{Hop limit\\nreached}
    TC1 -- Yes --> SYN[Synthesize answer\\nfrom full chain context]
    TC2 -- Yes --> SYN
    TC2b --> SYN

    style Q    fill:#E6F1FB,stroke:#185FA5,color:#0C447C
    style H1   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style H2   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style H3   fill:#FAEEDA,stroke:#854F0B,color:#633806
    style E1   fill:#F3EEF9,stroke:#6B3FA0,color:#4A1F80
    style E2   fill:#F3EEF9,stroke:#6B3FA0,color:#4A1F80
    style TC1  fill:#FEF3CD,stroke:#856404,color:#5C4400
    style TC2  fill:#FEF3CD,stroke:#856404,color:#5C4400
    style TC2b fill:#FEF3CD,stroke:#856404,color:#5C4400
    style SYN  fill:#E1F5EE,stroke:#0F6E56,color:#085041`,

  24: `flowchart TD
    D[Documents]
    D --> EE[Entity extractor\\nNER + relation extraction]
    EE --> GB[Graph builder\\nnodes=entities edges=relations]
    GB --> KG[(Knowledge graph)]
    Q[User query]
    Q --> QE[Query entity\\nextraction]
    QE --> GT[Graph traversal\\nneighbors + paths]
    Q  --> VS[Vector search\\nsemantic]
    GT --> CM[Context merger\\ndeduplicate + rank]
    VS --> CM
    KG --> GT
    CM --> LLM[LLM synthesis]
    LLM --> A[Answer\\n+ entity provenance]

    style D   fill:#E6F1FB,stroke:#185FA5
    style Q   fill:#E6F1FB,stroke:#185FA5
    style EE  fill:#EEEDFE,stroke:#534AB7
    style GB  fill:#EEEDFE,stroke:#534AB7
    style KG  fill:#FDF3E3,stroke:#B05A00
    style QE  fill:#EEEDFE,stroke:#534AB7
    style GT  fill:#E1F5EE,stroke:#0F6E56
    style VS  fill:#E1F5EE,stroke:#0F6E56
    style CM  fill:#FAEEDA,stroke:#854F0B
    style LLM fill:#EEEDFE,stroke:#534AB7
    style A   fill:#EAF3DE,stroke:#3B6D11`,

  25: `flowchart TD
    PDF[PDF / document]
    PDF --> EX[Multimodal extractor\\ntext + images + tables]
    EX --> TX[Text chunks]
    EX --> IM[Images / charts]
    EX --> TB[Tables]
    TX --> TE[Text embeddings]
    IM --> VD[Vision descriptions\\nClaude vision]
    VD --> IE[Image embeddings]
    TB --> TE2[Table embeddings]
    TE  --> IDX[(Unified index\\nChromaDB)]
    IE  --> IDX
    TE2 --> IDX
    Q[User query]
    Q --> QE[Query embedding]
    QE --> RET[Cross-modal retrieval]
    IDX --> RET
    RET --> CTX[Context builder\\ntext + image refs + tables]
    IM --> CTX
    CTX --> VLM[Vision LLM\\nClaude Sonnet vision]
    VLM --> A[Answer\\n+ modality citations]

    style PDF  fill:#E6F1FB,stroke:#185FA5
    style Q    fill:#E6F1FB,stroke:#185FA5
    style EX   fill:#EEEDFE,stroke:#534AB7
    style VD   fill:#EEEDFE,stroke:#534AB7
    style TE   fill:#E1F5EE,stroke:#0F6E56
    style IE   fill:#E1F5EE,stroke:#0F6E56
    style TE2  fill:#E1F5EE,stroke:#0F6E56
    style IDX  fill:#FDF3E3,stroke:#B05A00
    style RET  fill:#E1F5EE,stroke:#0F6E56
    style CTX  fill:#FAEEDA,stroke:#854F0B
    style VLM  fill:#EEEDFE,stroke:#534AB7
    style A    fill:#EAF3DE,stroke:#3B6D11`,

  26: `flowchart TD
    D[Documents\\nwith timestamps]
    D --> TS[Timestamp extractor\\nparse date metadata]
    TS --> IDX[(Vector index\\nChromaDB + timestamp metadata)]
    Q[User query\\n+ optional time scope]
    Q --> QP[Query parser\\nextract time intent]
    QP --> M1{Mode?}
    M1 -- hard filter  --> HF[Date range filter]
    M1 -- recency decay --> RD[Retrieve + re-score\\nwith decay function]
    M1 -- version-aware --> VA[Retrieve active versions\\nsuppress superseded]
    HF --> CM[Context merger\\n+ temporal provenance]
    RD --> CM
    VA --> CM
    IDX --> HF
    IDX --> RD
    IDX --> VA
    CM --> LLM[LLM synthesis]
    LLM --> A[Answer\\n+ effective date citation]

    style D   fill:#E6F1FB,stroke:#185FA5
    style Q   fill:#E6F1FB,stroke:#185FA5
    style TS  fill:#EEEDFE,stroke:#534AB7
    style IDX fill:#FDF3E3,stroke:#B05A00
    style QP  fill:#EEEDFE,stroke:#534AB7
    style M1  fill:#FAEEDA,stroke:#854F0B
    style HF  fill:#E1F5EE,stroke:#0F6E56
    style RD  fill:#E1F5EE,stroke:#0F6E56
    style VA  fill:#E1F5EE,stroke:#0F6E56
    style CM  fill:#FAEEDA,stroke:#854F0B
    style LLM fill:#EEEDFE,stroke:#534AB7
    style A   fill:#EAF3DE,stroke:#3B6D11`,
}
