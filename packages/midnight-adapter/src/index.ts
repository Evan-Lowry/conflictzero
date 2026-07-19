/**
 * ConflictZero's app-layer bridge to the generated Compact contract.
 *
 * This package deliberately has no direct runtime dependency on a wallet or a
 * Midnight node. `pureCircuits` and transaction operations are injected so the
 * browser can load generated bindings only in its configured network build.
 */

export const REGISTRY_CAPACITY = 8;
export const ENGAGEMENT_CAPACITY = 4;
export const BYTE32 = 32;
export const ENTITY_IDENTIFIER_BYTES = 64;

export type Bytes32 = Uint8Array;
export type Bytes64 = Uint8Array;

export interface EntitySlot {
  active: boolean;
  fingerprint: Bytes32;
}

export interface RegistrySnapshot {
  externalRegistryCommitment: Bytes32;
  firmId: Bytes32;
  instanceNonce: Bytes32;
  version: bigint;
  slots: EntitySlot[];
}

export interface EngagementSnapshot {
  engagementId: Bytes32;
  externalEngagementHash: Bytes32;
  firmId: Bytes32;
  instanceNonce: Bytes32;
  registryVersion: bigint;
  registryCommitment: Bytes32;
  externalRegistryCommitment: Bytes32;
  checkNonce: Bytes32;
  parties: EntitySlot[];
}

export interface RegistryOpening { snapshot: RegistrySnapshot; randomness: Bytes32; }
export interface ClearanceOpening {
  registry: RegistrySnapshot;
  registryRandomness: Bytes32;
  engagement: EngagementSnapshot;
  engagementRandomness: Bytes32;
}

/** Matches the generated `pureCircuits` surface in contract/src/managed. */
export interface ConflictZeroPureCircuits {
  entityFingerprint(entityId: Bytes64): Bytes32;
  commitRegistry(snapshot: RegistrySnapshot, randomness: Bytes32): Bytes32;
  commitEngagement(snapshot: EngagementSnapshot, randomness: Bytes32): Bytes32;
}

export interface ConflictZeroPrivateState {
  /** Never serialize this value into logs, receipts, analytics, or URLs. */
  adminSecret: Bytes32;
  registryOpening: RegistryOpening;
  /** Set only while preparing one `proveClear` proof. */
  clearanceOpening?: ClearanceOpening;
}

export interface PublicRegistryState {
  firmId: Bytes32;
  instanceNonce: Bytes32;
  registryVersion: bigint;
  registryCommitment: Bytes32;
  externalRegistryCommitment: Bytes32;
}

export interface ClearanceReceipt {
  registryVersion: bigint;
  registryCommitment: Bytes32;
  engagementHash: Bytes32;
  proposalCommitment: Bytes32;
  checkNonce: Bytes32;
}

export interface DeployInput { publicState: PublicRegistryState; privateState: ConflictZeroPrivateState; }
export interface JoinInput { contractAddress: string; publicState: PublicRegistryState; privateState: ConflictZeroPrivateState; }
export interface UpdateRegistryInput {
  contractAddress: string;
  /** Current public ledger view, used to reject stale local state before submit. */
  publicState: PublicRegistryState;
  privateState: ConflictZeroPrivateState;
  nextRegistryOpening: RegistryOpening;
  /** Commitment/digest/version that will be published by updateRegistry. */
  nextPublicState: PublicRegistryState;
}

export interface ProveClearInput {
  contractAddress: string;
  publicState: PublicRegistryState;
  privateState: ConflictZeroPrivateState;
  engagementId: Bytes32;
  engagementHash: Bytes32;
  /** Generated `pureCircuits.commitEngagement` result, public in proveClear. */
  proposalCommitment: Bytes32;
  checkNonce: Bytes32;
  expectedRegistryVersion: bigint;
}

export interface TransactionResult { transactionId: string; }
export interface ProveClearResult extends TransactionResult { receipt: ClearanceReceipt; }

/** One application boundary for live Midnight and clearly-labelled offline demo modes. */
export interface ConflictZeroProvider {
  deploy(input: DeployInput): Promise<{ contractAddress: string; transactionId: string }>;
  join(input: JoinInput): Promise<void>;
  updateRegistry(input: UpdateRegistryInput): Promise<TransactionResult>;
  proveClear(input: ProveClearInput): Promise<ProveClearResult>;
  getReceipt(contractAddress: string, engagementId: Bytes32): Promise<ClearanceReceipt | null>;
}

