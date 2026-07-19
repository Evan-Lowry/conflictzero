# ConflictZero contract architecture

Status: implemented and compiled with Compact compiler **0.31.0**, language **0.23.0**, runtime **0.16.0** on 2026-07-18.

The authoritative source is [`contract/src/conflict-zero.compact`](../contract/src/conflict-zero.compact). This document is intentionally strict about the privacy claim: the contract proves disjointness of two committed fixed-size fingerprint sets. It does **not** prove that a law firm's registry is complete, that entity normalization is legally correct, or that an uploaded document contains the parties claimed by the client.

## Proof statement

For one deployed firm contract, `proveClear` proves knowledge of:

1. a private eight-slot registry snapshot and 32-byte commitment randomness that open the contract's current `registryCommitment`;
2. a private four-slot engagement snapshot and independent 32-byte randomness that open the public `proposalCommitment`; and
3. private fingerprints in both snapshots such that no active engagement fingerprint equals an active registry fingerprint.

The engagement commitment also binds the proof to the firm, deployment nonce, registry version, both registry commitment forms, engagement ID/hash, and check nonce. A successful transition writes one public receipt and consumes both the proposal commitment and check nonce.

In compact notation, the proven relation is:

```text
R = PCommit("conflictzero:registry:v1", registrySnapshot, registryRand)
P = PCommit("conflictzero:engagement:v1", engagementSnapshot, engagementRand)

R == ledger.registryCommitment
P == public.proposalCommitment
registrySnapshot.{firmId, instanceNonce, version, externalRegistryCommitment}
  == ledger.{firmId, instanceNonce, registryVersion, externalRegistryCommitment}
engagementSnapshot.{firmId, instanceNonce, registryVersion,
                    registryCommitment, externalRegistryCommitment,
                    engagementId, externalEngagementHash, checkNonce}
  == the corresponding ledger/public values

for every active registry slot r and active engagement slot e:
  r.fingerprint != e.fingerprint
```

`PCommit` is Compact's typed `persistentCommit`, not an ad-hoc JavaScript SHA-256 construction.

## Public and private data

| Value | Location | Notes |
|---|---|---|
| Firm ID digest | sealed public ledger | 32 bytes; contract-level namespace |
| Deployment nonce | sealed public ledger | Fresh 32 random bytes; prevents cross-deployment commitment replay |
| Admin public key | sealed public ledger | Domain-separated hash of a private admin secret |
| Registry version | public ledger | Starts at 1; increases exactly once per valid rotation |
| Compact registry commitment | public ledger | Authoritative commitment opened inside the proof |
| Browser/core registry digest | public ledger | Opaque compatibility/audit metadata; Compact does not validate its JSON preimage |
| Engagement ID digest | public circuit input and receipt map key | Must be a 32-byte digest, not a raw variable-length ID |
| Browser/core engagement hash | public circuit input and receipt | Opaque audit metadata, bound inside the private engagement commitment |
| Proposal commitment | public circuit input and receipt | Compact commitment to the complete private engagement snapshot |
| Check nonce | public circuit input, receipt, consumed set | Fresh 32-byte value; one-time use |
| Expected registry version | public circuit input and receipt | Must equal the current ledger version |
| Registry fingerprints/active bits | private witness | Eight slots, inactive slots canonically zero |
| Engagement fingerprints/active bits | private witness | Four slots, inactive slots canonically zero |
| Commitment randomness | private witness | Independent 32 random bytes for each commitment; never reuse |
| Admin secret | private witness | Never stored or returned |

The receipt's map key plus value structurally binds all public proof data. `firmId`, `instanceNonce`, and the external registry digest are contract ledger fields; `engagementId` is the map key; the value stores version, both relevant commitments/hashes, and nonce.

## State transitions

### Deployment

The constructor:

1. seals `firmId`, `instanceNonce`, and the derived admin public key;
2. obtains the private initial registry opening from `getRegistryOpening`;
3. enforces canonical slots and version `1`;
4. verifies firm/deployment/external-digest binding and the Compact commitment opening; and
5. publishes version 1 and both registry commitments.

Deployment fails if the initial private opening does not match. This avoids creating a contract that can never issue a clearance.

### Registry rotation

`updateRegistry(newRegistryCommitment, newExternalRegistryCommitment)`:

1. proves knowledge of the admin secret preimage;
2. rejects `Uint<32>` version exhaustion;
3. obtains and validates the new private registry opening;
4. requires its version to be exactly `current + 1` and its firm/deployment to match; and
5. replaces both commitments and advances the version atomically.

An old opening can no longer satisfy `proveClear`, providing stale-version rejection.

### Clearance

`proveClear(engagementId, engagementHash, proposalCommitment, checkNonce, expectedRegistryVersion)`:

1. rejects a stale version, an existing receipt for the engagement ID, a consumed proposal, or a consumed nonce;
2. verifies canonical private slot encodings;
3. opens the current registry and the exact public proposal commitment;
4. checks every one of the 32 possible active slot pairs for inequality; and
5. writes the receipt, then consumes the proposal commitment and nonce in the same transition.

If any active fingerprint matches, proof construction/circuit execution fails with `private conflict detected`; no receipt is written.

## Fingerprints and fixed-width encoding

The canonical proof fingerprint is generated by the compiled pure circuit:

```compact
entityFingerprint(entityId: Bytes<64>)
  = persistentHash(["conflictzero:entity:v1", entityId])
```

The integration layer must:

