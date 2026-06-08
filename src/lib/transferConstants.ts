import type { PortfolioSymbol } from './portfolioData'

// ─── Network definitions ───────────────────────────────────────────────────

export type NetworkOption = {
  id: string
  label: string
  /** Shown as the deposit address (or withdrawal contract suffix hint) */
  depositAddress: string
  /** Address format hint shown to user */
  addressHint: string
  /** Regex to validate a withdrawal address for this network */
  addressRegex: RegExp
  /** Short label for the address format error message */
  addressFormatNote: string
}

/**
 * Coins → networks they run on.
 * Each entry is the complete, selectable network list for that coin.
 */
export const COIN_NETWORKS: Record<PortfolioSymbol, NetworkOption[]> = {
  USDT: [
    {
      id: 'TRX',
      label: 'TRX Tron (TRC20)',
      depositAddress: 'TJ5usJLLwjwn7Pw3TPbdzreG7dvgKzfQ5y',
      addressHint: 'Enter TRON address (starts with T, 34 chars)',
      addressRegex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
      addressFormatNote: 'Valid TRON address starts with T and is 34 characters.',
    },
    {
      id: 'ETH',
      label: 'ETH Ethereum (ERC20)',
      depositAddress: '0x4bBeEB066eD09B7AeD07bF39EEe0460DFa261520',
      addressHint: 'Enter Ethereum address (0x, 42 chars)',
      addressRegex: /^0x[0-9a-fA-F]{40}$/,
      addressFormatNote: 'Valid Ethereum address starts with 0x and is 42 characters.',
    },
    {
      id: 'BSC',
      label: 'BSC BNB Smart Chain (BEP20)',
      depositAddress: '0x4bBeEB066eD09B7AeD07bF39EEe0460DFa261520',
      addressHint: 'Enter BNB Smart Chain address (0x, 42 chars)',
      addressRegex: /^0x[0-9a-fA-F]{40}$/,
      addressFormatNote: 'Valid BSC address starts with 0x and is 42 characters.',
    },
    {
      id: 'SOL',
      label: 'SOL Solana',
      depositAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      addressHint: 'Enter Solana address (base58, 32–44 chars)',
      addressRegex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      addressFormatNote: 'Valid Solana address is base58, 32–44 characters.',
    },
  ],
  ETH: [
    {
      id: 'ETH',
      label: 'ETH Ethereum (ERC20)',
      depositAddress: '0x4bBeEB066eD09B7AeD07bF39EEe0460DFa261520',
      addressHint: 'Enter Ethereum address (0x, 42 chars)',
      addressRegex: /^0x[0-9a-fA-F]{40}$/,
      addressFormatNote: 'Valid Ethereum address starts with 0x and is 42 characters.',
    },
    {
      id: 'BSC',
      label: 'BSC BNB Smart Chain (BEP20)',
      depositAddress: '0x4bBeEB066eD09B7AeD07bF39EEe0460DFa261520',
      addressHint: 'Enter BNB Smart Chain address (0x, 42 chars)',
      addressRegex: /^0x[0-9a-fA-F]{40}$/,
      addressFormatNote: 'Valid BSC address starts with 0x and is 42 characters.',
    },
  ],
  BTC: [
    {
      id: 'BTC',
      label: 'BTC Bitcoin',
      depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      addressHint: 'Enter Bitcoin address (Legacy, SegWit, or Native SegWit)',
      // Covers Legacy (1...), P2SH (3...) and Native SegWit (bc1...)
      addressRegex: /^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{6,87})$/,
      addressFormatNote: 'Valid Bitcoin address: starts with 1, 3, or bc1.',
    },
  ],
  TRX: [
    {
      id: 'TRX',
      label: 'TRX Tron (TRC20)',
      depositAddress: 'TJ5usJLLwjwn7Pw3TPbdzreG7dvgKzfQ5y',
      addressHint: 'Enter TRON address (starts with T, 34 chars)',
      addressRegex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
      addressFormatNote: 'Valid TRON address starts with T and is 34 characters.',
    },
  ],
}

/** Convenience: get networks for a coin, defaulting to empty */
export function getNetworksForCoin(coin: PortfolioSymbol): NetworkOption[] {
  return COIN_NETWORKS[coin] ?? []
}

/** Validate a withdrawal address against the correct network regex */
export function isValidAddress(address: string, networkId: string, coin: PortfolioSymbol): boolean {
  const networks = getNetworksForCoin(coin)
  const network = networks.find((n) => n.id === networkId)
  if (!network) return false
  return network.addressRegex.test(address.trim())
}

// ─── Fee / limits ──────────────────────────────────────────────────────────

export const WITHDRAW_FEE_RATE = 0.05

export const MIN_WITHDRAW: Partial<Record<PortfolioSymbol, number>> = {
  USDT: 1,
  BTC: 0.0001,
  ETH: 0.001,
  TRX: 10,
}

// ─── Legacy export kept for any remaining imports ──────────────────────────
/** @deprecated Use COIN_NETWORKS instead */
export function isValidTronAddress(address: string) {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim())
}