const encoder = new TextEncoder();
const ZERO32 = new Uint8Array(BYTE32);

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) result |= a[index] ^ b[index];
  return result === 0;
}

function assertBytes(value: Uint8Array, length: number, field: string): void {
  if (!(value instanceof Uint8Array) || value.length !== length) throw new Error(`${field} must be exactly ${length} bytes`);
}

function cloneBytes(value: Uint8Array): Uint8Array { return new Uint8Array(value); }
function cloneSlot(slot: EntitySlot): EntitySlot { return { active: slot.active, fingerprint: cloneBytes(slot.fingerprint) }; }

/** Exact contract encoding: UTF-8, no NUL, at most 64 bytes, then zero-padded. */
export function encodeEntityIdentifier(entityId: string): Bytes64 {
  if (!entityId) throw new Error("entity identifier must not be empty");
  if (entityId.includes("\0")) throw new Error("entity identifier must not contain NUL");
  const encoded = encoder.encode(entityId);
  if (encoded.length > ENTITY_IDENTIFIER_BYTES) throw new Error(`entity identifier exceeds ${ENTITY_IDENTIFIER_BYTES} UTF-8 bytes`);
  const padded = new Uint8Array(ENTITY_IDENTIFIER_BYTES);
  padded.set(encoded);
  return padded;
}

export function bytes32FromHex(value: string, field = "hex value"): Bytes32 {
  if (!/^[0-9a-fA-F]{64}$/.test(value)) throw new Error(`${field} must be 64 hexadecimal characters`);
  return Uint8Array.from(value.match(/../g)!.map((byte) => Number.parseInt(byte, 16)));
}

export function bytesToHex(value: Uint8Array): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Commitment randomness must come from the platform CSPRNG; it is never deterministic. */
export function randomBytes32(): Bytes32 {
  const browserCrypto = globalThis.crypto;
  if (!browserCrypto?.getRandomValues) throw new Error("Web Crypto getRandomValues is unavailable");
  return browserCrypto.getRandomValues(new Uint8Array(BYTE32));
}

function fixedSlots(fingerprints: readonly Bytes32[], capacity: number, field: string): EntitySlot[] {
  if (!fingerprints.length) throw new Error(`${field} cannot be empty`);
  if (fingerprints.length > capacity) throw new Error(`${field} exceeds fixed capacity of ${capacity}`);
  const active = fingerprints.map((fingerprint) => {
    assertBytes(fingerprint, BYTE32, `${field} fingerprint`);
    if (bytesEqual(fingerprint, ZERO32)) throw new Error(`${field} fingerprint cannot be zero`);
    return { active: true, fingerprint: cloneBytes(fingerprint) };
  });
  return [...active, ...Array.from({ length: capacity - active.length }, () => ({ active: false, fingerprint: new Uint8Array(BYTE32) }))];
}

/** Calls the generated Compact hash once per normalized core identifier. */
export function fingerprintEntities(entityIds: readonly string[], pureCircuits: Pick<ConflictZeroPureCircuits, "entityFingerprint">): Bytes32[] {
  if (new Set(entityIds).size !== entityIds.length) throw new Error("entity identifiers must be unique before fingerprinting");
  return entityIds.map((entityId) => {
    const fingerprint = pureCircuits.entityFingerprint(encodeEntityIdentifier(entityId));
    assertBytes(fingerprint, BYTE32, "generated entity fingerprint");
    return cloneBytes(fingerprint);
  });
}

export function buildRegistrySnapshot(args: {
  externalRegistryCommitment: Bytes32; firmId: Bytes32; instanceNonce: Bytes32; version: bigint;
  entityIds: readonly string[]; pureCircuits: Pick<ConflictZeroPureCircuits, "entityFingerprint">;
}): RegistrySnapshot {
  assertBytes(args.externalRegistryCommitment, BYTE32, "external registry commitment");
  assertBytes(args.firmId, BYTE32, "firm id"); assertBytes(args.instanceNonce, BYTE32, "instance nonce");
  if (args.version < 1n || args.version > 0xffffffffn) throw new Error("registry version must be a Uint32 greater than zero");
  return {
    externalRegistryCommitment: cloneBytes(args.externalRegistryCommitment), firmId: cloneBytes(args.firmId), instanceNonce: cloneBytes(args.instanceNonce), version: args.version,
    slots: fixedSlots(fingerprintEntities(args.entityIds, args.pureCircuits), REGISTRY_CAPACITY, "registry"),
  };
}