1. normalize an entity into the core identifier form (`id:...` or `name:...`);
2. reject identifiers longer than 64 UTF-8 bytes and identifiers containing NUL;
3. right-pad the UTF-8 bytes with zeroes to exactly 64 bytes; and
4. call generated `pureCircuits.entityFingerprint`.

It must use that same function for registry and engagement parties. Doing a browser-native SHA-256 in one path and a Compact hash in the other destroys equality semantics.

The current circuit capacity is eight registry entries and four engagement parties. Capacity changes require changing vector lengths in Compact, recompiling proving/verifying keys, and updating the witness provider. Inactive slots are `{ active: false, fingerprint: 0x00…00 }`; active slots must be non-zero. The first slot must be active, so empty registries and empty engagements are rejected. Active counts and fingerprints remain witness values and are not written to the ledger.

## Browser/core wire format boundary

[`docs/core-wire-format.md`](core-wire-format.md) and [`packages/core/test-vectors/clearance-v1.json`](../packages/core/test-vectors/clearance-v1.json) define deterministic browser SHA-256/JSON values. The current golden vector includes:

```text
external registry digest: 5424c3ea3852a57f01127fa9492206a37d73eefff80212e3e6f7a1b8654a68c9
external clean engagement: 55280f134eb7b083abc21e6a13b45e5259f4f3c771d5ed55a634219395d51caf
external statement hash:   1d91b7eae6f5f24c79e0a4f7c84ebb09c5b2bf1789ffc346de8b2503bf44de31
```

These values **must not be substituted for** Compact `registryCommitment`, `proposalCommitment`, or entity fingerprints. Compact `persistentHash`/`persistentCommit` use Compact's canonical typed serialization, while the core vector hashes length-prefixed strings and ordered JSON. They are intentionally different primitives and cannot be expected to byte-match.

The safe bridge is dual binding:

- store the core registry digest in `externalRegistryCommitment` and include it inside the Compact registry and proposal commitments;
- store the core engagement hash in the proposal snapshot and public receipt;
- generate the authoritative private commitments and entity fingerprints only through the compiled `pureCircuits`; and
- treat the core `publicStatementHash` as a UI/export checksum over the receipt fields, not as the on-chain proof or a substitute for reading the receipt.

The Compact contract treats external digests as opaque. It binds them against later tampering, but does not prove that the browser serialized or hashed their claimed preimages correctly. A future protocol can remove this trust boundary by defining one shared circuit-friendly encoding and generating every digest through compiled pure circuits.

## Replay and domain separation

- `consumedProposalCommitments` prevents a successful private proposal opening from authorizing a second clearance.
- `consumedCheckNonces` prevents nonce reuse even with a different proposal.
- `clearanceReceipts.member(engagementId)` prevents replacing or duplicating an engagement receipt.
- `instanceNonce` is included in both private snapshots, preventing replay into a second deployment even if a firm ID is reused.
- purpose-specific domains separate admin keys, entity fingerprints, registry commitments, and engagement commitments.
- registry and proposal commitments require independent, cryptographically random 32-byte randomness. Reuse is forbidden.

No user-supplied `ownPublicKey()` is used for authorization. Current official Midnight security guidance describes it as a witness result that is not a safe caller-authentication mechanism. Admin access instead proves knowledge of the preimage of the sealed `adminPublicKey`.

## Threat assumptions and non-claims

The protocol assumes:

- the admin's 32-byte secret and all commitment randomness remain secret;
- randomness is generated with a cryptographically secure RNG and never reused;
- the integration layer uses generated pure circuits and exact 64-byte entity encoding;
- the firm honestly includes all relevant clients and matters in its registry;
- engagement parties supplied to the witness are the parties the firm intends to check; and
- the proving system, compiler/runtime version pair, node, and verifier are sound.

The proof does **not** establish:

- completeness or truth of the private registry;
- that a normalized ID corresponds to a real legal entity;
- aliases, subsidiaries, beneficial ownership, fuzzy matches, or corporate-family conflicts;
- that an engagement letter actually contains the private party set;
- correctness of AI/entity extraction or the browser's external SHA-256/JSON digest;
- absence of conflicts under legal rules beyond exact fingerprint equality; or
- privacy against endpoint compromise, screenshots, browser extensions, logs, analytics, or a malicious witness provider.

A judge-safe claim is: **“Midnight verifies that the parties privately committed for this engagement are disjoint from the exact entity fingerprints in the firm's current privately committed registry, and publishes a replay-protected receipt without publishing those fingerprints.”**

## Build and verification

Install the official devtools, pin the toolchain, and compile:

```bash
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source "$HOME/.local/bin/env"
compact update 0.31.0
cd contract
compact compile src/conflict-zero.compact src/managed/conflict-zero
node --test test/protocol-model.test.mjs
```

The locally generated `contract/src/managed/conflict-zero/compiler/contract-info.json` records compiler 0.31.0, language 0.23.0, and runtime 0.16.0. Generated artifacts are git-ignored because the proving keys add roughly 19 MB; CI and developers rebuild them from the pinned source. The compiler generates proof artifacts for two impure circuits: `updateRegistry` and `proveClear`. The Node tests are a fast invariant model, not ZK proofs; contract simulator/integration tests should instantiate the generated `Contract` once the app package supplies `@midnight-ntwrk/compact-runtime` and witness storage.

Official references used for this design:

- [Compact language](https://docs.midnight.network/compact)
- [Writing a contract](https://docs.midnight.network/compact/reference/writing)
- [Standard library hashing and commitments](https://docs.midnight.network/compact/standard-library/exports)
- [Smart contract security](https://docs.midnight.network/compact/smart-contract-security)
- [Test and debug](https://docs.midnight.network/compact/test-and-debug)
