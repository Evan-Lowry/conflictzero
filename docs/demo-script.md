# ConflictZero judge demo

Target: 3:30–4:30, leaving time for questions.

## 0:00 — The problem

“Professional firms need to prove they ran conflict controls, but conventional audit evidence can expose the confidential clients and relationships the control is meant to protect.”

On the homepage, point to the three stages: private registry, zero-knowledge check, public receipt.

“ConflictZero proves the exact private sets were disjoint at a specific registry version. It does not claim to replace legal judgment or prove that a firm's registry is complete.”

## 0:35 — Show the private state

Launch the workspace and open the relationship registry.

“These entities stay in the firm's local workspace. The ledger receives a commitment, never these names or per-entry hashes.”

Point out **Northstar Group**, then return to the workspace.

## 1:05 — Prove the happy path

Start a new check. Keep the seeded values:

- Prospective client: `Orchid Capital`
- Matter: `Commercial advisory`
- Involved organization: `Apex Materials`

Generate clearance evidence.

“The deterministic core canonicalizes the confirmed organizations and prepares fixed-capacity inputs. The Compact circuit opens the current private registry and engagement commitments, checks all active pairs for equality, and binds the result to this firm, deployment, registry version, engagement, and one-time nonce.”

When the receipt appears, copy or remember its ID and open the verifier.

## 2:00 — Verify without disclosure

Verify the generated receipt.

“A third party can verify the successful clearance and referenced registry version without learning the client list, the engagement parties, or the witness fingerprints.”

Point to the engagement fingerprint, registry version, and receipt status.

## 2:35 — Show the privacy-defining failure path

Run another check and use the shortcut **Northstar Group**.

“This exact identifier is privately registered. The check stops locally. ConflictZero creates no public receipt and publishes no failure record, because even the fact of a match can be sensitive.”

Show the private-review screen.

## 3:15 — Technical credibility

Open the architecture or repository briefly.

“The repository contains a Compact 0.23 contract compiled with compiler 0.31. It uses generated Compact fingerprints and typed commitments, fixed eight-by-four witness capacities, monotonic registry versions, and independent replay guards for proposal commitments, engagement IDs, and nonces. The browser demo provider is labelled honestly; it shares the same success/failure semantics so judging does not depend on network stability.”

## 4:00 — Close

“ConflictZero turns ‘trust us, we checked’ into selective, privacy-preserving evidence: prove the control worked without exposing the relationships behind it.”

## Fast answers

**Is this legal advice?** No. The exact claim is private set disjointness for user-confirmed identifiers at one registry version.

**What about aliases and subsidiaries?** They require authoritative IDs or a firm-governed private mapping. We deliberately do not hide fuzzy matching behind a cryptographic proof.

**Can someone dictionary-attack public hashes?** Individual fingerprints are private witness data. Only typed commitments and external aggregate digests are public; production randomness must be secret and independent.

**What happens on a conflict?** Proof construction fails or is blocked locally, and no public receipt is created.

**What is real versus simulated?** The Compact contract compiles and the deterministic core/tests are real. The browser's offline provider is visibly labelled; live wallet/node submission is an adapter boundary.