export function buildRegistryOpening(args: Parameters<typeof buildRegistrySnapshot>[0] & { randomness: Bytes32 }): RegistryOpening {
  assertBytes(args.randomness, BYTE32, "registry randomness");
  return { snapshot: buildRegistrySnapshot(args), randomness: cloneBytes(args.randomness) };
}

export function buildEngagementSnapshot(args: {
  engagementId: Bytes32; externalEngagementHash: Bytes32; firmId: Bytes32; instanceNonce: Bytes32; registryVersion: bigint;
  registryCommitment: Bytes32; externalRegistryCommitment: Bytes32; checkNonce: Bytes32; entityIds: readonly string[];
  pureCircuits: Pick<ConflictZeroPureCircuits, "entityFingerprint">;
}): EngagementSnapshot {
  for (const [name, value] of Object.entries({ engagementId: args.engagementId, externalEngagementHash: args.externalEngagementHash, firmId: args.firmId, instanceNonce: args.instanceNonce, registryCommitment: args.registryCommitment, externalRegistryCommitment: args.externalRegistryCommitment, checkNonce: args.checkNonce })) assertBytes(value, BYTE32, name);
  if (args.registryVersion < 1n || args.registryVersion > 0xffffffffn) throw new Error("registry version must be a Uint32 greater than zero");
  return {
    engagementId: cloneBytes(args.engagementId), externalEngagementHash: cloneBytes(args.externalEngagementHash), firmId: cloneBytes(args.firmId), instanceNonce: cloneBytes(args.instanceNonce), registryVersion: args.registryVersion,
    registryCommitment: cloneBytes(args.registryCommitment), externalRegistryCommitment: cloneBytes(args.externalRegistryCommitment), checkNonce: cloneBytes(args.checkNonce),
    parties: fixedSlots(fingerprintEntities(args.entityIds, args.pureCircuits), ENGAGEMENT_CAPACITY, "engagement"),
  };
}

export function buildClearanceOpening(args: {
  registryOpening: RegistryOpening; engagement: EngagementSnapshot; engagementRandomness: Bytes32;
}): ClearanceOpening {
  assertBytes(args.engagementRandomness, BYTE32, "engagement randomness");
  return { registry: args.registryOpening.snapshot, registryRandomness: cloneBytes(args.registryOpening.randomness), engagement: args.engagement, engagementRandomness: cloneBytes(args.engagementRandomness) };
}

/** Computes the contract's authoritative typed commitments through generated pure circuits. */
export function commitOpenings(args: { registryOpening: RegistryOpening; engagement: EngagementSnapshot; engagementRandomness: Bytes32; pureCircuits: Pick<ConflictZeroPureCircuits, "commitRegistry" | "commitEngagement"> }): { registryCommitment: Bytes32; proposalCommitment: Bytes32 } {
  assertBytes(args.engagementRandomness, BYTE32, "engagement randomness");
  const registryCommitment = args.pureCircuits.commitRegistry(args.registryOpening.snapshot, args.registryOpening.randomness);
  const proposalCommitment = args.pureCircuits.commitEngagement(args.engagement, args.engagementRandomness);
  assertBytes(registryCommitment, BYTE32, "generated registry commitment"); assertBytes(proposalCommitment, BYTE32, "generated proposal commitment");
  return { registryCommitment: cloneBytes(registryCommitment), proposalCommitment: cloneBytes(proposalCommitment) };
}

export function createWitnessPrivateState(args: { adminSecret: Bytes32; registryOpening: RegistryOpening; clearanceOpening?: ClearanceOpening }): ConflictZeroPrivateState {
  assertBytes(args.adminSecret, BYTE32, "admin secret");
  return { adminSecret: cloneBytes(args.adminSecret), registryOpening: args.registryOpening, clearanceOpening: args.clearanceOpening };
}

function cloneReceipt(receipt: ClearanceReceipt): ClearanceReceipt { return { registryVersion: receipt.registryVersion, registryCommitment: cloneBytes(receipt.registryCommitment), engagementHash: cloneBytes(receipt.engagementHash), proposalCommitment: cloneBytes(receipt.proposalCommitment), checkNonce: cloneBytes(receipt.checkNonce) }; }
function assertSlots(slots: EntitySlot[], capacity: number, field: string): void {
  if (slots.length !== capacity || !slots[0]?.active) throw new Error(`${field} has non-canonical slots`);
  for (const slot of slots) { assertBytes(slot.fingerprint, BYTE32, `${field} fingerprint`); if (slot.active === bytesEqual(slot.fingerprint, ZERO32)) throw new Error(`${field} has non-canonical active slot`); }
}
function sameRegistry(snapshot: RegistrySnapshot, state: PublicRegistryState): boolean {
  return snapshot.version === state.registryVersion && bytesEqual(snapshot.firmId, state.firmId) && bytesEqual(snapshot.instanceNonce, state.instanceNonce) && bytesEqual(snapshot.externalRegistryCommitment, state.externalRegistryCommitment);
}

