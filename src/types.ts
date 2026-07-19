export type CheckStatus = 'cleared' | 'review'
export type RegistryEntry = { id: string; name: string; role: string; added: string }
export type Engagement = { id: string; company: string; matter: string; parties: string[]; createdAt: string }
export type Receipt = {
  id: string
  status: CheckStatus
  engagementHash: string
  registryVersion: string
  registryCommitment: string
  statementHash?: string
  proposalCommitment?: string
  transactionId?: string
  contractAddress?: string
  providerMode?: 'offline-deterministic' | 'midnight-network'
  timestamp: string
}

/** Stable application boundary shared by offline demo and live Midnight modes. */
export interface ConflictZeroService {
  check(input: Engagement, registry: RegistryEntry[]): Promise<Receipt>
  verify(receiptId: string): Promise<Receipt | null>
}
