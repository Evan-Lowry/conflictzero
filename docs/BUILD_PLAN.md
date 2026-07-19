# ConflictZero Overnight Build Plan

## 1. Outcome

Ship a polished, testable Midnight DApp that lets a professional firm prove a proposed engagement was checked against a previously committed confidential client registry without publishing that registry.

The judge-visible claim is deliberately narrow:

> A successful clearance receipt proves that none of the engagement's confirmed, normalized organization identifiers matched any entry in the firm's committed fixed-size private registry at the referenced registry version.

ConflictZero does **not** claim that the registry is complete, that entity extraction is infallible, that corporate families are automatically resolved, or that a legal conflict does not exist under every jurisdiction's rules.

## 2. Non-negotiable demo

The final two-minute flow must show both outcomes:

1. A firm commits a private registry.
2. A non-conflicting engagement is checked locally.
3. A Midnight proof is generated and a public clearance receipt is recorded.
4. The receipt verifier shows the engagement hash, firm, registry version, timestamp/status, and verification state without showing client names.
5. A second engagement includes a secretly registered client.
6. The local check blocks proof submission and explains that private review is required without revealing the matching relationship publicly.
7. A tampered engagement or stale registry version cannot reuse the earlier clearance.

If infrastructure is unstable, the demo may use an explicitly labelled local adapter, but the repository must contain the real Compact contract, provider boundary, proof inputs, and reproducible verification path. We must never present simulated output as a live network transaction.

## 3. Product surfaces

### Public homepage

- One-sentence value proposition.
- Three-step privacy flow.
- Clear private/public data diagram.
- Launch-demo CTA.
- Midnight/hackathon attribution.

### Private firm workspace

- Firm onboarding and wallet/provider state.
- Confidential registry manager.
- Registry capacity, version, last commitment, and local-only labels.
- Seeded demo registry.
- Engagement intake with explicit entity confirmation.
- Proof generation progress and error handling.
- Local conflict-review state.

### Public verification

- Clearance receipt lookup.
- Firm identifier.
- Engagement fingerprint.
- Registry commitment/version.
- Proof/transaction status.
- Plain-language statement of exactly what was proven.

## 4. Public/private split

### Private local state

- Raw client and counterparty names.
- Canonical entity identifiers before hashing.
- Per-registry salt/domain material where required.
- Fixed-size padded registry witness.
- Engagement source document.
- Matching entry when a conflict is found.
- Optional AI/entity-extraction output before user confirmation.

### Public contract state

- Firm or wallet identifier.
- Registry commitment and monotonically increasing version.
- Successful engagement clearance hash.
- Registry version referenced by the clearance.
- Receipt identifier and final status.

### Never published

- Raw registry entries.
- Per-entry hashes that enable dictionary attacks.
- Failed conflict results.
- The matching private client.
- Uploaded engagement text.

## 5. Proof statement

The initial circuit should use bounded inputs so the constraint system stays understandable and testable.

- Registry capacity: 8 canonical entity identifiers.
- Engagement capacity: 4 confirmed entity identifiers.
- Empty slots: domain-separated padding values, not zero or duplicated real entries.
- Registry commitment: recomputed inside the proof from the private padded registry and bound to the public firm/version domain.
- Clearance assertion: every engagement identifier differs from every real registry identifier.
- Binding: proof is bound to network/application domain, firm, registry commitment, registry version, and engagement hash.
- Replay resistance: the clearance/receipt identifier is derived from the same binding and cannot be recorded twice.

The exact capacities may be reduced if compilation/proving performance requires it. A smaller honest working circuit is better than an ambitious simulated one.

## 6. Local deterministic engine

Required before optional AI:

1. Unicode and whitespace normalization.
2. Case normalization.
3. Conservative punctuation normalization.
4. Explicit handling of common legal suffixes.
5. User-confirmed aliases rather than unreviewed fuzzy matching.
6. Duplicate detection.
7. Domain-separated entity identifiers.
8. Fixed-size registry padding.
9. Registry commitment input preparation.
10. Engagement hashing and proof-input preparation.

Normalization must be deterministic and independently tested. The UI must show the canonical entities and require confirmation before proving.

## 7. Contract responsibilities

### Registry lifecycle

- Register firm/provider identity.
- Commit registry version 1.
- Update commitment while incrementing version.
- Reject version rollback or same-version replacement.

### Clearance lifecycle

- Accept proof/public inputs for a successful clearance.
- Verify binding to the current firm registry commitment/version.
- Record a single receipt per clearance identifier.
- Reject stale versions, mismatched engagement hashes, and replayed identifiers.

### Explicit non-responsibilities

- Storing raw names or documents.
- Resolving aliases or corporate families.
- Publishing failed checks.
- Rendering legal advice.

## 8. Provider architecture

The frontend consumes one interface with two implementations:

```ts
interface ConflictZeroProvider {
  registerOrUpdateRegistry(input: RegistryCommitmentInput): Promise<RegistryReceipt>;
  proveClearance(input: ClearanceProofInput): Promise<ClearanceProofResult>;
  getClearance(receiptId: string): Promise<PublicClearanceReceipt | null>;
}
```

