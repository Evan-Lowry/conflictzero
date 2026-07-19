import type { ConflictZeroService, Engagement, Receipt, RegistryEntry } from './types'
import {
  createClearanceReceipt,
  createEngagement,
  createPrivateRegistry,
  hashDomainSeparated,
  organizationFromName,
  prepareClearanceProofInput,
} from '../packages/core/src/index'
import {
  buildClearanceOpening,
  buildEngagementSnapshot,
  buildRegistryOpening,
  bytes32FromHex,
  bytesToHex,
  commitOpenings,
  createWitnessPrivateState,
  DeterministicConflictZeroProvider,
  randomBytes32,
  type ConflictZeroPrivateState,
  type PublicRegistryState,
  type RegistryOpening,
} from '../packages/midnight-adapter/src/index'
import { pureCircuits } from '../contract/src/managed/conflict-zero/contract/index.js'

const DEMO_FIRM_ID = 'hartwell-vale-demo'
const DEMO_REGISTRY_ID = 'hartwell-vale-private-registry'
const DEMO_REGISTRY_SALT = 'demo-only-registry-salt-never-use-in-production'
const DEMO_ENGAGEMENT_SALT = 'demo-only-engagement-salt-never-use-in-production'
const DEMO_RECEIPT_SALT = 'demo-only-receipt-salt-never-use-in-production'
const short = (value: string) => `0x${value.replace(/^0x/, '').slice(0, 12)}…${value.replace(/^0x/, '').slice(-6)}`

const provider = new DeterministicConflictZeroProvider(pureCircuits)

type DemoDeployment = {
  contractAddress: string
  publicState: PublicRegistryState
  registryOpening: RegistryOpening
  privateState: ConflictZeroPrivateState
}

const deployments = new Map<string, Promise<DemoDeployment>>()
const receiptReferences = new Map<string, { contractAddress: string; engagementId: Uint8Array; receipt: Receipt }>()

async function digest32(domain: string, payload: string): Promise<Uint8Array> {
  return bytes32FromHex(await hashDomainSeparated(domain, DEMO_RECEIPT_SALT, payload))
}

async function getDeployment(registry: Awaited<ReturnType<typeof createPrivateRegistry>>): Promise<DemoDeployment> {
  const key = registry.metadata.commitment
  const existing = deployments.get(key)
  if (existing) return existing

  const pending = (async () => {
    const firmId = await digest32('conflictzero/demo/firm-id', DEMO_FIRM_ID)
    const instanceNonce = await digest32('conflictzero/demo/instance', registry.metadata.commitment)
    const registryOpening = buildRegistryOpening({
      externalRegistryCommitment: bytes32FromHex(registry.metadata.commitment),
      firmId,
      instanceNonce,
      version: 1n,
      entityIds: registry.organizations.map(({ id }) => id),
      pureCircuits,
      randomness: randomBytes32(),
    })
    const registryCommitment = pureCircuits.commitRegistry(registryOpening.snapshot, registryOpening.randomness)
    const publicState: PublicRegistryState = {
      firmId,
      instanceNonce,
      registryVersion: 1n,
      registryCommitment,
      externalRegistryCommitment: bytes32FromHex(registry.metadata.commitment),
    }
    const privateState = createWitnessPrivateState({
      adminSecret: randomBytes32(),
      registryOpening,
    })
    const deployed = await provider.deploy({ publicState, privateState })
    return { contractAddress: deployed.contractAddress, publicState, registryOpening, privateState }
  })()

  deployments.set(key, pending)
  return pending
}

