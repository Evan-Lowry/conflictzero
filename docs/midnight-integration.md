# ConflictZero Midnight integration

`packages/midnight-adapter` is the only app-layer boundary between the React UI and Compact. It has two provider implementations with identical domain input types:

- `DeterministicConflictZeroProvider` is an offline invariant model for UI development and tests. It is **not a proof system and never represents itself as an on-chain result**.
- `createMidnightNetworkProvider` accepts the configured live implementation. Wallet, node, indexer, and proof-server setup live behind that injected interface.

## Compiled and verified today

The generated binding at `contract/src/managed/conflict-zero/contract/index.d.ts` defines the exact Compact shapes. The adapter mirrors those shapes, including `Uint8Array` byte fields, `bigint` Uint32 versions, eight registry slots, and four engagement slots.

Before constructing a snapshot, the adapter:

1. encodes each normalized core identifier as UTF-8;
2. rejects NUL and strings exceeding 64 UTF-8 bytes;
3. right-pads it to `Bytes<64>`; and
4. calls the generated `pureCircuits.entityFingerprint` for every registry and engagement entity.

It also uses generated `pureCircuits.commitRegistry` and `pureCircuits.commitEngagement` for authoritative Compact commitments. Core SHA-256 values are converted from exact 64-character hex only and enter the snapshot solely as external audit bindings. They are never substituted for Compact commitments/fingerprints.

The test suite covers UTF-8 encoding, capacity, zero inactive slots, firm/deployment binding, conflict rejection, replay, and receipt creation only after success.

## Private-state and witness mapping

Keep `ConflictZeroPrivateState` in browser-local encrypted storage (or the selected Midnight private-state store), never an indexer or ordinary backend:

```ts
{
  adminSecret,       // Bytes<32>, admin-only
  registryOpening,   // current private registry snapshot + commitment randomness
  clearanceOpening,  // temporarily set for one proveClear transaction
}
```

Map it to generated witnesses as follows:

| Generated witness | Adapter state |
| --- | --- |
| `getAdminSecret` | `adminSecret` |
| `getRegistryOpening` | `registryOpening` |
| `getClearanceOpening` | `clearanceOpening` |

For deployment and update, compute the Compact registry commitment from the opening, publish it along with the external core registry digest, then retain the matching opening locally. For clearance, build an engagement snapshot bound to the current public state, compute `proposalCommitment`, assign it to `clearanceOpening`, and submit the five public `proveClear` arguments. `ProveClearInput` carries that same generated proposal commitment so the app cannot accidentally omit a public circuit argument.

## Required live wiring

The generated contract artifacts compile, but this repository intentionally does not bundle production network credentials or a wallet. To provide `MidnightNetworkBindings`, the app must configure:

1. `@midnight-ntwrk/compact-runtime` matching generated runtime `0.16.0`;
2. generated `Contract`, `pureCircuits`, proving keys and ZKIR artifacts from `contract/src/managed/conflict-zero`;
3. a browser wallet/signing and transaction submission client for the selected Midnight network;
4. a witness/private-state provider that returns the exact `Witnesses<PS>` values above;
5. a local proof provider that runs `updateRegistry` and `proveClear`; and
6. an indexer/ledger reader for `registryVersion`, commitments, and `clearanceReceipts`.

The live binding must return a real transaction id from `deploy`, `updateRegistry`, and `proveClear`, and `getReceipt` must read the receipt map from the network/indexer. Do not fall back silently: choose deterministic mode explicitly in the UI and label it as offline.

## Live provider transaction sequence

```text
deploy:  build registry opening -> pure commitRegistry -> constructor witnesses -> submit
join:    fetch ledger -> verify local opening's firm/nonce/version/digest bindings
update:  next opening (version + 1) -> pure commitRegistry -> updateRegistry witnesses -> submit
clear:   snapshot -> pure entity fingerprints -> pure commitEngagement -> proveClear witnesses -> submit -> indexer receipt
```

`firmId`, `instanceNonce`, check nonce, engagement identifier/hash, both registry commitments, and registry version are all copied into the private snapshot and checked by Compact. This is what makes a proof non-portable across firms, deployments, registry rotations, or check attempts.