/**
 * Offline deterministic transaction model. It validates the same domain inputs
 * and failure semantics but does not generate a ZK proof or submit a network tx.
 */
export class DeterministicConflictZeroProvider implements ConflictZeroProvider {
  private readonly deployments = new Map<string, { state: PublicRegistryState; receipts: Map<string, ClearanceReceipt>; proposals: Set<string>; nonces: Set<string> }>();
  private readonly pureCircuits: Pick<ConflictZeroPureCircuits, "commitRegistry" | "commitEngagement">;
  private counter = 0;
  constructor(pureCircuits: Pick<ConflictZeroPureCircuits, "commitRegistry" | "commitEngagement">) { this.pureCircuits = pureCircuits; }
  async deploy(input: DeployInput): Promise<{ contractAddress: string; transactionId: string }> {
    if (!sameRegistry(input.privateState.registryOpening.snapshot, input.publicState)) throw new Error("initial registry does not bind public deployment state");
    const expectedCommitment = this.pureCircuits.commitRegistry(input.privateState.registryOpening.snapshot, input.privateState.registryOpening.randomness);
    if (!bytesEqual(expectedCommitment, input.publicState.registryCommitment)) throw new Error("initial registry opening does not match public Compact commitment");
    assertSlots(input.privateState.registryOpening.snapshot.slots, REGISTRY_CAPACITY, "registry");
    const address = `deterministic:cz:${++this.counter}`;
    this.deployments.set(address, { state: { ...input.publicState, firmId: cloneBytes(input.publicState.firmId), instanceNonce: cloneBytes(input.publicState.instanceNonce), registryCommitment: cloneBytes(input.publicState.registryCommitment), externalRegistryCommitment: cloneBytes(input.publicState.externalRegistryCommitment) }, receipts: new Map(), proposals: new Set(), nonces: new Set() });
    return { contractAddress: address, transactionId: `demo-deploy-${this.counter}` };
  }
  async join(input: JoinInput): Promise<void> { const deployment = this.mustGet(input.contractAddress); if (!sameRegistry(input.privateState.registryOpening.snapshot, deployment.state) || !sameRegistry(input.privateState.registryOpening.snapshot, input.publicState)) throw new Error("joined state does not match deployment"); const expected = this.pureCircuits.commitRegistry(input.privateState.registryOpening.snapshot, input.privateState.registryOpening.randomness); if (!bytesEqual(expected, deployment.state.registryCommitment)) throw new Error("joined opening does not match Compact commitment"); }
  async updateRegistry(input: UpdateRegistryInput): Promise<TransactionResult> {
    const deployment = this.mustGet(input.contractAddress); const next = input.nextRegistryOpening.snapshot;
    if (!sameRegistry(input.privateState.registryOpening.snapshot, deployment.state)) throw new Error("current private registry does not match deployment");
    const currentCommitment = this.pureCircuits.commitRegistry(input.privateState.registryOpening.snapshot, input.privateState.registryOpening.randomness);
    if (!bytesEqual(currentCommitment, deployment.state.registryCommitment)) throw new Error("current registry opening does not match Compact commitment");
    if (!bytesEqual(next.firmId, deployment.state.firmId) || !bytesEqual(next.instanceNonce, deployment.state.instanceNonce) || next.version !== deployment.state.registryVersion + 1n) throw new Error("next registry is not bound to this deployment/version");
    assertSlots(next.slots, REGISTRY_CAPACITY, "registry");
    if (!bytesEqual(input.nextPublicState.firmId, deployment.state.firmId) || !bytesEqual(input.nextPublicState.instanceNonce, deployment.state.instanceNonce) || input.nextPublicState.registryVersion !== next.version || !bytesEqual(input.nextPublicState.externalRegistryCommitment, next.externalRegistryCommitment)) throw new Error("next public registry state is not bound to private opening");
    const nextCommitment = this.pureCircuits.commitRegistry(next, input.nextRegistryOpening.randomness);
    if (!bytesEqual(nextCommitment, input.nextPublicState.registryCommitment)) throw new Error("next registry opening does not match public Compact commitment");
    deployment.state = { ...input.nextPublicState, firmId: cloneBytes(deployment.state.firmId), instanceNonce: cloneBytes(deployment.state.instanceNonce), registryCommitment: cloneBytes(input.nextPublicState.registryCommitment), externalRegistryCommitment: cloneBytes(next.externalRegistryCommitment) };
    return { transactionId: `demo-update-${++this.counter}` };
  }
  async proveClear(input: ProveClearInput): Promise<ProveClearResult> {
    const deployment = this.mustGet(input.contractAddress); const opening = input.privateState.clearanceOpening;
    if (!opening) throw new Error("clearance opening is required");
    if (input.expectedRegistryVersion !== deployment.state.registryVersion || !sameRegistry(opening.registry, deployment.state)) throw new Error("stale or cross-deployment registry opening");
    const registryCommitment = this.pureCircuits.commitRegistry(opening.registry, opening.registryRandomness);
    if (!bytesEqual(registryCommitment, deployment.state.registryCommitment)) throw new Error("registry opening does not match current Compact commitment");
    const engagement = opening.engagement; assertSlots(opening.registry.slots, REGISTRY_CAPACITY, "registry"); assertSlots(engagement.parties, ENGAGEMENT_CAPACITY, "engagement");
    if (!bytesEqual(engagement.firmId, deployment.state.firmId) || !bytesEqual(engagement.instanceNonce, deployment.state.instanceNonce) || engagement.registryVersion !== deployment.state.registryVersion || !bytesEqual(engagement.registryCommitment, deployment.state.registryCommitment) || !bytesEqual(engagement.externalRegistryCommitment, deployment.state.externalRegistryCommitment)) throw new Error("engagement is not bound to current firm/deployment/registry");
    if (!bytesEqual(engagement.engagementId, input.engagementId) || !bytesEqual(engagement.externalEngagementHash, input.engagementHash) || !bytesEqual(engagement.checkNonce, input.checkNonce)) throw new Error("public clearance inputs do not match private opening");
    assertBytes(input.proposalCommitment, BYTE32, "proposal commitment");
    const expectedProposal = this.pureCircuits.commitEngagement(engagement, opening.engagementRandomness);
    if (!bytesEqual(expectedProposal, input.proposalCommitment)) throw new Error("proposal opening does not match public Compact commitment");
    const engagementKey = bytesToHex(input.engagementId); const nonceKey = bytesToHex(input.checkNonce); const proposalKey = bytesToHex(input.proposalCommitment);
    if (deployment.receipts.has(engagementKey) || deployment.nonces.has(nonceKey) || deployment.proposals.has(proposalKey)) throw new Error("replayed clearance input");
    for (const registrySlot of opening.registry.slots) for (const party of engagement.parties) if (registrySlot.active && party.active && bytesEqual(registrySlot.fingerprint, party.fingerprint)) throw new Error("private conflict detected");
    const receipt = { registryVersion: deployment.state.registryVersion, registryCommitment: cloneBytes(deployment.state.registryCommitment), engagementHash: cloneBytes(input.engagementHash), proposalCommitment: cloneBytes(input.proposalCommitment), checkNonce: cloneBytes(input.checkNonce) };
    deployment.receipts.set(engagementKey, receipt); deployment.nonces.add(nonceKey); deployment.proposals.add(proposalKey);
    return { transactionId: `demo-clear-${++this.counter}`, receipt: cloneReceipt(receipt) };
  }
  async getReceipt(contractAddress: string, engagementId: Bytes32): Promise<ClearanceReceipt | null> { const receipt = this.mustGet(contractAddress).receipts.get(bytesToHex(engagementId)); return receipt ? cloneReceipt(receipt) : null; }
  private mustGet(address: string) { const deployment = this.deployments.get(address); if (!deployment) throw new Error("unknown deterministic contract address"); return deployment; }
}

/** Inject the actual wallet/node/indexer implementation after app configuration. */
export interface MidnightNetworkBindings extends ConflictZeroProvider { readonly mode: "midnight-network"; }
export function createMidnightNetworkProvider(bindings: MidnightNetworkBindings): ConflictZeroProvider {
  if (bindings.mode !== "midnight-network") throw new Error("Midnight network bindings must explicitly identify their mode");
  return bindings;
}
