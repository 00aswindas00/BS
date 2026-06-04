import type { PortfolioSymbol } from './portfolioData'

export const DEPOSIT_ADDRESS = 'TJ5usJLLwjwn7Pw3TPbdzreG7dvgKzfQ5y'

export type NetworkOption = {
  id: string
  label: string
  contractSuffix: string
  selectable: boolean
  caseSensitive?: boolean
}

export const TRANSFER_NETWORKS: NetworkOption[] = [
  { id: 'TRX', label: 'TRX Tron (TRC20)', contractSuffix: 'jLj6t', selectable: true },
  { id: 'ETH', label: 'ETH Ethereum (ERC20)', contractSuffix: 'a7b3c2', selectable: false },
  { id: 'BSC', label: 'BSC BNB Smart Chain (BEP20)', contractSuffix: '8899ff', selectable: false },
  { id: 'SOL', label: 'SOL Solana', contractSuffix: 'npump', selectable: false, caseSensitive: true },
  { id: 'BTC', label: 'BTC Bitcoin', contractSuffix: 'x4k9m2', selectable: false },
]

export const WITHDRAW_FEE_RATE = 0.05
export const PENDING_APPROVAL_MS = 5 * 60 * 1000

export const MIN_WITHDRAW: Partial<Record<PortfolioSymbol, number>> = {
  USDT: 1,
  BTC: 0.0001,
  ETH: 0.001,
  TRX: 10,
}

export function isValidTronAddress(address: string) {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim())
}
