import { Buffer } from 'node:buffer';
import * as ledger from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletFacade, DustWallet, HDWallet, Roles, ShieldedWallet, createKeystore, NoOpTransactionHistoryStorage, PublicKey, UnshieldedWallet } from '@midnight-ntwrk/wallet-sdk';
import { filter, firstValueFrom, throttleTime } from 'rxjs';
import type { NetworkConfig } from './network.js';

export async function createWallet(seed: string, config: NetworkConfig) {
  setNetworkId(config.id);
  const hd = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
  if (hd.type !== 'seedOk') throw new Error('Invalid wallet seed');
  const derived = hd.hdWallet.selectAccount(0).selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust]).deriveKeysAt(0);
  hd.hdWallet.clear();
  if (derived.type !== 'keysDerived') throw new Error('Could not derive wallet keys');
  const keys = derived.keys;
  const networkId = getNetworkId();
  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
  const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
  const unshieldedKeystore = createKeystore(keys[Roles.NightExternal], networkId);
  const wallet = await WalletFacade.init({
    configuration: { networkId, indexerClientConnection: { indexerHttpUrl: config.indexer, indexerWsUrl: config.indexerWS }, provingServerUrl: new URL(config.proofServer), relayURL: new URL(config.node.replace(/^http/, 'ws')), txHistoryStorage: new NoOpTransactionHistoryStorage(), costParameters: { additionalFeeOverhead: 300_000_000_000_000n, feeBlocksMargin: 5 } },
    shielded: async (c: any) => ShieldedWallet(c).startWithSecretKeys(shieldedSecretKeys),
    unshielded: async (c: any) => UnshieldedWallet(c).startWithPublicKey(PublicKey.fromKeyStore(unshieldedKeystore)),
    dust: async (c: any) => DustWallet(c).startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust),
  });
  await wallet.start(shieldedSecretKeys, dustSecretKey);
  return { wallet, shieldedSecretKeys, dustSecretKey, unshieldedKeystore };
}

export function walletProvider(ctx: Awaited<ReturnType<typeof createWallet>>) {
  return {
    getCoinPublicKey: () => ctx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => ctx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await ctx.wallet.balanceUnboundTransaction(tx, { shieldedSecretKeys: ctx.shieldedSecretKeys, dustSecretKey: ctx.dustSecretKey }, { ttl: ttl ?? new Date(Date.now() + 30 * 60_000) });
      return ctx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => ctx.wallet.submitTransaction(tx) as any,
  };
}

/** The SDK will otherwise produce an opaque insufficient-DUST failure. */
export async function ensureDust(ctx: Awaited<ReturnType<typeof createWallet>>) {
  const state = await ctx.wallet.waitForSyncedState();
  const unregistered = state.unshielded.availableCoins.filter((coin: any) => !coin.meta?.registeredForDustGeneration);
  if (unregistered.length) {
    const recipe = await ctx.wallet.registerNightUtxosForDustGeneration(unregistered, ctx.unshieldedKeystore.getPublicKey(), (payload: Uint8Array) => ctx.unshieldedKeystore.signData(payload));
    await ctx.wallet.submitTransaction(await ctx.wallet.finalizeRecipe(recipe));
  }
  if (state.dust.balance(new Date()) === 0n) {
    await firstValueFrom(
      ctx.wallet.state().pipe(
        throttleTime(5_000),
        filter((next) => next.isSynced),
        filter((next) => next.dust.balance(new Date()) > 0n),
      ),
    );
  }
}
