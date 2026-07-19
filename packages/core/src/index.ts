/**
 * ConflictZero's deterministic, local-only privacy domain engine.
 *
 * This module intentionally implements exact identifier matching only. It is
 * safe to use in a browser: raw registry values never need to leave the caller.
 */

export const PROTOCOL_VERSION = "conflictzero/v1" as const;
export const ENTITY_DOMAIN = `${PROTOCOL_VERSION}/entity` as const;
export const REGISTRY_LEAF_DOMAIN = `${PROTOCOL_VERSION}/registry-leaf` as const;
export const REGISTRY_PAD_DOMAIN = `${PROTOCOL_VERSION}/registry-padding` as const;
export const REGISTRY_COMMITMENT_DOMAIN = `${PROTOCOL_VERSION}/registry-commitment` as const;
export const ENGAGEMENT_DOMAIN = `${PROTOCOL_VERSION}/engagement` as const;
export const RECEIPT_DOMAIN = `${PROTOCOL_VERSION}/clearance-receipt` as const;

const encoder = new TextEncoder();
const LEGAL_SUFFIXES = new Set([
  "inc", "incorporated", "corp", "corporation", "co", "company", "ltd",
  "limited", "llc", "llp", "plc", "lp", "gmbh", "sa", "ag", "bv",
]);

export type Hex = string;

export interface Organization {
  /** A stable exact-match identifier, never inferred from a display name. */
  id: string;
  /** Original user-visible value; never include this in public receipts. */
  displayName: string;
  canonicalName: string;
}

export interface RegistryMetadata {
  protocol: typeof PROTOCOL_VERSION;
  registryId: string;
  version: string;
  commitment: Hex;
  maxEntries: number;
  entityCount: number;
}

export interface PrivateRegistry {
  metadata: RegistryMetadata;
  /** Hashed leaves only; callers retain original organizations locally. */
  leaves: readonly Hex[];
  organizations: readonly Organization[];
}

export interface Engagement {
  engagementId: string;
  organizationIds: readonly string[];
  organizationNames: readonly string[];
  canonicalPayload: string;
  hash: Hex;
}

export interface ConflictEvaluation {
  hasConflict: boolean;
  matchingOrganizationIds: readonly string[];
}

export interface ClearanceProofInput {
  protocol: typeof PROTOCOL_VERSION;
  firmId: string;
  registryId: string;
  registryVersion: string;
  registryCommitment: Hex;
  engagementId: string;
  engagementHash: Hex;
  /** Bound nonce prevents a proof from being presented as a fresh check. */
  checkNonce: string;
  publicStatementHash: Hex;
}

export interface ClearanceReceipt {
  protocol: typeof PROTOCOL_VERSION;
  firmId: string;
  registryId: string;
  registryVersion: string;
  registryCommitment: Hex;
  engagementId: string;
  engagementHash: Hex;
  checkNonce: string;
  receiptHash: Hex;
}

function assertNonEmpty(value: string, name: string): void {
  if (!value.trim()) throw new Error(`${name} must not be empty`);
}

