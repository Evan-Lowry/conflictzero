# ConflictZero live Midnight harness

This optional Node-only package deploys the generated `ConflictZero` Compact contract and immediately sends its real `proveClear` transaction using Midnight.js 4.1.1. It does not alter the browser demo, write a seed, or write private witness state into this repository.

The harness was verified end-to-end against the included local devnet; the latest public transaction receipt is recorded in `../../docs/LIVE_PROOF_RECEIPT.md`.

Prerequisites: Node 22+, a running local Midnight devnet (node, indexer, and proof server) or a local proof server plus a funded Preview wallet. The proof server is deliberately local: it receives witness material to generate a ZK proof and should not be hosted as a public service.

Install this package separately, then run it with an **untracked, absolute-path** JSON input file:

```sh
npm --prefix packages/midnight-live install
MIDNIGHT_LIVE_INPUT=/absolute/path/conflictzero-live-input.json \
PRIVATE_STATE_PASSWORD='a private password of 16+ characters' \
npm --prefix packages/midnight-live run deploy-and-prove
```

For local development, start the official compatible node/indexer/proof-server set with `npm --prefix packages/midnight-live run devnet:up`. Stop it with `npm --prefix packages/midnight-live run devnet:down`; this does **not** delete volumes or wallet state.

Set `MIDNIGHT_LIVE_NETWORK=preview` for Preview. The local defaults are the official `create-mn-app` endpoints. `MIDNIGHT_*_URL` environment overrides are supported for indexer, indexer WebSocket, node, and proof server.

For the local devnet only, omitting `MIDNIGHT_LIVE_INPUT` generates a fresh, non-conflicting demo registry and engagement in memory and uses the official local genesis seed. It writes neither the generated witnesses nor the seed to disk. Preview always requires an explicit input file and wallet seed.

The JSON must contain the exact hex-encoded public values and adapter-shaped openings below. It is secret material—keep it outside the repository, do not screen-share it, and delete it when finished.

```ts
{
  walletSeed: "<64 hex>", adminSecret: "<64 hex>",
  publicState: { firmId: "<64 hex>", instanceNonce: "<64 hex>", registryCommitment: "<64 hex>", externalRegistryCommitment: "<64 hex>", registryVersion: "1" },
  registryOpening: { snapshot: { externalRegistryCommitment: "<64 hex>", firmId: "<64 hex>", instanceNonce: "<64 hex>", version: "1", slots: [{ active: true, fingerprint: "<64 hex>" } /* exactly 8 */] }, randomness: "<64 hex>" },
  clearanceOpening: { registry: { /* registry snapshot, exactly 8 slots */ }, registryRandomness: "<64 hex>", engagement: { engagementId: "<64 hex>", externalEngagementHash: "<64 hex>", firmId: "<64 hex>", instanceNonce: "<64 hex>", registryVersion: "1", registryCommitment: "<64 hex>", externalRegistryCommitment: "<64 hex>", checkNonce: "<64 hex>", parties: [{ active: true, fingerprint: "<64 hex>" } /* exactly 4 */] }, engagementRandomness: "<64 hex>" },
  engagementId: "<64 hex>", engagementHash: "<64 hex>", proposalCommitment: "<64 hex>", checkNonce: "<64 hex>"
}
```

`registryOpening`/`clearanceOpening` use the same types and fixed capacities as `@conflictzero/midnight-adapter`. Values must be computed with the generated contract's `pureCircuits`; do not substitute SHA-256 or browser-only hashes. The harness intentionally prints only public receipt identifiers.

Known operational blockers: Preview funding requires a faucet grant; DUST must accrue after registering NIGHT UTXOs; a freshly registered wallet may need a short delay and a retry before a proof can be balanced. This package has no transaction retry loop so each actual submission is explicit.
