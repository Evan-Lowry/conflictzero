import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type EntitySlot = { active: boolean; fingerprint: Uint8Array };

export type ClearanceReceipt = { registryVersion: bigint;
                                 registryCommitment: Uint8Array;
                                 engagementHash: Uint8Array;
                                 proposalCommitment: Uint8Array;
                                 checkNonce: Uint8Array
                               };

export type Witnesses<PS> = {
  getAdminSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getRegistryOpening(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { snapshot: { externalRegistryCommitment: Uint8Array,
                                                                                               firmId: Uint8Array,
                                                                                               instanceNonce: Uint8Array,
                                                                                               version: bigint,
                                                                                               slots: EntitySlot[]
                                                                                             },
                                                                                   randomness: Uint8Array
                                                                                 }];
  getClearanceOpening(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { registry: { externalRegistryCommitment: Uint8Array,
                                                                                                firmId: Uint8Array,
                                                                                                instanceNonce: Uint8Array,
                                                                                                version: bigint,
                                                                                                slots: EntitySlot[]
                                                                                              },
                                                                                    registryRandomness: Uint8Array,
                                                                                    engagement: { engagementId: Uint8Array,
                                                                                                  externalEngagementHash: Uint8Array,
                                                                                                  firmId: Uint8Array,
                                                                                                  instanceNonce: Uint8Array,
                                                                                                  registryVersion: bigint,
                                                                                                  registryCommitment: Uint8Array,
                                                                                                  externalRegistryCommitment: Uint8Array,
                                                                                                  checkNonce: Uint8Array,
                                                                                                  parties: EntitySlot[]
                                                                                                },
                                                                                    engagementRandomness: Uint8Array
                                                                                  }];
}

export type ImpureCircuits<PS> = {
  updateRegistry(context: __compactRuntime.CircuitContext<PS>,
                 newRegistryCommitment_0: Uint8Array,
                 newExternalRegistryCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveClear(context: __compactRuntime.CircuitContext<PS>,
             engagementId_0: Uint8Array,
             engagementHash_0: Uint8Array,
             proposalCommitment_0: Uint8Array,
             checkNonce_0: Uint8Array,
             expectedRegistryVersion_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  updateRegistry(context: __compactRuntime.CircuitContext<PS>,
                 newRegistryCommitment_0: Uint8Array,
                 newExternalRegistryCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveClear(context: __compactRuntime.CircuitContext<PS>,
             engagementId_0: Uint8Array,
             engagementHash_0: Uint8Array,
             proposalCommitment_0: Uint8Array,
             checkNonce_0: Uint8Array,
             expectedRegistryVersion_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveAdminPublicKey(secret_0: Uint8Array): Uint8Array;
  entityFingerprint(entityId_0: Uint8Array): Uint8Array;
  commitRegistry(snapshot_0: { externalRegistryCommitment: Uint8Array,
                               firmId: Uint8Array,
                               instanceNonce: Uint8Array,
                               version: bigint,
                               slots: EntitySlot[]
                             },
                 randomness_0: Uint8Array): Uint8Array;
  commitEngagement(snapshot_0: { engagementId: Uint8Array,
                                 externalEngagementHash: Uint8Array,
                                 firmId: Uint8Array,
                                 instanceNonce: Uint8Array,
                                 registryVersion: bigint,
                                 registryCommitment: Uint8Array,
                                 externalRegistryCommitment: Uint8Array,
                                 checkNonce: Uint8Array,
                                 parties: EntitySlot[]
                               },
                   randomness_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  deriveAdminPublicKey(context: __compactRuntime.CircuitContext<PS>,
                       secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  entityFingerprint(context: __compactRuntime.CircuitContext<PS>,
                    entityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  commitRegistry(context: __compactRuntime.CircuitContext<PS>,
                 snapshot_0: { externalRegistryCommitment: Uint8Array,
                               firmId: Uint8Array,
                               instanceNonce: Uint8Array,
                               version: bigint,
                               slots: EntitySlot[]
                             },
                 randomness_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  commitEngagement(context: __compactRuntime.CircuitContext<PS>,
                   snapshot_0: { engagementId: Uint8Array,
                                 externalEngagementHash: Uint8Array,
                                 firmId: Uint8Array,
                                 instanceNonce: Uint8Array,
                                 registryVersion: bigint,
                                 registryCommitment: Uint8Array,
                                 externalRegistryCommitment: Uint8Array,
                                 checkNonce: Uint8Array,
                                 parties: EntitySlot[]
                               },
                   randomness_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  updateRegistry(context: __compactRuntime.CircuitContext<PS>,
                 newRegistryCommitment_0: Uint8Array,
                 newExternalRegistryCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveClear(context: __compactRuntime.CircuitContext<PS>,
             engagementId_0: Uint8Array,
             engagementHash_0: Uint8Array,
             proposalCommitment_0: Uint8Array,
             checkNonce_0: Uint8Array,
             expectedRegistryVersion_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly firmId: Uint8Array;
  readonly instanceNonce: Uint8Array;
  readonly adminPublicKey: Uint8Array;
  readonly registryVersion: bigint;
  readonly registryCommitment: Uint8Array;
  readonly externalRegistryCommitment: Uint8Array;
  clearanceReceipts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): ClearanceReceipt;
    [Symbol.iterator](): Iterator<[Uint8Array, ClearanceReceipt]>
  };
  consumedProposalCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  consumedCheckNonces: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initialFirmId_0: Uint8Array,
               deploymentNonce_0: Uint8Array,
               initialRegistryCommitment_0: Uint8Array,
               initialExternalRegistryCommitment_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
