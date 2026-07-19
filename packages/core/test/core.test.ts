import assert from "node:assert/strict";
import test from "node:test";
import {
  createClearanceReceipt, createEngagement, createPrivateRegistry, evaluateExactConflict,
  hashDomainSeparated, organizationFromId, organizationFromName, prepareClearanceProofInput,
} from "../src/index.ts";

const salt = "test-salt-0123456789";

test("normalization collapses legal suffix and punctuation variants", () => {
  assert.equal(organizationFromName("Acme, Inc.").id, organizationFromName("ACME INCORPORATED").id);
  assert.equal(organizationFromName("Café & Co.").id, "name:cafe-and");
});

test("registry rejects exact normalized duplicates", async () => {
  await assert.rejects(() => createPrivateRegistry({ registryId: "r", salt, maxEntries: 4, organizations: [organizationFromName("Acme Inc."), organizationFromName("ACME")]}), /duplicate/);
});

test("fixed capacity padding yields fixed leaf count and order-independent commitments", async () => {
  const a = organizationFromName("Acme Inc."); const b = organizationFromName("Bravo LLC");
  const one = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 4, organizations: [a, b] });
  const two = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 4, organizations: [b, a] });
  assert.equal(one.leaves.length, 4); assert.equal(one.metadata.commitment, two.metadata.commitment);
});

test("authoritative IDs detect a conflict despite different display names", async () => {
  const registry = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 4, organizations: [organizationFromId("ON-12", "Northstar Holdings")] });
  const engagement = await createEngagement({ engagementId: "e", salt, organizations: [organizationFromId("ON-12", "Northstar Group")] });
  assert.deepEqual(evaluateExactConflict(registry, engagement), { hasConflict: true, matchingOrganizationIds: ["id:on-12"] });
});

test("stale registry versions are rejected before proof preparation", async () => {
  const registry = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 2, organizations: [organizationFromName("Acme")] });
  const engagement = await createEngagement({ engagementId: "e", salt, organizations: [organizationFromName("Bravo")] });
  await assert.rejects(() => prepareClearanceProofInput({ firmId: "f", registry, expectedRegistryVersion: "v1-stale", engagement, checkNonce: "n", salt }), /stale/);
});

test("tampering with an engagement changes its hash and public proof statement", async () => {
  const registry = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 2, organizations: [organizationFromName("Acme")] });
  const a = await createEngagement({ engagementId: "e", salt, organizations: [organizationFromName("Bravo")] });
  const b = await createEngagement({ engagementId: "e", salt, organizations: [organizationFromName("Charlie")] });
  const ia = await prepareClearanceProofInput({ firmId: "f", registry, expectedRegistryVersion: registry.metadata.version, engagement: a, checkNonce: "n", salt });
  const ib = await prepareClearanceProofInput({ firmId: "f", registry, expectedRegistryVersion: registry.metadata.version, engagement: b, checkNonce: "n", salt });
  assert.notEqual(a.hash, b.hash); assert.notEqual(ia.publicStatementHash, ib.publicStatementHash);
});

test("unique nonce prevents receipt replay and domains never collide", async () => {
  const registry = await createPrivateRegistry({ registryId: "r", salt, maxEntries: 2, organizations: [organizationFromName("Acme")] });
  const engagement = await createEngagement({ engagementId: "e", salt, organizations: [organizationFromName("Bravo")] });
  const i1 = await prepareClearanceProofInput({ firmId: "f", registry, expectedRegistryVersion: registry.metadata.version, engagement, checkNonce: "nonce-1", salt });
  const i2 = await prepareClearanceProofInput({ firmId: "f", registry, expectedRegistryVersion: registry.metadata.version, engagement, checkNonce: "nonce-2", salt });
  assert.notEqual((await createClearanceReceipt(i1, salt)).receiptHash, (await createClearanceReceipt(i2, salt)).receiptHash);
  assert.notEqual(await hashDomainSeparated("a", salt, "payload"), await hashDomainSeparated("b", salt, "payload"));
});
