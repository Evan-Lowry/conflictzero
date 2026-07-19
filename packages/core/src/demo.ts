import { createEngagement, createPrivateRegistry, organizationFromId, organizationFromName } from "./index.ts";

/** Demo-only mock data. No real client data belongs in source control. */
export const DEMO_REGISTRY = [
  organizationFromId("CA-ON-88421", "Northstar Holdings Ltd."),
  organizationFromName("Asterion Dynamics, Inc."),
  organizationFromName("Cedar & Finch LLP"),
  organizationFromName("Meridian Biologics GmbH"),
];

export async function createDemoScenario() {
  const registry = await createPrivateRegistry({ registryId: "demo-firm-registry", organizations: DEMO_REGISTRY, salt: "demo-registry-salt-not-for-production", maxEntries: 8 });
  const clearEngagement = await createEngagement({ engagementId: "ENG-2026-001", organizations: [organizationFromName("Horizon Aeronautics")], salt: "demo-engagement-salt" });
  const conflictEngagement = await createEngagement({ engagementId: "ENG-2026-002", organizations: [organizationFromId("CA-ON-88421", "Northstar Group")], salt: "demo-engagement-salt" });
  return { registry, clearEngagement, conflictEngagement };
}
