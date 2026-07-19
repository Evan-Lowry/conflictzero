import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

class _ClearanceReceipt_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()))));
  }
  fromValue(value_0) {
    return {
      registryVersion: _descriptor_0.fromValue(value_0),
      registryCommitment: _descriptor_1.fromValue(value_0),
      engagementHash: _descriptor_1.fromValue(value_0),
      proposalCommitment: _descriptor_1.fromValue(value_0),
      checkNonce: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.registryVersion).concat(_descriptor_1.toValue(value_0.registryCommitment).concat(_descriptor_1.toValue(value_0.engagementHash).concat(_descriptor_1.toValue(value_0.proposalCommitment).concat(_descriptor_1.toValue(value_0.checkNonce)))));
  }
}

const _descriptor_3 = new _ClearanceReceipt_0();

class _EntitySlot_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      active: _descriptor_2.fromValue(value_0),
      fingerprint: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.active).concat(_descriptor_1.toValue(value_0.fingerprint));
  }
}

const _descriptor_4 = new _EntitySlot_0();

const _descriptor_5 = new __compactRuntime.CompactTypeVector(8, _descriptor_4);

class _RegistrySnapshot_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_5.alignment()))));
  }
  fromValue(value_0) {
    return {
      externalRegistryCommitment: _descriptor_1.fromValue(value_0),
      firmId: _descriptor_1.fromValue(value_0),
      instanceNonce: _descriptor_1.fromValue(value_0),
      version: _descriptor_0.fromValue(value_0),
      slots: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.externalRegistryCommitment).concat(_descriptor_1.toValue(value_0.firmId).concat(_descriptor_1.toValue(value_0.instanceNonce).concat(_descriptor_0.toValue(value_0.version).concat(_descriptor_5.toValue(value_0.slots)))));
  }
}

const _descriptor_6 = new _RegistrySnapshot_0();

const _descriptor_7 = new __compactRuntime.CompactTypeVector(4, _descriptor_4);

class _EngagementSnapshot_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_7.alignment()))))))));
  }
  fromValue(value_0) {
    return {
      engagementId: _descriptor_1.fromValue(value_0),
      externalEngagementHash: _descriptor_1.fromValue(value_0),
      firmId: _descriptor_1.fromValue(value_0),
      instanceNonce: _descriptor_1.fromValue(value_0),
      registryVersion: _descriptor_0.fromValue(value_0),
      registryCommitment: _descriptor_1.fromValue(value_0),
      externalRegistryCommitment: _descriptor_1.fromValue(value_0),
      checkNonce: _descriptor_1.fromValue(value_0),
      parties: _descriptor_7.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.engagementId).concat(_descriptor_1.toValue(value_0.externalEngagementHash).concat(_descriptor_1.toValue(value_0.firmId).concat(_descriptor_1.toValue(value_0.instanceNonce).concat(_descriptor_0.toValue(value_0.registryVersion).concat(_descriptor_1.toValue(value_0.registryCommitment).concat(_descriptor_1.toValue(value_0.externalRegistryCommitment).concat(_descriptor_1.toValue(value_0.checkNonce).concat(_descriptor_7.toValue(value_0.parties)))))))));
  }
}

const _descriptor_8 = new _EngagementSnapshot_0();

const _descriptor_9 = new __compactRuntime.CompactTypeBytes(64);

class _ClearanceOpening_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_1.alignment().concat(_descriptor_8.alignment().concat(_descriptor_1.alignment())));
  }
  fromValue(value_0) {
    return {
      registry: _descriptor_6.fromValue(value_0),
      registryRandomness: _descriptor_1.fromValue(value_0),
      engagement: _descriptor_8.fromValue(value_0),
      engagementRandomness: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.registry).concat(_descriptor_1.toValue(value_0.registryRandomness).concat(_descriptor_8.toValue(value_0.engagement).concat(_descriptor_1.toValue(value_0.engagementRandomness))));
  }
}

const _descriptor_10 = new _ClearanceOpening_0();

class _RegistryOpening_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      snapshot: _descriptor_6.fromValue(value_0),
      randomness: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.snapshot).concat(_descriptor_1.toValue(value_0.randomness));
  }
}

const _descriptor_11 = new _RegistryOpening_0();

const _descriptor_12 = new __compactRuntime.CompactTypeBytes(24);

