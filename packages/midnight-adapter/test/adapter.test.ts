import assert from "node:assert/strict";
import test from "node:test";
import {
  buildClearanceOpening, buildEngagementSnapshot, buildRegistryOpening, bytes32FromHex, commitOpenings,
  createWitnessPrivateState, DeterministicConflictZeroProvider, encodeEntityIdentifier, REGISTRY_CAPACITY,
  type ConflictZeroPureCircuits, type Bytes32,
} from "../src/index.ts";

const b = (seed: number): Bytes32 => new Uint8Array(32).fill(seed);
const mix = (...parts: Uint8Array[]): Bytes32 => { const out = new Uint8Array(32); parts.forEach((part, p) => part.forEach((v, i) => { out[i] = (out[i] + v + p + i) & 255; })); return out; };
const pure: ConflictZeroPureCircuits = {
  entityFingerprint: (id) => mix(id),
  commitRegistry: (snapshot, randomness) => mix(snapshot.firmId, snapshot.instanceNonce, randomness, new Uint8Array([Number(snapshot.version)])),
  commitEngagement: (snapshot, randomness) => mix(snapshot.engagementId, snapshot.registryCommitment, snapshot.checkNonce, randomness),
};
const build = (entities = ["id:acme"]) => {
  const firmId = b(1), instanceNonce = b(2), external = b(3), registryRandomness = b(4), adminSecret = b(5);
  const registryOpening = buildRegistryOpening({ firmId, instanceNonce, externalRegistryCommitment: external, version: 1n, entityIds: entities, randomness: registryRandomness, pureCircuits: pure });
  const registryCommitment = pure.commitRegistry(registryOpening.snapshot, registryRandomness);
  return { firmId, instanceNonce, external, registryOpening, registryCommitment, adminSecret };
};
const deploy = async (provider = new DeterministicConflictZeroProvider(pure)) => {
  const x = build(); const state = { firmId: x.firmId, instanceNonce: x.instanceNonce, registryVersion: 1n, registryCommitment: x.registryCommitment, externalRegistryCommitment: x.external };
  const privateState = createWitnessPrivateState({ adminSecret: x.adminSecret, registryOpening: x.registryOpening });
  const result = await provider.deploy({ publicState: state, privateState }); return { provider, ...x, state, privateState, address: result.contractAddress };
};
const clearance = (x: Awaited<ReturnType<typeof deploy>>, entities = ["id:bravo"], overrides: Partial<{ firmId: Bytes32; instanceNonce: Bytes32; registryCommitment: Bytes32 }> = {}) => {
  const engagementId = b(10), hash = b(11), nonce = b(12), randomness = b(13);
  const engagement = buildEngagementSnapshot({ engagementId, externalEngagementHash: hash, firmId: overrides.firmId ?? x.firmId, instanceNonce: overrides.instanceNonce ?? x.instanceNonce, registryVersion: 1n, registryCommitment: overrides.registryCommitment ?? x.registryCommitment, externalRegistryCommitment: x.external, checkNonce: nonce, entityIds: entities, pureCircuits: pure });
  const opening = buildClearanceOpening({ registryOpening: x.registryOpening, engagement, engagementRandomness: randomness });
  return { engagementId, hash, nonce, proposalCommitment: pure.commitEngagement(engagement, randomness), privateState: createWitnessPrivateState({ adminSecret: x.adminSecret, registryOpening: x.registryOpening, clearanceOpening: opening }) };
};

