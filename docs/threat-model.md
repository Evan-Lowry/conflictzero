# ConflictZero threat model

## Security goal

ConflictZero helps a firm make a **verifiable exact-match conflict decision** while keeping the raw private registry in the firm's local environment. A public clearance receipt contains commitments, hashes, IDs, a registry version and a one-time check nonce; it does not contain client names, matters, raw registry entries or matching details.

## Trust boundaries

| Component | Trusted for | Not trusted for |
| --- | --- | --- |
| Firm browser/local client | retaining the raw registry, choosing a strong private salt, and supplying complete input | asserting that the registry is complete or correctly entered |
| Entity extraction/UI | converting text to explicit organization IDs | legal/entity-resolution judgment |
| Midnight circuit and verifier | validating the circuit's public statement and proof | discovering omitted clients or unlisted counterparties |
| Public ledger | recording a receipt and preventing a used nonce from being accepted again | confidentiality of anything explicitly placed on-chain |

## What the proof should establish

The final Compact circuit must bind a clearance to all of the following: firm ID, committed registry/version, engagement ID/hash and an unused `checkNonce`. It must verify no exact organization identifier in the engagement is a member of the committed private registry. The UI's `evaluateExactConflict` is a preview only; the contract proof is the authoritative verification.

## Threats and mitigations

- **Registry disclosure:** raw client data stays local; only salted domain-separated hashes and the commitment are submitted.
- **Size inference:** registries use a chosen fixed capacity and deterministic padding, so the leaf count does not disclose active client count within that capacity.
- **Tampered engagement:** the engagement canonical payload is hashed and bound to the public statement.
- **Stale registry:** callers must provide the expected registry version; proof-input preparation fails when it is stale.
- **Replay:** a unique nonce is included in the statement and must be marked consumed by the contract.
- **Cross-protocol reuse:** all hashes are domain-separated and length-prefixed.
- **Dictionary guessing:** registry salts must be cryptographically random, secret and per registry. Demo salts are deliberately unsafe and must never be used in production.

## Explicit limitations

This is **not** fuzzy entity resolution. It does not prove completeness, detect aliases, subsidiaries, parent companies, beneficial ownership, differently registered legal entities, or conflicts omitted from the input. Authoritative organization identifiers should be used where available; aliases/corporate families require a separately governed, private mapping and human compliance review. A no-conflict result means only “no match among the committed exact identifiers and supplied engagement identifiers.”

The current core package prepares deterministic inputs and receipts; it does not itself generate a zero-knowledge proof or enforce nonce consumption. Those duties belong to the Midnight Compact contract and its transaction integration.