class _tuple_0 {
  alignment() {
    return _descriptor_12.alignment().concat(_descriptor_6.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_12.fromValue(value_0),
      _descriptor_6.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_12.toValue(value_0[0]).concat(_descriptor_6.toValue(value_0[1]));
  }
}

const _descriptor_13 = new _tuple_0();

const _descriptor_14 = new __compactRuntime.CompactTypeBytes(26);

class _tuple_1 {
  alignment() {
    return _descriptor_14.alignment().concat(_descriptor_8.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_14.fromValue(value_0),
      _descriptor_8.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_14.toValue(value_0[0]).concat(_descriptor_8.toValue(value_0[1]));
  }
}

const _descriptor_15 = new _tuple_1();

const _descriptor_16 = new __compactRuntime.CompactTypeBytes(21);

class _tuple_2 {
  alignment() {
    return _descriptor_16.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_16.fromValue(value_0),
      _descriptor_1.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_16.toValue(value_0[0]).concat(_descriptor_1.toValue(value_0[1]));
  }
}

const _descriptor_17 = new _tuple_2();

const _descriptor_18 = new __compactRuntime.CompactTypeBytes(22);

class _tuple_3 {
  alignment() {
    return _descriptor_18.alignment().concat(_descriptor_9.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_18.fromValue(value_0),
      _descriptor_9.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_18.toValue(value_0[0]).concat(_descriptor_9.toValue(value_0[1]));
  }
}

const _descriptor_19 = new _tuple_3();

const _descriptor_20 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_21 = new _Either_0();

const _descriptor_22 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_23 = new _ContractAddress_0();

const _descriptor_24 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.getAdminSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getAdminSecret');
    }
    if (typeof(witnesses_0.getRegistryOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getRegistryOpening');
    }
    if (typeof(witnesses_0.getClearanceOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getClearanceOpening');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      deriveAdminPublicKey(context, ...args_1) {
        return { result: pureCircuits.deriveAdminPublicKey(...args_1), context };
      },
      entityFingerprint(context, ...args_1) {
        return { result: pureCircuits.entityFingerprint(...args_1), context };
      },
      commitRegistry(context, ...args_1) {
        return { result: pureCircuits.commitRegistry(...args_1), context };
      },
      commitEngagement(context, ...args_1) {
        return { result: pureCircuits.commitEngagement(...args_1), context };
      },
      updateRegistry: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`updateRegistry: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newRegistryCommitment_0 = args_1[1];
        const newExternalRegistryCommitment_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('updateRegistry',
                                     'argument 1 (as invoked from Typescript)',
                                     'conflict-zero.compact line 169 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(newRegistryCommitment_0.buffer instanceof ArrayBuffer && newRegistryCommitment_0.BYTES_PER_ELEMENT === 1 && newRegistryCommitment_0.length === 32)) {
          __compactRuntime.typeError('updateRegistry',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'conflict-zero.compact line 169 char 1',
                                     'Bytes<32>',
                                     newRegistryCommitment_0)
        }
        if (!(newExternalRegistryCommitment_0.buffer instanceof ArrayBuffer && newExternalRegistryCommitment_0.BYTES_PER_ELEMENT === 1 && newExternalRegistryCommitment_0.length === 32)) {
          __compactRuntime.typeError('updateRegistry',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'conflict-zero.compact line 169 char 1',
                                     'Bytes<32>',
                                     newExternalRegistryCommitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(newRegistryCommitment_0).concat(_descriptor_1.toValue(newExternalRegistryCommitment_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_1.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._updateRegistry_0(context,
                                                partialProofData,
                                                newRegistryCommitment_0,
                                                newExternalRegistryCommitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      proveClear: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`proveClear: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const engagementId_0 = args_1[1];
        const engagementHash_0 = args_1[2];
        const proposalCommitment_0 = args_1[3];
        const checkNonce_0 = args_1[4];
        const expectedRegistryVersion_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 1 (as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(engagementId_0.buffer instanceof ArrayBuffer && engagementId_0.BYTES_PER_ELEMENT === 1 && engagementId_0.length === 32)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'Bytes<32>',
                                     engagementId_0)
        }
        if (!(engagementHash_0.buffer instanceof ArrayBuffer && engagementHash_0.BYTES_PER_ELEMENT === 1 && engagementHash_0.length === 32)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'Bytes<32>',
                                     engagementHash_0)
        }
        if (!(proposalCommitment_0.buffer instanceof ArrayBuffer && proposalCommitment_0.BYTES_PER_ELEMENT === 1 && proposalCommitment_0.length === 32)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'Bytes<32>',
                                     proposalCommitment_0)
        }
        if (!(checkNonce_0.buffer instanceof ArrayBuffer && checkNonce_0.BYTES_PER_ELEMENT === 1 && checkNonce_0.length === 32)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'Bytes<32>',
                                     checkNonce_0)
        }
        if (!(typeof(expectedRegistryVersion_0) === 'bigint' && expectedRegistryVersion_0 >= 0n && expectedRegistryVersion_0 <= 4294967295n)) {
          __compactRuntime.typeError('proveClear',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'conflict-zero.compact line 199 char 1',
                                     'Uint<0..4294967296>',
                                     expectedRegistryVersion_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(engagementId_0).concat(_descriptor_1.toValue(engagementHash_0).concat(_descriptor_1.toValue(proposalCommitment_0).concat(_descriptor_1.toValue(checkNonce_0).concat(_descriptor_0.toValue(expectedRegistryVersion_0))))),
            alignment: _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._proveClear_0(context,
                                            partialProofData,
                                            engagementId_0,
                                            engagementHash_0,
                                            proposalCommitment_0,
                                            checkNonce_0,
                                            expectedRegistryVersion_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      updateRegistry: this.circuits.updateRegistry,
      proveClear: this.circuits.proveClear
    };
    this.provableCircuits = {
      updateRegistry: this.circuits.updateRegistry,
      proveClear: this.circuits.proveClear
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const initialFirmId_0 = args_0[1];
    const deploymentNonce_0 = args_0[2];
    const initialRegistryCommitment_0 = args_0[3];
    const initialExternalRegistryCommitment_0 = args_0[4];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(initialFirmId_0.buffer instanceof ArrayBuffer && initialFirmId_0.BYTES_PER_ELEMENT === 1 && initialFirmId_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'conflict-zero.compact line 79 char 1',
                                 'Bytes<32>',
                                 initialFirmId_0)
    }
    if (!(deploymentNonce_0.buffer instanceof ArrayBuffer && deploymentNonce_0.BYTES_PER_ELEMENT === 1 && deploymentNonce_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'conflict-zero.compact line 79 char 1',
                                 'Bytes<32>',
                                 deploymentNonce_0)
    }
    if (!(initialRegistryCommitment_0.buffer instanceof ArrayBuffer && initialRegistryCommitment_0.BYTES_PER_ELEMENT === 1 && initialRegistryCommitment_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'conflict-zero.compact line 79 char 1',
                                 'Bytes<32>',
                                 initialRegistryCommitment_0)
    }
    if (!(initialExternalRegistryCommitment_0.buffer instanceof ArrayBuffer && initialExternalRegistryCommitment_0.BYTES_PER_ELEMENT === 1 && initialExternalRegistryCommitment_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'conflict-zero.compact line 79 char 1',
                                 'Bytes<32>',
                                 initialExternalRegistryCommitment_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('updateRegistry', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveClear', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(0n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(1n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(2n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(3n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(4n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(5n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(6n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(7n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(8n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(0n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(initialFirmId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(1n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(deploymentNonce_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._deriveAdminPublicKey_0(this._getAdminSecret_0(context,
                                                                      partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(2n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const opening_0 = this._getRegistryOpening_0(context, partialProofData);
    this._assertCanonicalRegistry_0(opening_0.snapshot);
    __compactRuntime.assert(this._equal_0(opening_0.snapshot.firmId,
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_24.toValue(0n),
                                                                                                                                alignment: _descriptor_24.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'ConflictZero: initial registry firm mismatch');
    __compactRuntime.assert(this._equal_1(opening_0.snapshot.instanceNonce,
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_24.toValue(1n),
                                                                                                                                alignment: _descriptor_24.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'ConflictZero: initial registry deployment mismatch');
    __compactRuntime.assert(this._equal_2(opening_0.snapshot.version, 1n),
                            'ConflictZero: initial registry version must be one');
    __compactRuntime.assert(this._equal_3(opening_0.snapshot.externalRegistryCommitment,
                                          initialExternalRegistryCommitment_0),
                            'ConflictZero: initial external registry digest mismatch');
    __compactRuntime.assert(this._equal_4(this._commitRegistry_0(opening_0.snapshot,
                                                                 opening_0.randomness),
                                          initialRegistryCommitment_0),
                            'ConflictZero: initial registry commitment does not open');
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(3n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(4n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(initialRegistryCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(5n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(initialExternalRegistryCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_17, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_19, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_13,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_1(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_15,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _getAdminSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getAdminSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('getAdminSecret',
                                 'return value',
                                 'conflict-zero.compact line 55 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _getRegistryOpening_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getRegistryOpening(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.snapshot) === 'object' && result_0.snapshot.externalRegistryCommitment.buffer instanceof ArrayBuffer && result_0.snapshot.externalRegistryCommitment.BYTES_PER_ELEMENT === 1 && result_0.snapshot.externalRegistryCommitment.length === 32 && result_0.snapshot.firmId.buffer instanceof ArrayBuffer && result_0.snapshot.firmId.BYTES_PER_ELEMENT === 1 && result_0.snapshot.firmId.length === 32 && result_0.snapshot.instanceNonce.buffer instanceof ArrayBuffer && result_0.snapshot.instanceNonce.BYTES_PER_ELEMENT === 1 && result_0.snapshot.instanceNonce.length === 32 && typeof(result_0.snapshot.version) === 'bigint' && result_0.snapshot.version >= 0n && result_0.snapshot.version <= 4294967295n && Array.isArray(result_0.snapshot.slots) && result_0.snapshot.slots.length === 8 && result_0.snapshot.slots.every((t) => typeof(t) === 'object' && typeof(t.active) === 'boolean' && t.fingerprint.buffer instanceof ArrayBuffer && t.fingerprint.BYTES_PER_ELEMENT === 1 && t.fingerprint.length === 32) && result_0.randomness.buffer instanceof ArrayBuffer && result_0.randomness.BYTES_PER_ELEMENT === 1 && result_0.randomness.length === 32)) {
      __compactRuntime.typeError('getRegistryOpening',
                                 'return value',
                                 'conflict-zero.compact line 57 char 1',
                                 'struct RegistryOpening<snapshot: struct RegistrySnapshot<externalRegistryCommitment: Bytes<32>, firmId: Bytes<32>, instanceNonce: Bytes<32>, version: Uint<0..4294967296>, slots: Vector<8, struct EntitySlot<active: Boolean, fingerprint: Bytes<32>>>>, randomness: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_11.toValue(result_0),
      alignment: _descriptor_11.alignment()
    });
    return result_0;
  }
  _getClearanceOpening_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getClearanceOpening(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.registry) === 'object' && result_0.registry.externalRegistryCommitment.buffer instanceof ArrayBuffer && result_0.registry.externalRegistryCommitment.BYTES_PER_ELEMENT === 1 && result_0.registry.externalRegistryCommitment.length === 32 && result_0.registry.firmId.buffer instanceof ArrayBuffer && result_0.registry.firmId.BYTES_PER_ELEMENT === 1 && result_0.registry.firmId.length === 32 && result_0.registry.instanceNonce.buffer instanceof ArrayBuffer && result_0.registry.instanceNonce.BYTES_PER_ELEMENT === 1 && result_0.registry.instanceNonce.length === 32 && typeof(result_0.registry.version) === 'bigint' && result_0.registry.version >= 0n && result_0.registry.version <= 4294967295n && Array.isArray(result_0.registry.slots) && result_0.registry.slots.length === 8 && result_0.registry.slots.every((t) => typeof(t) === 'object' && typeof(t.active) === 'boolean' && t.fingerprint.buffer instanceof ArrayBuffer && t.fingerprint.BYTES_PER_ELEMENT === 1 && t.fingerprint.length === 32) && result_0.registryRandomness.buffer instanceof ArrayBuffer && result_0.registryRandomness.BYTES_PER_ELEMENT === 1 && result_0.registryRandomness.length === 32 && typeof(result_0.engagement) === 'object' && result_0.engagement.engagementId.buffer instanceof ArrayBuffer && result_0.engagement.engagementId.BYTES_PER_ELEMENT === 1 && result_0.engagement.engagementId.length === 32 && result_0.engagement.externalEngagementHash.buffer instanceof ArrayBuffer && result_0.engagement.externalEngagementHash.BYTES_PER_ELEMENT === 1 && result_0.engagement.externalEngagementHash.length === 32 && result_0.engagement.firmId.buffer instanceof ArrayBuffer && result_0.engagement.firmId.BYTES_PER_ELEMENT === 1 && result_0.engagement.firmId.length === 32 && result_0.engagement.instanceNonce.buffer instanceof ArrayBuffer && result_0.engagement.instanceNonce.BYTES_PER_ELEMENT === 1 && result_0.engagement.instanceNonce.length === 32 && typeof(result_0.engagement.registryVersion) === 'bigint' && result_0.engagement.registryVersion >= 0n && result_0.engagement.registryVersion <= 4294967295n && result_0.engagement.registryCommitment.buffer instanceof ArrayBuffer && result_0.engagement.registryCommitment.BYTES_PER_ELEMENT === 1 && result_0.engagement.registryCommitment.length === 32 && result_0.engagement.externalRegistryCommitment.buffer instanceof ArrayBuffer && result_0.engagement.externalRegistryCommitment.BYTES_PER_ELEMENT === 1 && result_0.engagement.externalRegistryCommitment.length === 32 && result_0.engagement.checkNonce.buffer instanceof ArrayBuffer && result_0.engagement.checkNonce.BYTES_PER_ELEMENT === 1 && result_0.engagement.checkNonce.length === 32 && Array.isArray(result_0.engagement.parties) && result_0.engagement.parties.length === 4 && result_0.engagement.parties.every((t) => typeof(t) === 'object' && typeof(t.active) === 'boolean' && t.fingerprint.buffer instanceof ArrayBuffer && t.fingerprint.BYTES_PER_ELEMENT === 1 && t.fingerprint.length === 32) && result_0.engagementRandomness.buffer instanceof ArrayBuffer && result_0.engagementRandomness.BYTES_PER_ELEMENT === 1 && result_0.engagementRandomness.length === 32)) {
      __compactRuntime.typeError('getClearanceOpening',
                                 'return value',
                                 'conflict-zero.compact line 59 char 1',
                                 'struct ClearanceOpening<registry: struct RegistrySnapshot<externalRegistryCommitment: Bytes<32>, firmId: Bytes<32>, instanceNonce: Bytes<32>, version: Uint<0..4294967296>, slots: Vector<8, struct EntitySlot<active: Boolean, fingerprint: Bytes<32>>>>, registryRandomness: Bytes<32>, engagement: struct EngagementSnapshot<engagementId: Bytes<32>, externalEngagementHash: Bytes<32>, firmId: Bytes<32>, instanceNonce: Bytes<32>, registryVersion: Uint<0..4294967296>, registryCommitment: Bytes<32>, externalRegistryCommitment: Bytes<32>, checkNonce: Bytes<32>, parties: Vector<4, struct EntitySlot<active: Boolean, fingerprint: Bytes<32>>>>, engagementRandomness: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_10.toValue(result_0),
      alignment: _descriptor_10.alignment()
    });
    return result_0;
  }
  _deriveAdminPublicKey_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([99, 111, 110, 102, 108, 105, 99, 116, 122, 101, 114, 111, 58, 97, 100, 109, 105, 110, 58, 118, 49]),
                                   secret_0]);
  }
  _entityFingerprint_0(entityId_0) {
    return this._persistentHash_1([new Uint8Array([99, 111, 110, 102, 108, 105, 99, 116, 122, 101, 114, 111, 58, 101, 110, 116, 105, 116, 121, 58, 118, 49]),
                                   entityId_0]);
  }
  _commitRegistry_0(snapshot_0, randomness_0) {
    return this._persistentCommit_0([new Uint8Array([99, 111, 110, 102, 108, 105, 99, 116, 122, 101, 114, 111, 58, 114, 101, 103, 105, 115, 116, 114, 121, 58, 118, 49]),
                                     snapshot_0],
                                    randomness_0);
  }
  _commitEngagement_0(snapshot_0, randomness_0) {
    return this._persistentCommit_1([new Uint8Array([99, 111, 110, 102, 108, 105, 99, 116, 122, 101, 114, 111, 58, 101, 110, 103, 97, 103, 101, 109, 101, 110, 116, 58, 118, 49]),
                                     snapshot_0],
                                    randomness_0);
  }
  _assertAdmin_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_5(this._deriveAdminPublicKey_0(this._getAdminSecret_0(context,
                                                                                              partialProofData)),
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_24.toValue(2n),
                                                                                                                                alignment: _descriptor_24.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'ConflictZero: admin authorization failed');
    return [];
  }
  _assertCanonicalRegistry_0(snapshot_0) {
    __compactRuntime.assert(snapshot_0.slots[0].active,
                            'ConflictZero: registry cannot be empty');
    this._folder_0(((t_0, slot_0) =>
                    {
                      __compactRuntime.assert(slot_0.active
                                              ||
                                              this._equal_6(slot_0.fingerprint,
                                                            new Uint8Array(32)),
                                              'ConflictZero: inactive registry slot must be zero');
                      __compactRuntime.assert(!slot_0.active
                                              ||
                                              !this._equal_7(slot_0.fingerprint,
                                                             new Uint8Array(32)),
                                              'ConflictZero: active registry slot cannot be zero');
                      return t_0;
                    }),
                   [],
                   snapshot_0.slots);
    return [];
  }
  _assertCanonicalEngagement_0(snapshot_0) {
    __compactRuntime.assert(snapshot_0.parties[0].active,
                            'ConflictZero: engagement cannot be empty');
    this._folder_1(((t_0, slot_0) =>
                    {
                      __compactRuntime.assert(slot_0.active
                                              ||
                                              this._equal_8(slot_0.fingerprint,
                                                            new Uint8Array(32)),
                                              'ConflictZero: inactive engagement slot must be zero');
                      __compactRuntime.assert(!slot_0.active
                                              ||
                                              !this._equal_9(slot_0.fingerprint,
                                                             new Uint8Array(32)),
                                              'ConflictZero: active engagement slot cannot be zero');
                      return t_0;
                    }),
                   [],
                   snapshot_0.parties);
    return [];
  }
  _updateRegistry_0(context,
                    partialProofData,
                    newRegistryCommitment_0,
                    newExternalRegistryCommitment_0)
  {
    this._assertAdmin_0(context, partialProofData);
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_24.toValue(3n),
                                                                                                                         alignment: _descriptor_24.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 < 4294967295n),
                            'ConflictZero: registry version exhausted');
    const opening_0 = this._getRegistryOpening_0(context, partialProofData);
    const nextVersion_0 = ((t1) => {
                            if (t1 > 4294967295n) {
                              throw new __compactRuntime.CompactError('conflict-zero.compact line 177 char 23: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                            }
                            return t1;
                          })(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(3n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value)
                             +
                             1n);
    this._assertCanonicalRegistry_0(opening_0.snapshot);
    __compactRuntime.assert(this._equal_10(opening_0.snapshot.firmId,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(0n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: wrong firm');
    __compactRuntime.assert(this._equal_11(opening_0.snapshot.instanceNonce,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(1n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: wrong deployment');
    __compactRuntime.assert(this._equal_12(opening_0.snapshot.version,
                                           nextVersion_0),
                            'ConflictZero: wrong registry version');
    __compactRuntime.assert(this._equal_13(opening_0.snapshot.externalRegistryCommitment,
                                           newExternalRegistryCommitment_0),
                            'ConflictZero: external registry digest mismatch');
    __compactRuntime.assert(this._equal_14(this._commitRegistry_0(opening_0.snapshot,
                                                                  opening_0.randomness),
                                           newRegistryCommitment_0),
                            'ConflictZero: invalid registry opening');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(3n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nextVersion_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(4n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(newRegistryCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(5n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(newExternalRegistryCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _proveClear_0(context,
                partialProofData,
                engagementId_0,
                engagementHash_0,
                proposalCommitment_0,
                checkNonce_0,
                expectedRegistryVersion_0)
  {
    const publicEngagementId_0 = engagementId_0;
    const publicEngagementHash_0 = engagementHash_0;
    const publicProposalCommitment_0 = proposalCommitment_0;
    const publicCheckNonce_0 = checkNonce_0;
    const publicExpectedVersion_0 = expectedRegistryVersion_0;
    __compactRuntime.assert(this._equal_15(publicExpectedVersion_0,
                                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(3n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: stale registry version');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(6n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicEngagementId_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'ConflictZero: engagement already finalized');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(7n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicProposalCommitment_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'ConflictZero: proposal replay');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(8n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicCheckNonce_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'ConflictZero: check nonce replay');
    const opening_0 = this._getClearanceOpening_0(context, partialProofData);
    this._assertCanonicalRegistry_0(opening_0.registry);
    this._assertCanonicalEngagement_0(opening_0.engagement);
    __compactRuntime.assert(this._equal_16(opening_0.registry.firmId,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(0n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: registry firm mismatch');
    __compactRuntime.assert(this._equal_17(opening_0.registry.instanceNonce,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(1n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: registry deployment mismatch');
    __compactRuntime.assert(this._equal_18(opening_0.registry.version,
                                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(3n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: stale private registry');
    __compactRuntime.assert(this._equal_19(opening_0.registry.externalRegistryCommitment,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(5n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: external registry digest changed');
    __compactRuntime.assert(this._equal_20(this._commitRegistry_0(opening_0.registry,
                                                                  opening_0.registryRandomness),
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(4n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: registry commitment does not open');
    __compactRuntime.assert(this._equal_21(opening_0.engagement.firmId,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(0n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: engagement firm mismatch');
    __compactRuntime.assert(this._equal_22(opening_0.engagement.instanceNonce,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(1n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: engagement deployment mismatch');
    __compactRuntime.assert(this._equal_23(opening_0.engagement.engagementId,
                                           publicEngagementId_0),
                            'ConflictZero: engagement id mismatch');
    __compactRuntime.assert(this._equal_24(opening_0.engagement.registryVersion,
                                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(3n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: proposal registry version mismatch');
    __compactRuntime.assert(this._equal_25(opening_0.engagement.registryCommitment,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(4n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: proposal registry commitment mismatch');
    __compactRuntime.assert(this._equal_26(opening_0.engagement.externalRegistryCommitment,
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(5n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'ConflictZero: proposal external registry digest mismatch');
    __compactRuntime.assert(this._equal_27(opening_0.engagement.checkNonce,
                                           publicCheckNonce_0),
                            'ConflictZero: proposal check nonce mismatch');
    __compactRuntime.assert(this._equal_28(opening_0.engagement.externalEngagementHash,
                                           publicEngagementHash_0),
                            'ConflictZero: engagement hash mismatch');
    __compactRuntime.assert(this._equal_29(this._commitEngagement_0(opening_0.engagement,
                                                                    opening_0.engagementRandomness),
                                           publicProposalCommitment_0),
                            'ConflictZero: proposal commitment does not open');
    this._folder_3(context,
                   partialProofData,
                   ((context, partialProofData, t_0, registrySlot_0) =>
                    {
                      this._folder_2(context,
                                     partialProofData,
                                     ((context,
                                       partialProofData,
                                       t_1,
                                       engagementSlot_0) =>
                                      {
                                        __compactRuntime.assert(!registrySlot_0.active
                                                                ||
                                                                !engagementSlot_0.active
                                                                ||
                                                                !this._equal_30(registrySlot_0.fingerprint,
                                                                                engagementSlot_0.fingerprint),
                                                                'ConflictZero: private conflict detected');
                                        return t_1;
                                      }),
                                     [],
                                     opening_0.engagement.parties);
                      return t_0;
                    }),
                   [],
                   opening_0.registry.slots);
    const tmp_0 = { registryVersion:
                      _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_24.toValue(3n),
                                                                                                            alignment: _descriptor_24.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value),
                    registryCommitment:
                      _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_24.toValue(4n),
                                                                                                            alignment: _descriptor_24.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value),
                    engagementHash: publicEngagementHash_0,
                    proposalCommitment: publicProposalCommitment_0,
                    checkNonce: publicCheckNonce_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(6n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicEngagementId_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(7n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicProposalCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(8n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicCheckNonce_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_0(f, x, a0) {
    for (let i = 0; i < 8; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_1(f, x, a0) {
    for (let i = 0; i < 4; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_14(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_15(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_16(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_17(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_18(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_19(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_20(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_21(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_22(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_23(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_24(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_25(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_26(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_27(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_28(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_29(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_30(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_2(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 4; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _folder_3(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 8; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get firmId() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(0n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get instanceNonce() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(1n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get adminPublicKey() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(2n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get registryVersion() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(3n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get registryCommitment() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(4n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get externalRegistryCommitment() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(5n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    clearanceReceipts: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(6n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(0n),
                                                                                                                                 alignment: _descriptor_20.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_20.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_24.toValue(6n),
                                                                                                      alignment: _descriptor_24.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'conflict-zero.compact line 73 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(6n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'conflict-zero.compact line 73 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(6n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(key_0),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    consumedProposalCommitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(7n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(0n),
                                                                                                                                 alignment: _descriptor_20.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_20.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_24.toValue(7n),
                                                                                                      alignment: _descriptor_24.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'conflict-zero.compact line 75 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(7n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map((elem) => _descriptor_1.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    consumedCheckNonces: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(8n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_20.toValue(0n),
                                                                                                                                 alignment: _descriptor_20.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_20.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_24.toValue(8n),
                                                                                                      alignment: _descriptor_24.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'conflict-zero.compact line 77 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(8n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asMap().keys().map((elem) => _descriptor_1.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getAdminSecret: (...args) => undefined,
  getRegistryOpening: (...args) => undefined,
  getClearanceOpening: (...args) => undefined
});
export const pureCircuits = {
  deriveAdminPublicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveAdminPublicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveAdminPublicKey',
                                 'argument 1',
                                 'conflict-zero.compact line 112 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveAdminPublicKey_0(secret_0);
  },
  entityFingerprint: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`entityFingerprint: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const entityId_0 = args_0[0];
    if (!(entityId_0.buffer instanceof ArrayBuffer && entityId_0.BYTES_PER_ELEMENT === 1 && entityId_0.length === 64)) {
      __compactRuntime.typeError('entityFingerprint',
                                 'argument 1',
                                 'conflict-zero.compact line 118 char 1',
                                 'Bytes<64>',
                                 entityId_0)
    }
    return _dummyContract._entityFingerprint_0(entityId_0);
  },
  commitRegistry: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`commitRegistry: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const snapshot_0 = args_0[0];
    const randomness_0 = args_0[1];
    if (!(typeof(snapshot_0) === 'object' && snapshot_0.externalRegistryCommitment.buffer instanceof ArrayBuffer && snapshot_0.externalRegistryCommitment.BYTES_PER_ELEMENT === 1 && snapshot_0.externalRegistryCommitment.length === 32 && snapshot_0.firmId.buffer instanceof ArrayBuffer && snapshot_0.firmId.BYTES_PER_ELEMENT === 1 && snapshot_0.firmId.length === 32 && snapshot_0.instanceNonce.buffer instanceof ArrayBuffer && snapshot_0.instanceNonce.BYTES_PER_ELEMENT === 1 && snapshot_0.instanceNonce.length === 32 && typeof(snapshot_0.version) === 'bigint' && snapshot_0.version >= 0n && snapshot_0.version <= 4294967295n && Array.isArray(snapshot_0.slots) && snapshot_0.slots.length === 8 && snapshot_0.slots.every((t) => typeof(t) === 'object' && typeof(t.active) === 'boolean' && t.fingerprint.buffer instanceof ArrayBuffer && t.fingerprint.BYTES_PER_ELEMENT === 1 && t.fingerprint.length === 32))) {
      __compactRuntime.typeError('commitRegistry',
                                 'argument 1',
                                 'conflict-zero.compact line 122 char 1',
                                 'struct RegistrySnapshot<externalRegistryCommitment: Bytes<32>, firmId: Bytes<32>, instanceNonce: Bytes<32>, version: Uint<0..4294967296>, slots: Vector<8, struct EntitySlot<active: Boolean, fingerprint: Bytes<32>>>>',
                                 snapshot_0)
    }
    if (!(randomness_0.buffer instanceof ArrayBuffer && randomness_0.BYTES_PER_ELEMENT === 1 && randomness_0.length === 32)) {
      __compactRuntime.typeError('commitRegistry',
                                 'argument 2',
                                 'conflict-zero.compact line 122 char 1',
                                 'Bytes<32>',
                                 randomness_0)
    }
    return _dummyContract._commitRegistry_0(snapshot_0, randomness_0);
  },
  commitEngagement: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`commitEngagement: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const snapshot_0 = args_0[0];
    const randomness_0 = args_0[1];
    if (!(typeof(snapshot_0) === 'object' && snapshot_0.engagementId.buffer instanceof ArrayBuffer && snapshot_0.engagementId.BYTES_PER_ELEMENT === 1 && snapshot_0.engagementId.length === 32 && snapshot_0.externalEngagementHash.buffer instanceof ArrayBuffer && snapshot_0.externalEngagementHash.BYTES_PER_ELEMENT === 1 && snapshot_0.externalEngagementHash.length === 32 && snapshot_0.firmId.buffer instanceof ArrayBuffer && snapshot_0.firmId.BYTES_PER_ELEMENT === 1 && snapshot_0.firmId.length === 32 && snapshot_0.instanceNonce.buffer instanceof ArrayBuffer && snapshot_0.instanceNonce.BYTES_PER_ELEMENT === 1 && snapshot_0.instanceNonce.length === 32 && typeof(snapshot_0.registryVersion) === 'bigint' && snapshot_0.registryVersion >= 0n && snapshot_0.registryVersion <= 4294967295n && snapshot_0.registryCommitment.buffer instanceof ArrayBuffer && snapshot_0.registryCommitment.BYTES_PER_ELEMENT === 1 && snapshot_0.registryCommitment.length === 32 && snapshot_0.externalRegistryCommitment.buffer instanceof ArrayBuffer && snapshot_0.externalRegistryCommitment.BYTES_PER_ELEMENT === 1 && snapshot_0.externalRegistryCommitment.length === 32 && snapshot_0.checkNonce.buffer instanceof ArrayBuffer && snapshot_0.checkNonce.BYTES_PER_ELEMENT === 1 && snapshot_0.checkNonce.length === 32 && Array.isArray(snapshot_0.parties) && snapshot_0.parties.length === 4 && snapshot_0.parties.every((t) => typeof(t) === 'object' && typeof(t.active) === 'boolean' && t.fingerprint.buffer instanceof ArrayBuffer && t.fingerprint.BYTES_PER_ELEMENT === 1 && t.fingerprint.length === 32))) {
      __compactRuntime.typeError('commitEngagement',
                                 'argument 1',
                                 'conflict-zero.compact line 129 char 1',
                                 'struct EngagementSnapshot<engagementId: Bytes<32>, externalEngagementHash: Bytes<32>, firmId: Bytes<32>, instanceNonce: Bytes<32>, registryVersion: Uint<0..4294967296>, registryCommitment: Bytes<32>, externalRegistryCommitment: Bytes<32>, checkNonce: Bytes<32>, parties: Vector<4, struct EntitySlot<active: Boolean, fingerprint: Bytes<32>>>>',
                                 snapshot_0)
    }
    if (!(randomness_0.buffer instanceof ArrayBuffer && randomness_0.BYTES_PER_ELEMENT === 1 && randomness_0.length === 32)) {
      __compactRuntime.typeError('commitEngagement',
                                 'argument 2',
                                 'conflict-zero.compact line 129 char 1',
                                 'Bytes<32>',
                                 randomness_0)
    }
    return _dummyContract._commitEngagement_0(snapshot_0, randomness_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
