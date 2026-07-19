# Submission copy

## One-line pitch

ConflictZero lets professional firms prove a conflict check passed without revealing the confidential client relationships behind it.

## Short description

Conflict checks create a paradox: firms need auditable evidence that the control happened, but ordinary evidence can disclose sensitive clients, counterparties, and matters. ConflictZero uses a Midnight Compact contract to prove that the privately committed parties for a new engagement are disjoint from a firm's current privately committed relationship registry. Only successful checks produce a public, replay-protected receipt. Potential conflicts stay local and reveal neither the matching relationship nor even a public failure record.

## What we built

- A polished private firm workspace and independent receipt verifier
- A deterministic browser privacy core with fixed-capacity inputs and golden vectors
- A Compact contract for private eight-by-four set disjointness
- Typed commitments, monotonic registry rotation, and replay protection
- A deterministic demo provider that executes the contract-generated Compact fingerprints and commitments, plus an explicit live-network boundary
- A threat model that states exactly what is and is not proven

## Midnight use

ConflictZero's Compact contract privately opens the current registry and engagement snapshots, verifies their typed commitments, compares every active fingerprint pair, and records a public receipt only after a clean result. The receipt is bound to the firm, deployment, registry version, engagement digest, proposal commitment, and unique nonce. Private organization fingerprints and failed checks never enter public state.

## Innovation

Most conflict-checking tools optimize internal search. ConflictZero addresses a different problem: selective proof to an auditor, partner, insurer, regulator, or counterparty without handing them the underlying confidential registry. The key product choice is that failure is private by default; only a successful clearance becomes portable evidence.

## Honest limitations

The proof establishes exact-identifier set disjointness for the supplied, committed inputs. It does not prove registry completeness, resolve aliases or corporate families, inspect beneficial ownership, or replace jurisdiction-specific legal review. The current browser flow uses a clearly labelled deterministic provider for judge reliability; live wallet/node submission is the remaining integration boundary, while the Compact contract itself compiles and its protocol invariants are tested.
