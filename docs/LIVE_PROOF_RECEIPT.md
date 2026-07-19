# Live Midnight proof receipt

ConflictZero's Node harness completed a real contract deployment and `proveClear` zero-knowledge proof transaction against the official-compatible local Midnight devnet on 2026-07-19.

```json
{
  "network": "undeployed",
  "contractAddress": "b52bfb786b96c45ba10d40cb9a0e2d66107ca54126476977fa5e1a05ff325438",
  "deployTransactionId": "00bd40d484fdcea8feb5135ea91bbe13b5062e1999e9fe62e8daa06a2c0b1fc5db",
  "proveClearTransactionId": "00add73df5c6366134d3d352b6e1aa2b9f5fd9a797978d4c950ffc19db66625353",
  "proveClearBlockHeight": 230
}
```

This is a local-devnet receipt, not a Preview or mainnet claim. The local chain is intentionally ephemeral, but the run exercises the actual Midnight node, indexer, wallet SDK, proof server, compiled Compact contract, private-state provider, deployment transaction, and `proveClear` transaction. Reproduce it with `npm run midnight:up`, `npm run midnight:prove`, then `npm run midnight:down`.
