/** Emits the canonical ConflictZero v1 golden vector. Do not use demo salts in production. */
import {
  createEngagement, createPrivateRegistry, evaluateExactConflict,
  organizationFromId, organizationFromName, prepareClearanceProofInput,
} from "../src/index.ts";

export async function generateClearanceV1Vector() {
  const salts = {
    registry: "vector-registry-salt-6f6b85d0",
    engagement: "vector-engagement-salt-2d52d8a1",
    statement: "vector-statement-salt-a4e187c3",
  };
  const registryOrganizations = [
    organizationFromName("Asterion Dynamics, Inc."),
    organizationFromId("CA-ON-88421", "Northstar Holdings Ltd."),
  ];
  const registry = await createPrivateRegistry({
    registryId: "registry-vector-001", organizations: registryOrganizations,
    salt: salts.registry, maxEntries: 4,
  });
  const cleanEngagement = await createEngagement({
    engagementId: "ENG-VECTOR-CLEAN-001", salt: salts.engagement,
    organizations: [organizationFromName("Horizon Aeronautics LLC")],
  });
  const conflictEngagement = await createEngagement({
    engagementId: "ENG-VECTOR-CONFLICT-001", salt: salts.engagement,
    organizations: [organizationFromId("CA-ON-88421", "Northstar Group")],
  });
  const checkNonce = "clearance-nonce-vector-0001";
  const cleanProofInput = await prepareClearanceProofInput({
    firmId: "firm-vector-001", registry, expectedRegistryVersion: registry.metadata.version,
    engagement: cleanEngagement, checkNonce, salt: salts.statement,
  });
  return {
    format: "conflictzero-clearance-v1-golden-vector",
    // Exposed strictly for cross-language test reproducibility; never put real salts in a receipt.
    salts,
    firmId: "firm-vector-001",
    registry: {
      registryId: registry.metadata.registryId,
      maxEntries: registry.metadata.maxEntries,
      normalizedOrganizationIds: registry.organizations.map(({ id }) => id),
      leaves: registry.leaves,
      metadata: registry.metadata,
    },
    engagements: {
      clean: {
        id: cleanEngagement.engagementId, organizationIds: cleanEngagement.organizationIds,
        canonicalPayload: cleanEngagement.canonicalPayload, hash: cleanEngagement.hash,
        expectedHasConflict: evaluateExactConflict(registry, cleanEngagement).hasConflict,
      },
      conflict: {
        id: conflictEngagement.engagementId, organizationIds: conflictEngagement.organizationIds,
        canonicalPayload: conflictEngagement.canonicalPayload, hash: conflictEngagement.hash,
        expectedHasConflict: evaluateExactConflict(registry, conflictEngagement).hasConflict,
      },
    },
    checkNonce,
    cleanPublicStatement: cleanProofInput,
  };
}