### Midnight provider

- Wallet connection.
- Contract deploy/join configuration.
- Local proof-provider integration.
- Transaction submission.
- Indexer/ledger reads.

### Demonstration provider

- Deterministic and offline.
- Clearly labelled in the UI.
- Same domain objects and failure semantics.
- Used for frontend tests and as a resilience fallback, not represented as on-chain behavior.

## 9. Parallel workstreams

### Frontend agent

Owns the root React/Vite application and product UI. It must expose service hooks rather than hard-coding contract behavior.

### Privacy-core agent

Owns `packages/core/` and the threat model. It must deliver deterministic browser-compatible APIs and tests.

### Compact agent

Owns `contract/` and contract architecture. It must deliver the smallest honest circuit, current toolchain guidance, and exact blockers.

### Root integration

Owns product decisions, integration adapters, shared end-to-end tests, README/submission assets, final QA, and conflict resolution between workstreams.

## 10. Milestones and gates

### Gate A: architecture freeze

- Public/private split agreed.
- Proof statement written.
- Capacities fixed.
- No public record for failed conflicts.

### Gate B: deterministic vertical slice

- Seeded registry loads.
- Engagement entities normalize.
- Local match/no-match is correct.
- Homepage and core workflow render.

### Gate C: proof vertical slice

- Registry commitment is reproducible.
- Valid clearance passes.
- Hidden conflict fails.
- Tampered engagement fails.
- Stale version/replay fails.

### Gate D: integrated product

- UI uses the shared core package.
- Provider boundary supports real and demo modes.
- Receipt verifier explains the proof precisely.
- Errors are recoverable and understandable.

### Gate E: judge-ready

- Production build passes.
- Tests pass.
- Responsive and keyboard QA passes.
- Seeded demo completes without manual setup.
- README setup is reproducible.
- Two-minute video script fits the time limit.

## 11. Test matrix

### Normalization

- Case and whitespace variations match.
- Common legal suffix variations match only under documented rules.
- Distinct organizations do not collapse accidentally.
- Unicode input is deterministic.
- User-defined aliases are explicit and reviewable.

### Registry

- Duplicate entries rejected or deduplicated deterministically.
- Capacity limits enforced.
- Padding cannot equal a real entity identifier.
- Same registry/version produces the same commitment inputs.
- Modified registry changes the commitment.

### Clearance

- Clean engagement generates a receipt.
- One matching registry entry blocks locally/proof assertion fails.
- Multiple engagement entities are checked.
- Modified engagement invalidates proof binding.
- Old registry version cannot produce a current clearance.
- Receipt replay is rejected.
- One firm's proof cannot be reused for another firm.

### UI and resilience

- Empty/loading/error/success/blocked states.
- Wallet absent or disconnected.
- Proof server/indexer unavailable.
- User cancels before submission.
- Mobile and desktop layouts.
- Keyboard navigation and focus management.

## 12. Optional AI milestone

Only begin after Gate D.

- Run entity extraction locally where feasible.
- Treat extraction as suggestions, never proof truth.
- Require user confirmation of normalized entities.
- Do not send engagement text to a hosted model by default.
- Keep a deterministic manual-entry path available.

If local inference cannot be made reliable within the remaining time, omit it and target the overall prize with an honest deterministic product.

## 13. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Compact/toolchain incompatibility | Critical | Start with the smallest contract; pin versions; preserve a tested adapter and explicit demo mode |
| Proof generation too slow | High | Reduce registry/engagement capacities; use bounded comparisons |
| Hash/commitment mismatch across TS and Compact | Critical | Add cross-language golden vectors before UI integration |
| AI extraction misidentifies entities | High | User confirmation; deterministic manual fallback |
| Dictionary attacks on client-name hashes | High | Never publish per-entry hashes; commit the padded private registry as a whole with domain separation |
| Failed checks leak confidential relationships | High | Keep blocked results local; publish successful receipts only |
| UI overclaims legal certainty | High | Use `clearance check` and `private review required`; display exact proof scope |
| Network outage during judging | High | Preflight real flow, record transaction identifiers, retain clearly labelled deterministic demo adapter |
| Scope creep | High | Numeric dashboards, billing, roles, document storage, corporate trees, and fuzzy AI resolution are roadmap only |

## 14. Cut list

Do not build before the core proof works:

- Multi-tenant SaaS backend.
- Billing or subscriptions.
- Full document management.
- Corporate ownership graph resolution.
- Multi-jurisdiction legal rules.
- Email invitations.
- Role-based administration beyond the demo.
- Real customer data.
- Mobile application.
- Generic chatbot.

## 15. Submission package

- Public repository with clean history and license.
- Architecture and threat-model documentation.
- Exact public/private data table.
- Reproducible setup for frontend, core, contract, proof server, and wallet/provider.
- Test commands and known limitations.
- Seeded demo instructions.
- Deployed static frontend if authorized and infrastructure permits.
- Two-minute video beginning with the conflict problem and showing both success and tamper/conflict failure.
- Devpost copy focused on confidentiality, proof scope, business value, and honest limitations.

