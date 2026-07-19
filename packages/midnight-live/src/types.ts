import type { ClearanceOpening, ConflictZeroPrivateState, PublicRegistryState } from '../../midnight-adapter/src/index.js';

export type Hex32 = string;

/** Deliberately supplied at runtime. Do not commit this object or any seed. */
export interface LiveInput {
  walletSeed: string;
  adminSecret: Hex32;
  publicState: {
    firmId: Hex32; instanceNonce: Hex32; registryCommitment: Hex32;
    externalRegistryCommitment: Hex32; registryVersion: string | number;
  };
  registryOpening: unknown;
  clearanceOpening: unknown;
  engagementId: Hex32; engagementHash: Hex32; proposalCommitment: Hex32; checkNonce: Hex32;
}

export interface DecodedInput {
  walletSeed: string;
  privateState: ConflictZeroPrivateState;
  publicState: PublicRegistryState;
  engagementId: Uint8Array; engagementHash: Uint8Array; proposalCommitment: Uint8Array; checkNonce: Uint8Array;
}

export type { ClearanceOpening };
