import type { ConflictZeroPrivateState, ClearanceOpening, RegistryOpening } from '../../midnight-adapter/src/index.js';
import type { Witnesses } from '../../../contract/src/managed/conflict-zero/contract/index.js';

/**
 * These witnesses are intentionally pure pass-throughs: their return state is the
 * adapter's private state, never serialized by this harness or sent to the indexer.
 */
export function makeWitnesses(): Witnesses<ConflictZeroPrivateState> {
  return {
    getAdminSecret: (context) => [context.privateState, context.privateState.adminSecret],
    getRegistryOpening: (context) => [context.privateState, context.privateState.registryOpening as RegistryOpening],
    getClearanceOpening: (context) => {
      const opening: ClearanceOpening | undefined = context.privateState.clearanceOpening;
      if (!opening) throw new Error('clearanceOpening is required for proveClear');
      return [context.privateState, opening];
    },
  };
}