test("UTF-8 entity IDs are padded to exactly 64 bytes and reject NUL/overflow", () => {
  const encoded = encodeEntityIdentifier("é"); assert.equal(encoded.length, 64); assert.deepEqual([...encoded.slice(0, 2)], [0xc3, 0xa9]); assert.equal(encoded[2], 0);
  assert.throws(() => encodeEntityIdentifier("a\0b"), /NUL/); assert.throws(() => encodeEntityIdentifier("é".repeat(33)), /exceeds/);
});
test("snapshot builders call pure entity fingerprints and canonicalize inactive slots", () => {
  const x = build(["id:acme", "id:bravo"]); assert.equal(x.registryOpening.snapshot.slots.length, REGISTRY_CAPACITY); assert.equal(x.registryOpening.snapshot.slots[0].active, true); assert.deepEqual(x.registryOpening.snapshot.slots.at(-1), { active: false, fingerprint: new Uint8Array(32) });
  assert.throws(() => buildRegistryOpening({ firmId: x.firmId, instanceNonce: x.instanceNonce, externalRegistryCommitment: x.external, version: 1n, entityIds: Array.from({ length: 9 }, (_, i) => `id:${i}`), randomness: b(1), pureCircuits: pure }), /capacity/);
});
test("cross-firm and cross-deployment proof inputs are rejected", async () => {
  const x = await deploy(); const wrongFirm = clearance(x, ["id:bravo"], { firmId: b(90) });
  await assert.rejects(() => x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: wrongFirm.privateState, engagementId: wrongFirm.engagementId, engagementHash: wrongFirm.hash, proposalCommitment: wrongFirm.proposalCommitment, checkNonce: wrongFirm.nonce, expectedRegistryVersion: 1n }), /bound/);
  const wrongInstance = clearance(x, ["id:bravo"], { instanceNonce: b(91) });
  await assert.rejects(() => x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: wrongInstance.privateState, engagementId: wrongInstance.engagementId, engagementHash: wrongInstance.hash, proposalCommitment: wrongInstance.proposalCommitment, checkNonce: wrongInstance.nonce, expectedRegistryVersion: 1n }), /bound/);
});
test("deterministic provider rejects private conflicts and writes no receipt", async () => {
  const x = await deploy(); const bad = clearance(x, ["id:acme"]);
  await assert.rejects(() => x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: bad.privateState, engagementId: bad.engagementId, engagementHash: bad.hash, proposalCommitment: bad.proposalCommitment, checkNonce: bad.nonce, expectedRegistryVersion: 1n }), /conflict/);
  assert.equal(await x.provider.getReceipt(x.address, bad.engagementId), null);
});
test("receipt exists only after success and cannot be replayed", async () => {
  const x = await deploy(); const good = clearance(x);
  const result = await x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: good.privateState, engagementId: good.engagementId, engagementHash: good.hash, proposalCommitment: good.proposalCommitment, checkNonce: good.nonce, expectedRegistryVersion: 1n });
  assert.deepEqual(await x.provider.getReceipt(x.address, good.engagementId), result.receipt);
  await assert.rejects(() => x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: good.privateState, engagementId: good.engagementId, engagementHash: good.hash, proposalCommitment: good.proposalCommitment, checkNonce: good.nonce, expectedRegistryVersion: 1n }), /replayed/);
});
test("tampered public proposal commitments are rejected", async () => {
  const x = await deploy(); const good = clearance(x); const tampered = new Uint8Array(good.proposalCommitment); tampered[0] ^= 1;
  await assert.rejects(() => x.provider.proveClear({ contractAddress: x.address, publicState: x.state, privateState: good.privateState, engagementId: good.engagementId, engagementHash: good.hash, proposalCommitment: tampered, checkNonce: good.nonce, expectedRegistryVersion: 1n }), /proposal opening/);
  assert.equal(await x.provider.getReceipt(x.address, good.engagementId), null);
});
test("hex bridge only permits exact 32-byte inputs", () => { assert.equal(bytes32FromHex("00".repeat(32)).length, 32); assert.throws(() => bytes32FromHex("ab"), /64/); });
test("commitment bridge invokes both generated pure circuit commitments", () => { const x = build(); const e = buildEngagementSnapshot({ engagementId: b(10), externalEngagementHash: b(11), firmId: x.firmId, instanceNonce: x.instanceNonce, registryVersion: 1n, registryCommitment: x.registryCommitment, externalRegistryCommitment: x.external, checkNonce: b(12), entityIds: ["id:bravo"], pureCircuits: pure }); const result = commitOpenings({ registryOpening: x.registryOpening, engagement: e, engagementRandomness: b(13), pureCircuits: pure }); assert.equal(result.registryCommitment.length, 32); assert.equal(result.proposalCommitment.length, 32); });