export const demoConflictService: ConflictZeroService = {
  async check(input: Engagement, registry: RegistryEntry[]): Promise<Receipt> {
    await new Promise(resolve => setTimeout(resolve, 650))
    const privateRegistry = await createPrivateRegistry({
      registryId: DEMO_REGISTRY_ID,
      organizations: registry.map(entry => organizationFromName(entry.name)),
      salt: DEMO_REGISTRY_SALT,
      maxEntries: 8,
    })
    const engagement = await createEngagement({
      engagementId: input.id,
      organizations: [input.company, ...input.parties].map(organizationFromName),
      salt: DEMO_ENGAGEMENT_SALT,
    })
    const deployment = await getDeployment(privateRegistry)
    const engagementId = await digest32('conflictzero/demo/engagement-id', engagement.engagementId)
    const checkNonce = randomBytes32()
    const engagementRandomness = randomBytes32()
    const engagementSnapshot = buildEngagementSnapshot({
      engagementId,
      externalEngagementHash: bytes32FromHex(engagement.hash),
      firmId: deployment.publicState.firmId,
      instanceNonce: deployment.publicState.instanceNonce,
      registryVersion: deployment.publicState.registryVersion,
      registryCommitment: deployment.publicState.registryCommitment,
      externalRegistryCommitment: deployment.publicState.externalRegistryCommitment,
      checkNonce,
      entityIds: engagement.organizationIds,
      pureCircuits,
    })
    const { proposalCommitment } = commitOpenings({
      registryOpening: deployment.registryOpening,
      engagement: engagementSnapshot,
      engagementRandomness,
      pureCircuits,
    })
    const privateState = createWitnessPrivateState({
      adminSecret: deployment.privateState.adminSecret,
      registryOpening: deployment.registryOpening,
      clearanceOpening: buildClearanceOpening({
        registryOpening: deployment.registryOpening,
        engagement: engagementSnapshot,
        engagementRandomness,
      }),
    })

    let clearance
    try {
      clearance = await provider.proveClear({
        contractAddress: deployment.contractAddress,
        publicState: deployment.publicState,
        privateState,
        engagementId,
        engagementHash: bytes32FromHex(engagement.hash),
        proposalCommitment,
        checkNonce,
        expectedRegistryVersion: deployment.publicState.registryVersion,
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('private conflict detected')) {
        // The deterministic provider models Compact's failed proof path. No
        // receipt is written and no matching relationship enters public state.
        return {
          id: 'PRIVATE-REVIEW',
          status: 'review',
          engagementHash: short(engagement.hash),
          registryVersion: deployment.publicState.registryVersion.toString(),
          registryCommitment: short(bytesToHex(deployment.publicState.registryCommitment)),
          timestamp: new Date().toISOString(),
          providerMode: 'offline-deterministic',
        }
      }
      throw error
    }

    const proofInput = await prepareClearanceProofInput({
      firmId: DEMO_FIRM_ID,
      registry: privateRegistry,
      expectedRegistryVersion: privateRegistry.metadata.version,
      engagement,
      checkNonce: bytesToHex(checkNonce),
      salt: DEMO_RECEIPT_SALT,
    })
    const publicReceipt = await createClearanceReceipt(proofInput, DEMO_RECEIPT_SALT)
    const receipt: Receipt = {
      id: `CZ-${publicReceipt.receiptHash.slice(0, 8).toUpperCase()}`,
      status: 'cleared',
      engagementHash: short(bytesToHex(clearance.receipt.engagementHash)),
      registryVersion: clearance.receipt.registryVersion.toString(),
      registryCommitment: short(bytesToHex(clearance.receipt.registryCommitment)),
      proposalCommitment: short(bytesToHex(clearance.receipt.proposalCommitment)),
      statementHash: short(proofInput.publicStatementHash),
      timestamp: new Date().toISOString(),
      transactionId: clearance.transactionId,
      contractAddress: deployment.contractAddress,
      providerMode: 'offline-deterministic',
    }
    receiptReferences.set(receipt.id, { contractAddress: deployment.contractAddress, engagementId, receipt })
    sessionStorage.setItem(`cz:${receipt.id}`, JSON.stringify(receipt))
    return receipt
  },
  async verify(receiptId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const normalized = receiptId.trim().toUpperCase()
    const reference = receiptReferences.get(normalized)
    if (reference) {
      const providerReceipt = await provider.getReceipt(reference.contractAddress, reference.engagementId)
      return providerReceipt ? reference.receipt : null
    }
    const raw = sessionStorage.getItem(`cz:${normalized}`)
    return raw ? JSON.parse(raw) as Receipt : null
  },
}
