import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { buildClearanceOpening, buildEngagementSnapshot, buildRegistryOpening, bytes32FromHex, commitOpenings, createWitnessPrivateState, type ClearanceOpening, type ConflictZeroPrivateState, type PublicRegistryState, type RegistryOpening } from '../../midnight-adapter/src/index.js';
import type { DecodedInput, LiveInput } from './types.js';
import { pureCircuits } from '../../../contract/src/managed/conflict-zero/contract/index.js';

function bytes(value: unknown, name: string): Uint8Array {
  if (typeof value !== 'string') throw new Error(`${name} must be a hex string`);
  return bytes32FromHex(value, name);
}
function slot(value: any, name: string) { return { active: Boolean(value?.active), fingerprint: bytes(value?.fingerprint, `${name}.fingerprint`) }; }
function registry(value: any): RegistryOpening {
  return { snapshot: { externalRegistryCommitment: bytes(value?.snapshot?.externalRegistryCommitment, 'registry.externalRegistryCommitment'), firmId: bytes(value?.snapshot?.firmId, 'registry.firmId'), instanceNonce: bytes(value?.snapshot?.instanceNonce, 'registry.instanceNonce'), version: BigInt(value?.snapshot?.version), slots: (value?.snapshot?.slots ?? []).map((s: any, i: number) => slot(s, `registry.slots[${i}]`)) }, randomness: bytes(value?.randomness, 'registry.randomness') };
}
function clearance(value: any): ClearanceOpening {
  const r = registry({ snapshot: value?.registry, randomness: value?.registryRandomness });
  const e = value?.engagement;
  return { registry: r.snapshot, registryRandomness: r.randomness, engagement: { engagementId: bytes(e?.engagementId, 'engagement.engagementId'), externalEngagementHash: bytes(e?.externalEngagementHash, 'engagement.externalEngagementHash'), firmId: bytes(e?.firmId, 'engagement.firmId'), instanceNonce: bytes(e?.instanceNonce, 'engagement.instanceNonce'), registryVersion: BigInt(e?.registryVersion), registryCommitment: bytes(e?.registryCommitment, 'engagement.registryCommitment'), externalRegistryCommitment: bytes(e?.externalRegistryCommitment, 'engagement.externalRegistryCommitment'), checkNonce: bytes(e?.checkNonce, 'engagement.checkNonce'), parties: (e?.parties ?? []).map((s: any, i: number) => slot(s, `engagement.parties[${i}]`)) }, engagementRandomness: bytes(value?.engagementRandomness, 'engagement.randomness') };
}

function generatedLocalInput(): DecodedInput {
  const b = () => new Uint8Array(randomBytes(32));
  const walletSeed = '0000000000000000000000000000000000000000000000000000000000000001';
  const firmId = b(), instanceNonce = b(), externalRegistryCommitment = b();
  const registryOpening = buildRegistryOpening({ externalRegistryCommitment, firmId, instanceNonce, version: 1n, entityIds: ['registry:acme-adviser'], pureCircuits, randomness: b() });
  const registryCommitment = pureCircuits.commitRegistry(registryOpening.snapshot, registryOpening.randomness);
  const engagementId = b(), engagementHash = b(), checkNonce = b(), engagementRandomness = b();
  const engagement = buildEngagementSnapshot({ engagementId, externalEngagementHash: engagementHash, firmId, instanceNonce, registryVersion: 1n, registryCommitment, externalRegistryCommitment, checkNonce, entityIds: ['engagement:independent-counterparty'], pureCircuits });
  const proposalCommitment = commitOpenings({ registryOpening, engagement, engagementRandomness, pureCircuits }).proposalCommitment;
  const clearanceOpening = buildClearanceOpening({ registryOpening, engagement, engagementRandomness });
  const publicState: PublicRegistryState = { firmId, instanceNonce, registryVersion: 1n, registryCommitment, externalRegistryCommitment };
  return { walletSeed, privateState: createWitnessPrivateState({ adminSecret: b(), registryOpening, clearanceOpening }), publicState, engagementId, engagementHash, proposalCommitment, checkNonce };
}

export async function loadInput(allowGeneratedLocalInput = false): Promise<DecodedInput> {
  const source = process.env.MIDNIGHT_LIVE_INPUT;
  if (!source) {
    if (allowGeneratedLocalInput) return generatedLocalInput();
    throw new Error('Set MIDNIGHT_LIVE_INPUT to an absolute path to an untracked JSON input file.');
  }
  const raw = JSON.parse(await readFile(source, 'utf8')) as LiveInput;
  if (!/^[0-9a-f]{64}$/i.test(raw.walletSeed ?? '')) throw new Error('walletSeed must be a 32-byte hexadecimal seed');
  const publicState: PublicRegistryState = { firmId: bytes(raw.publicState?.firmId, 'publicState.firmId'), instanceNonce: bytes(raw.publicState?.instanceNonce, 'publicState.instanceNonce'), registryCommitment: bytes(raw.publicState?.registryCommitment, 'publicState.registryCommitment'), externalRegistryCommitment: bytes(raw.publicState?.externalRegistryCommitment, 'publicState.externalRegistryCommitment'), registryVersion: BigInt(raw.publicState?.registryVersion) };
  const privateState: ConflictZeroPrivateState = { adminSecret: bytes(raw.adminSecret, 'adminSecret'), registryOpening: registry(raw.registryOpening), clearanceOpening: clearance(raw.clearanceOpening) };
  return { walletSeed: raw.walletSeed, privateState, publicState, engagementId: bytes(raw.engagementId, 'engagementId'), engagementHash: bytes(raw.engagementHash, 'engagementHash'), proposalCommitment: bytes(raw.proposalCommitment, 'proposalCommitment'), checkNonce: bytes(raw.checkNonce, 'checkNonce') };
}
