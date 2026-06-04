import type { PortfolioSymbol } from './portfolioData'

export type TransferStatus = 'Pending Approval' | 'Completed'

export type NetworkId = 'BTC' | 'ETH' | 'BSC' | 'SOL'

export type TransferRecord = {
  id: string
  kind: 'Deposit' | 'Withdraw'
  status: TransferStatus
  coin: PortfolioSymbol
  qty: string
  fee: string
  address: string
  txid: string
  createdAt: string
  completedAt: string
  time: string
  pendingUntil?: string
  networkId?: NetworkId
}

/* ── deterministic pseudo-random for seed data ── */

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ── random hex txId (64 chars) ── */

function randomHexTxId(rng: () => number): string {
  const chars = '0123456789abcdef'
  let out = ''
  for (let i = 0; i < 64; i++) out += chars[Math.floor(rng() * 16)]
  return out
}

/* ── address generation per network ── */

function generateAddress(_coin: PortfolioSymbol, network: NetworkId, rng: () => number): string {
  const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const HEX = '0123456789abcdef'
  if (network === 'BTC') {
    let out = 'bc1q'
    for (let i = 0; i < 38; i++) out += '023456789acdefghjklmnpqrstuvwxyz'[Math.floor(rng() * 32)]
    return out
  }
  if (network === 'ETH' || network === 'BSC') {
    let out = '0x'
    for (let i = 0; i < 40; i++) out += HEX[Math.floor(rng() * 16)]
    return out
  }
  // SOL
  let out = ''
  for (let i = 0; i < 44; i++) out += BASE58[Math.floor(rng() * BASE58.length)]
  return out
}

/* ── network per coin (not TRX) ── */

const COIN_NETWORKS: Record<PortfolioSymbol, NetworkId[]> = {
  BTC: ['BTC'],
  ETH: ['ETH', 'BSC'],
  USDT: ['ETH', 'BSC', 'SOL'],
  TRX: ['BSC', 'SOL'],
}

function pickNetwork(coin: PortfolioSymbol, rng: () => number): NetworkId {
  const nets = COIN_NETWORKS[coin]
  return nets[Math.floor(rng() * nets.length)]
}

/* ── amount: whole number > 10 USD ── */

function randomAmount(coin: PortfolioSymbol, rng: () => number): { qty: number; fee: number } {
  // Whole-number USD value between 11 and 5000
  const usdValue = Math.floor(rng() * 4990) + 11
  // Approximate prices to convert USD → coin qty
  const priceMap: Record<PortfolioSymbol, number> = { BTC: 70000, ETH: 3500, USDT: 1, TRX: 0.12 }
  const price = priceMap[coin] ?? 1
  const qty = usdValue / price
  const fee = qty * 0.001 // 0.1 % fee
  return { qty, fee }
}

/* ── formatting ── */

function fmtQty(value: number, coin: PortfolioSymbol): string {
  const digits = coin === 'USDT' ? 2 : 8
  return value.toFixed(digits)
}

function fmtFee(value: number, coin: PortfolioSymbol): string {
  const digits = coin === 'USDT' ? 2 : 6
  return value.toFixed(digits)
}

export function toUtc8Display(d: Date): string {
  const utc8 = new Date(d.getTime() + 8 * 60 * 60 * 1000)
  const y = utc8.getUTCFullYear()
  const m = String(utc8.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utc8.getUTCDate()).padStart(2, '0')
  const hh = String(utc8.getUTCHours()).padStart(2, '0')
  const mm = String(utc8.getUTCMinutes()).padStart(2, '0')
  const ss = String(utc8.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

/* ── build 20 seed transactions ── */

const COINS: PortfolioSymbol[] = ['BTC', 'ETH', 'USDT', 'TRX']

export function buildSeedHistory(now = new Date()): TransferRecord[] {
  const rng = mulberry32(29384756)

  // The latest seed transaction should be 2 days before login
  const latestTime = new Date(now)
  latestTime.setDate(latestTime.getDate() - 2)
  latestTime.setHours(23, 59, 0, 0)

  // Spread transactions over the past 30 days
  const earliestTime = new Date(latestTime)
  earliestTime.setDate(earliestTime.getDate() - 28)
  earliestTime.setHours(0, 0, 0, 0)

  const totalMs = latestTime.getTime() - earliestTime.getTime()

  const records: TransferRecord[] = []

  for (let i = 0; i < 20; i++) {
    const kind: 'Deposit' | 'Withdraw' = rng() > 0.5 ? 'Deposit' : 'Withdraw'
    const coin = COINS[Math.floor(rng() * COINS.length)]
    const network = pickNetwork(coin, rng)
    const { qty, fee } = randomAmount(coin, rng)
    const address = generateAddress(coin, network, rng)
    const txid = randomHexTxId(rng)

    // Random time within window
    const offset = Math.floor(rng() * totalMs)
    const created = new Date(earliestTime.getTime() + offset)
    // Add some minutes for completion
    const completed = new Date(created.getTime() + (3 + Math.floor(rng() * 25)) * 60 * 1000)

    records.push({
      id: `seed-${i}`,
      kind,
      status: 'Completed',
      coin,
      qty: fmtQty(qty, coin),
      fee: fmtFee(fee, coin),
      address,
      txid,
      createdAt: created.toISOString(),
      completedAt: completed.toISOString(),
      time: toUtc8Display(completed),
      networkId: network,
    })
  }

  // Sort by createdAt ascending so newest are last
  records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return records
}

export function createWithdrawRecord(params: {
  coin: PortfolioSymbol
  qty: number
  fee: number
  address: string
  networkId: string
  createdAt: Date
  pendingUntil: Date
}): TransferRecord {
  const seed = `${params.createdAt.getTime()}-${params.coin}-${params.qty}`
  const rng = mulberry32(seed.charCodeAt(0) + seed.charCodeAt(1) * 256)
  return {
    id: `wd-${params.createdAt.getTime()}`,
    kind: 'Withdraw',
    status: 'Pending Approval',
    coin: params.coin,
    qty: fmtQty(params.qty, params.coin),
    fee: fmtFee(params.fee, params.coin),
    address: params.address,
    txid: randomHexTxId(rng),
    createdAt: params.createdAt.toISOString(),
    completedAt: params.createdAt.toISOString(),
    time: toUtc8Display(params.createdAt),
    pendingUntil: params.pendingUntil.toISOString(),
    networkId: params.networkId as NetworkId,
  }
}

/** @deprecated Use getAllTransactions from portfolioStore */
export function generateTransferHistory(now = new Date()): TransferRecord[] {
  return buildSeedHistory(now)
}