function cleanWords(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Human-name normalization for display and explicit identifier creation. */
export function canonicalizeEntityName(name: string): string {
  assertNonEmpty(name, "organization name");
  const words = cleanWords(name);
  while (words.length > 1 && LEGAL_SUFFIXES.has(words[words.length - 1])) words.pop();
  const canonical = words.join("-");
  if (!canonical) throw new Error("organization name has no usable characters");
  return canonical;
}

/**
 * Creates an explicit identifier. Callers can instead supply authoritative IDs
 * (e.g. a jurisdictional registration ID) using `organizationFromId`.
 */
export function organizationFromName(displayName: string): Organization {
  const canonicalName = canonicalizeEntityName(displayName);
  return { id: `name:${canonicalName}`, displayName, canonicalName };
}

export function organizationFromId(id: string, displayName = id): Organization {
  assertNonEmpty(id, "organization id");
  return { id: `id:${id.trim().toLowerCase()}`, displayName, canonicalName: canonicalizeEntityName(displayName) };
}

function toHex(bytes: ArrayBuffer): Hex {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Domain-separated SHA-256. `salt` must be high entropy and remain private. */
export async function hashDomainSeparated(domain: string, salt: string, payload: string): Promise<Hex> {
  assertNonEmpty(domain, "hash domain");
  assertNonEmpty(salt, "salt");
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto SubtleCrypto is unavailable");
  // Length prefixes prevent delimiter ambiguity in concatenated values.
  const material = `${domain.length}:${domain}${salt.length}:${salt}${payload.length}:${payload}`;
  return toHex(await subtle.digest("SHA-256", encoder.encode(material)));
}

function sortedUnique(values: readonly string[], field: string): string[] {
  const result = [...new Set(values.map((value) => value.trim().toLowerCase()))].sort();
  if (result.some((value) => !value)) throw new Error(`${field} must not contain an empty value`);
  return result;
}

async function registryLeaves(organizationIds: readonly string[], salt: string, maxEntries: number): Promise<Hex[]> {
  if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new Error("maxEntries must be a positive integer");
  if (organizationIds.length > maxEntries) throw new Error("registry exceeds fixed capacity");
  const real = await Promise.all(organizationIds.map((id) => hashDomainSeparated(REGISTRY_LEAF_DOMAIN, salt, id)));
  const padding = await Promise.all(Array.from({ length: maxEntries - real.length }, (_, index) =>
    hashDomainSeparated(REGISTRY_PAD_DOMAIN, salt, String(index)),
  ));
  return [...real.sort(), ...padding];
}

/** Builds a fixed-length registry commitment. No raw client name is in its output. */
export async function createPrivateRegistry(args: {
  registryId: string;
  organizations: readonly Organization[];
  salt: string;
  maxEntries: number;
}): Promise<PrivateRegistry> {
  assertNonEmpty(args.registryId, "registryId");
  const ids = sortedUnique(args.organizations.map((organization) => organization.id), "organization ids");
  if (ids.length !== args.organizations.length) throw new Error("registry contains duplicate organization identifiers");
  const leaves = await registryLeaves(ids, args.salt, args.maxEntries);
  const commitment = await hashDomainSeparated(REGISTRY_COMMITMENT_DOMAIN, args.salt, JSON.stringify({ registryId: args.registryId, maxEntries: args.maxEntries, leaves }));
  const version = `v1-${commitment.slice(0, 16)}`;
  return {
    metadata: { protocol: PROTOCOL_VERSION, registryId: args.registryId, version, commitment, maxEntries: args.maxEntries, entityCount: ids.length },
    leaves,
    organizations: [...args.organizations].sort((a, b) => a.id.localeCompare(b.id)),
  };
}

/** A stable, sorted engagement representation which binds its identifier and involved parties. */
export async function createEngagement(args: { engagementId: string; organizations: readonly Organization[]; salt: string }): Promise<Engagement> {
  assertNonEmpty(args.engagementId, "engagementId");
  const organizationIds = sortedUnique(args.organizations.map((organization) => organization.id), "engagement organization ids");
  const organizationNames = [...args.organizations].sort((a, b) => a.id.localeCompare(b.id)).map(({ canonicalName }) => canonicalName);
  const canonicalPayload = JSON.stringify({ engagementId: args.engagementId, organizationIds });
  return { engagementId: args.engagementId, organizationIds, organizationNames, canonicalPayload, hash: await hashDomainSeparated(ENGAGEMENT_DOMAIN, args.salt, canonicalPayload) };
}

/** Exact explicit-ID comparison. This deliberately does not resolve aliases or corporate families. */
export function evaluateExactConflict(registry: PrivateRegistry, engagement: Engagement): ConflictEvaluation {
  const registryIds = new Set(registry.organizations.map(({ id }) => id));
  const matchingOrganizationIds = engagement.organizationIds.filter((id) => registryIds.has(id));
  return { hasConflict: matchingOrganizationIds.length > 0, matchingOrganizationIds };
}

/** Constructs public inputs for a no-conflict circuit; reject stale registry references client-side. */
export async function prepareClearanceProofInput(args: {
  firmId: string;
  registry: PrivateRegistry;
  expectedRegistryVersion: string;
  engagement: Engagement;
  checkNonce: string;
  salt: string;
}): Promise<ClearanceProofInput> {
  assertNonEmpty(args.firmId, "firmId");
  assertNonEmpty(args.checkNonce, "checkNonce");
  if (args.registry.metadata.version !== args.expectedRegistryVersion) throw new Error("stale registry version: refresh before proving");
  const { metadata } = args.registry;
  const statement = JSON.stringify({ firmId: args.firmId, registryId: metadata.registryId, registryVersion: metadata.version, registryCommitment: metadata.commitment, engagementId: args.engagement.engagementId, engagementHash: args.engagement.hash, checkNonce: args.checkNonce });
  return { protocol: PROTOCOL_VERSION, firmId: args.firmId, registryId: metadata.registryId, registryVersion: metadata.version, registryCommitment: metadata.commitment, engagementId: args.engagement.engagementId, engagementHash: args.engagement.hash, checkNonce: args.checkNonce, publicStatementHash: await hashDomainSeparated(RECEIPT_DOMAIN, args.salt, statement) };
}

/** Public-safe receipt fields: raw parties and private registry leaves are intentionally absent. */
export async function createClearanceReceipt(input: ClearanceProofInput, salt: string): Promise<ClearanceReceipt> {
  const receiptPayload = JSON.stringify(input);
  return { protocol: PROTOCOL_VERSION, firmId: input.firmId, registryId: input.registryId, registryVersion: input.registryVersion, registryCommitment: input.registryCommitment, engagementId: input.engagementId, engagementHash: input.engagementHash, checkNonce: input.checkNonce, receiptHash: await hashDomainSeparated(RECEIPT_DOMAIN, salt, receiptPayload) };
}
