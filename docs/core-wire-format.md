# ConflictZero v1 core wire format

This document specifies the deterministic inputs shared by the TypeScript client and Compact implementation. The cross-language golden vector is [`packages/core/test-vectors/clearance-v1.json`](../packages/core/test-vectors/clearance-v1.json). Its salts are public test fixtures only.

## Text and identifiers

- All source strings are UTF-8 encoded.
- A display name is Unicode `NFKD` normalized; combining marks `U+0300–U+036F` are removed; it is lowercased; `&` becomes ` and `; all non-ASCII-alphanumeric runs become one space; leading/trailing whitespace is trimmed and internal whitespace collapses.
- Trailing legal suffix tokens are repeatedly removed when another token remains: `inc`, `incorporated`, `corp`, `corporation`, `co`, `company`, `ltd`, `limited`, `llc`, `llp`, `plc`, `lp`, `gmbh`, `sa`, `ag`, `bv`.
- The remaining tokens join with `-`. A name-derived identifier is `name:` plus that value. An authoritative ID is ASCII-lowercased and trimmed, prefixed `id:`.
- Identifier comparison is exact byte-for-byte after this construction. The protocol has no fuzzy matching, aliases or corporate-family logic.

## Hash primitive

Every digest is lower-case hexadecimal SHA-256 of UTF-8 bytes. For domain `D`, salt `S`, and payload `P`, the exact preimage string is:

```text
len(D) + ":" + D + len(S) + ":" + S + len(P) + ":" + P
```

Lengths are JavaScript string lengths (UTF-16 code units); all protocol-supplied domains, IDs and JSON keys in v1 are ASCII. Domains are literal strings:

- `conflictzero/v1/entity` (reserved; entity IDs are currently explicit strings)
- `conflictzero/v1/registry-leaf`
- `conflictzero/v1/registry-padding`
- `conflictzero/v1/registry-commitment`
- `conflictzero/v1/engagement`
- `conflictzero/v1/clearance-receipt`

## Registry commitment

1. Normalize each organization ID and reject duplicates.
2. Sort real IDs lexicographically by JavaScript string comparison.
3. Hash each real ID with `registry-leaf` and the registry salt, then lexicographically sort those hex hashes.
4. For slots `0..(maxEntries - entityCount - 1)`, hash the decimal slot with `registry-padding` and the same salt. Append padding hashes after real hashes; do not sort the combined list.
5. Create compact JSON, with keys in this exact order: `registryId`, `maxEntries`, `leaves`. The leaves are the array above, without whitespace.
6. Hash that JSON with `registry-commitment` and the registry salt. Version is `v1-` plus the first 16 hex characters of the commitment.

## Engagement and statement

Engagement organization IDs are normalized, deduplicated and lexically sorted. Its compact payload is exactly:

```json
{"engagementId":"<id>","organizationIds":["<sorted-id>"]}
```

Hash it with `engagement` and the engagement salt. To make the clearance public statement, serialize the following keys in this order with compact JSON: `firmId`, `registryId`, `registryVersion`, `registryCommitment`, `engagementId`, `engagementHash`, `checkNonce`. Hash it with `clearance-receipt` and the statement salt. The proof and contract must bind every one of these fields; the nonce must be consumed on-chain after a valid clearance to prevent replay.

`protocol` is included in the returned TypeScript object but intentionally excluded from the statement-hash serialization above, since versioning is already fixed by the hash domain.
