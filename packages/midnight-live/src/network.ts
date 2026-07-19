export type LiveNetwork = 'local' | 'preview';
export interface NetworkConfig { id: 'undeployed' | 'preview'; indexer: string; indexerWS: string; node: string; proofServer: string; }

export function resolveNetwork(): NetworkConfig {
  const requested = (process.env.MIDNIGHT_LIVE_NETWORK ?? 'local') as LiveNetwork;
  if (requested !== 'local' && requested !== 'preview') throw new Error('MIDNIGHT_LIVE_NETWORK must be local or preview');
  const base = requested === 'local'
    ? { id: 'undeployed' as const, indexer: 'http://127.0.0.1:8088/api/v4/graphql', indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws', node: 'ws://127.0.0.1:9944', proofServer: 'http://127.0.0.1:6300' }
    : { id: 'preview' as const, indexer: 'https://indexer.preview.midnight.network/api/v4/graphql', indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws', node: 'https://rpc.preview.midnight.network', proofServer: 'http://127.0.0.1:6300' };
  return { ...base, indexer: process.env.MIDNIGHT_INDEXER_URL ?? base.indexer, indexerWS: process.env.MIDNIGHT_INDEXER_WS_URL ?? base.indexerWS, node: process.env.MIDNIGHT_NODE_URL ?? base.node, proofServer: process.env.MIDNIGHT_PROOF_SERVER_URL ?? base.proofServer };
}
