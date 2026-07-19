# ConflictZero

**Prove a conflict check passed without exposing the relationships behind it.**

ConflictZero is a Midnight hackathon prototype for law firms, accounting firms, banks, and other professional-services teams. A firm privately commits a fixed-size registry of organization identifiers, checks a proposed engagement against it, and publishes a clearance receipt only when the two private sets are disjoint.

> Judge-safe claim: Midnight verifies that the parties privately committed for an engagement are disjoint from the exact entity fingerprints in the firm's current privately committed registry, then publishes a replay-protected receipt without publishing those fingerprints.

This is intentionally narrower than “there is no legal conflict.” ConflictZero does not prove registry completeness, legal entity resolution, corporate-family relationships, or the correctness of an uploaded document.

## Why it matters

A firm may need to demonstrate that a conflict-control process occurred, but the evidence itself can disclose confidential clients and relationships. ConflictZero separates the decision from the disclosure:

| Stays private | Becomes public after clearance |
| --- | --- |
| Client and counterparty names | Firm/deployment identifier |
| Exact entity fingerprints | Registry commitment and version |
| Matching relationship | Engagement digest |
| Uploaded matter text | One-time nonce and proposal commitment |
| Failed checks | Successful clearance receipt |

A conflict is a local stop condition. It creates no public receipt and does not reveal which private relationship matched.

## The demo

1. Launch the Hartwell & Vale workspace.
2. Inspect the private relationship registry, seeded with **Northstar Group**.
3. Run the default **Orchid Capital / Apex Materials** engagement.
4. Observe a clearance receipt and verify it without seeing any client names.
5. Run a second check using **Northstar Group**.
6. Observe a private-review result: no public receipt is created.

The browser experience is explicitly labelled as a deterministic demo provider. The repository also includes the compiled Compact contract and the adapter boundary needed for a real Midnight provider; simulated results are never presented as live network transactions.

## Architecture

```text
React workspace
    |
    +-- deterministic local core
    |     normalize -> fixed capacity -> exact-match preview -> external digests
    |
    +-- provider boundary
          |
          +-- deterministic demo adapter
          |
          +-- Midnight adapter
                generated pureCircuits -> private witnesses -> Compact contract

Compact contract
    private: 8 registry slots + 4 engagement slots + opening randomness
    public:  current commitment/version + successful receipts + replay guards
```

The proof uses Compact's typed `persistentCommit` and generated `pureCircuits.entityFingerprint`. Browser SHA-256 values are retained only as explicitly labelled external audit digests; they are not substituted for the Compact commitment.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

### Verify the repository

```bash
npm run build
npm test
```

The 20 tests cover normalization, fixed-size padding, exact-ID conflicts, freshness, tamper binding, replay domains, a committed golden vector, contract protocol invariants, exact Compact encoding, cross-deployment rejection, and receipt-only-on-success behavior.

### Compile the Compact contract

The contract was compiled with Compact compiler `0.31.0`, language `0.23.0`, and runtime `0.16.0`.

```bash
compact update 0.31.0
cd contract
compact compile src/conflict-zero.compact src/managed/conflict-zero
```

Generated proving keys are intentionally ignored because they add tens of megabytes; regenerate them from the pinned source.

## Repository map

- `src/` — responsive React demo and service boundary
- `packages/core/` — browser-compatible deterministic privacy core and golden vector
- `packages/midnight-adapter/` — generated-binding bridge and deterministic provider double
- `contract/` — Compact source, generated compiler bindings, and protocol model tests
- `docs/BUILD_PLAN.md` — implementation plan and release gates
- `docs/threat-model.md` — trust boundaries, mitigations, and explicit non-claims
- `docs/contract-architecture.md` — exact proof statement and contract state transitions
- `docs/core-wire-format.md` — deterministic external digest format
- `docs/demo-script.md` — five-minute judge walkthrough

## Current status

- Polished desktop and mobile experience
- Deterministic private registry and engagement engine
- Compiled two-circuit Compact contract (`updateRegistry`, `proveClear`)
- Browser execution of the generated Compact fingerprints and typed commitments through the official runtime
- Replay-, version-, deployment-, and engagement-bound receipt design
- Deterministic provider fallback for reliable judging
- Runtime Midnight wallet/node submission remains an integration boundary and is not misrepresented as complete

## Security notes

Demo salts are fixed and unsafe by design. A production client must generate independent cryptographically random salts, admin secrets, nonces, and commitment randomness; keep all private witness material out of analytics and logs; use authoritative organization identifiers; and require human review for aliases, subsidiaries, beneficial ownership, and jurisdiction-specific conflict rules.

Built for the Midnight Hackathon.
