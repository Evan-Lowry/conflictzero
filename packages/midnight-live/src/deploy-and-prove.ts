import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { resolveNetwork } from './network.js';
import { loadInput } from './input.js';
import { makeWitnesses } from './witnesses.js';
import { createWallet, ensureDust, walletProvider } from './wallet.js';
import { Contract as ConflictZeroContract } from '../../../contract/src/managed/conflict-zero/contract/index.js';

// The indexer client requires a WebSocket implementation in Node.
// @ts-expect-error Node does not declare the browser WebSocket global.
globalThis.WebSocket = WebSocket;

const here = path.dirname(fileURLToPath(import.meta.url));
const managed = path.resolve(here, '../../../contract/src/managed/conflict-zero');
const generated = path.join(managed, 'contract/index.js');
const PRIVATE_STATE_ID = 'conflictzero-live-private-state';

async function main() {
  if (!fs.existsSync(generated)) throw new Error('Generated contract is missing. Run `npm --prefix contract run compact` first.');
  const network = resolveNetwork();
  const input = await loadInput(network.id === 'undeployed');
  const compiled = CompiledContract.make('conflict-zero', ConflictZeroContract).pipe(
    CompiledContract.withWitnesses(makeWitnesses()),
    CompiledContract.withCompiledFileAssets(managed),
  );
  const wallet = await createWallet(input.walletSeed, network);
  try {
    console.error('[midnight-live] syncing wallet');
    await wallet.wallet.waitForSyncedState();
    console.error('[midnight-live] preparing DUST');
    await ensureDust(wallet);
    console.error('[midnight-live] DUST ready');
    const provider = walletProvider(wallet);
    const providers = {
      privateStateProvider: levelPrivateStateProvider({ privateStateStoreName: 'conflictzero-live', accountId: wallet.unshieldedKeystore.getBech32Address().toString(), privateStoragePasswordProvider: () => process.env.PRIVATE_STATE_PASSWORD || 'Local-Only-ConflictZero-Password-1' }),
      publicDataProvider: indexerPublicDataProvider(network.indexer, network.indexerWS),
      zkConfigProvider: new NodeZkConfigProvider(managed),
      proofProvider: httpClientProofProvider(network.proofServer, new NodeZkConfigProvider(managed)),
      walletProvider: provider, midnightProvider: provider,
    };
    // deployContract retains the private witness state locally; the chain sees only constructor arguments.
    console.error('[midnight-live] deploying ConflictZero contract');
    const deployed: any = await deployContract(providers, { compiledContract: compiled as any, args: [input.publicState.firmId, input.publicState.instanceNonce, input.publicState.registryCommitment, input.publicState.externalRegistryCommitment], privateStateId: PRIVATE_STATE_ID, initialPrivateState: input.privateState });
    console.error('[midnight-live] generating and submitting proveClear proof');
    const tx = await deployed.callTx.proveClear(input.engagementId, input.engagementHash, input.proposalCommitment, input.checkNonce, input.publicState.registryVersion);
    const address = deployed.deployTxData.public.contractAddress;
    console.log(JSON.stringify({ network: network.id, contractAddress: address, deployTransactionId: deployed.deployTxData.public.txId ?? null, proveClearTransactionId: tx.public.txId, proveClearBlockHeight: tx.public.blockHeight ?? null }, null, 2));
  } finally { await wallet.wallet.stop(); }
}

main().catch((error) => { console.error(error instanceof Error ? error.stack ?? error.message : error); process.exitCode = 1; });
