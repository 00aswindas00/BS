import { PORTFOLIO_ASSETS, type PortfolioSymbol } from './portfolioData'
import {
  buildSeedHistory,
  createWithdrawRecord,
  type TransferRecord,
} from './transactionHistory'
import {
  fetchDbTransactions,
  fetchTransactionCount,
  pushWithdrawalToDb,
  getCurrentUserId,
  fetchDbBalances,
  pushBalancesToDb,
} from './dbApi'

const TX_KEY = 'bclone_transactions'
const SESSION_TX_CACHE_KEY = 'bclone_session_transactions'
const SESSION_BAL_CACHE_KEY = 'bclone_session_balances'

// In-memory store — populated from DB on login / session restore
let dbTransactionsCache: TransferRecord[] = []
let dbBalancesCache: Record<PortfolioSymbol, number> | null = null
let currentUserId: string | null = null

// Track whether the initial load has happened this session
let initialLoadDone = false

type BalanceMap = Record<PortfolioSymbol, number>

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function subscribePortfolio(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function defaultBalances(): BalanceMap {
  return PORTFOLIO_ASSETS.reduce(
    (acc, asset) => {
      acc[asset.symbol] = asset.amount
      return acc
    },
    {} as BalanceMap,
  )
}

// ─── Session cache helpers ─────────────────────────────────────

function saveSessionTransactions(records: TransferRecord[]) {
  try {
    sessionStorage.setItem(SESSION_TX_CACHE_KEY, JSON.stringify(records))
  } catch { /* quota exceeded — not critical */ }
}

function loadSessionTransactions(): TransferRecord[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_TX_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as TransferRecord[]
  } catch {
    return null
  }
}

function saveSessionBalances(balances: BalanceMap) {
  try {
    sessionStorage.setItem(SESSION_BAL_CACHE_KEY, JSON.stringify(balances))
  } catch { /* quota exceeded */ }
}

function loadSessionBalances(): BalanceMap | null {
  try {
    const raw = sessionStorage.getItem(SESSION_BAL_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as BalanceMap
  } catch {
    return null
  }
}

export function clearSessionCache() {
  sessionStorage.removeItem(SESSION_TX_CACHE_KEY)
  sessionStorage.removeItem(SESSION_BAL_CACHE_KEY)
  initialLoadDone = false
  dbTransactionsCache = []
  dbBalancesCache = null
  currentUserId = null
}

// ─── Balances ──────────────────────────────────────────────────

/**
 * Returns balances from the in-memory cache.
 * Falls back to session cache, then defaults.
 */
export function getBalances(): BalanceMap {
  if (dbBalancesCache) return { ...dbBalancesCache }
  // Restore from session cache on refresh before first DB fetch completes
  const session = loadSessionBalances()
  if (session) {
    dbBalancesCache = session
    return { ...session }
  }
  return defaultBalances()
}

/**
 * Overwrite the in-memory balance cache and notify listeners.
 * Does NOT auto-push to DB — callers that need to persist call
 * pushCurrentBalancesToDb() explicitly.
 */
export function setBalances(next: BalanceMap) {
  dbBalancesCache = { ...next }
  saveSessionBalances(next)
  emit()
}

export function getBalance(symbol: PortfolioSymbol): number {
  return getBalances()[symbol] ?? 0
}

export function adjustBalance(symbol: PortfolioSymbol, delta: number) {
  const balances = getBalances()
  const next = Math.max(0, (balances[symbol] ?? 0) + delta)
  setBalances({ ...balances, [symbol]: next })
  void pushCurrentBalancesToDb()
}

// ─── Local user transactions ───────────────────────────────────

function loadUserTransactions(): TransferRecord[] {
  try {
    const raw = localStorage.getItem(TX_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TransferRecord[]
  } catch {
    return []
  }
}

function saveUserTransactions(records: TransferRecord[]) {
  localStorage.setItem(TX_KEY, JSON.stringify(records))
}

/** Returns true if there are any local pending withdrawal records */
function hasPendingWithdrawals(): boolean {
  return loadUserTransactions().some((r) => r.status === 'Pending Approval')
}

// ─── Sync logic ────────────────────────────────────────────────

/**
 * Sync local pending withdrawals status from DB.
 * - Admin approved  → flip local record to Completed immediately.
 * - Admin rejected  → flip local record to Rejected and restore the balance.
 * - No admin action → stays Pending Approval indefinitely.
 */
export function syncLocalFromDb() {
  const user = loadUserTransactions()
  if (user.length === 0 || dbTransactionsCache.length === 0) return

  let changed = false
  const dbByTxid = new Map<string, TransferRecord>()
  for (const r of dbTransactionsCache) {
    dbByTxid.set(r.txid, r)
  }

  const updated: TransferRecord[] = []
  for (const record of user) {
    const dbRecord = dbByTxid.get(record.txid)
    if (!dbRecord) {
      updated.push(record)
      continue
    }

    if (record.status === 'Pending Approval') {
      if (dbRecord.status === 'Completed') {
        changed = true
        updated.push({
          ...record,
          status: 'Completed',
          completedAt: dbRecord.completedAt,
          time: dbRecord.time,
        })
        continue
      }

      if (dbRecord.status === 'Rejected') {
        changed = true
        const qty = parseFloat(record.qty)
        if (!isNaN(qty) && qty > 0) {
          const balances = getBalances()
          const restored = (balances[record.coin] ?? 0) + qty
          dbBalancesCache = { ...balances, [record.coin]: restored }
          saveSessionBalances(dbBalancesCache)
          void pushCurrentBalancesToDb()
        }
        updated.push({ ...record, status: 'Rejected' })
        continue
      }
    }

    updated.push(record)
  }

  if (changed) {
    saveUserTransactions(updated)
    emit()
  }
}

export function getAllTransactions(): TransferRecord[] {
  const seed = buildSeedHistory()
  const user = loadUserTransactions()

  const allTxIds = new Set<string>()
  const merged: TransferRecord[] = []

  // DB transactions first — authoritative source
  for (const r of dbTransactionsCache) {
    if (!allTxIds.has(r.txid)) {
      allTxIds.add(r.txid)
      merged.push(r)
    }
  }

  // Local optimistic records (pending withdrawals not yet confirmed in DB)
  for (const r of user) {
    if (!allTxIds.has(r.txid)) {
      allTxIds.add(r.txid)
      merged.push(r)
    }
  }

  // Seed history (always included, never removed)
  for (const r of seed) {
    if (!allTxIds.has(r.txid)) {
      allTxIds.add(r.txid)
      merged.push(r)
    }
  }

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/**
 * Initial load — called once per session (login or first mount after refresh).
 * Restores from sessionStorage if available, otherwise fetches from DB.
 */
export async function initialSync(): Promise<void> {
  if (initialLoadDone) return
  initialLoadDone = true

  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return

    // Try to restore from session cache first (avoids DB hit on soft refresh)
    const cachedTx = loadSessionTransactions()
    const cachedBal = loadSessionBalances()

    if (cachedTx && cachedBal) {
      dbTransactionsCache = cachedTx
      dbBalancesCache = { ...defaultBalances(), ...cachedBal }
      syncLocalFromDb()
      emit()
      return
    }

    // No session cache — fetch from DB
    const [dbTx, dbBal] = await Promise.all([
      fetchDbTransactions(currentUserId),
      fetchDbBalances(currentUserId),
    ])

    dbTransactionsCache = dbTx
    saveSessionTransactions(dbTx)

    if (dbBal && Object.keys(dbBal).length > 0) {
      dbBalancesCache = { ...defaultBalances(), ...(dbBal as BalanceMap) }
      saveSessionBalances(dbBalancesCache)
    }

    syncLocalFromDb()
    emit()
  } catch (err) {
    console.error('initialSync error:', err)
  }
}

/**
 * Polls for pending transaction updates only.
 * Only hits the DB if there are local pending withdrawals.
 * Called on an interval while the user has pending transactions.
 */
export async function pollPendingTransactions(): Promise<void> {
  if (!hasPendingWithdrawals()) return

  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return

    const dbTx = await fetchDbTransactions(currentUserId)
    dbTransactionsCache = dbTx
    saveSessionTransactions(dbTx)
    syncLocalFromDb()

    // Also refresh balances since an approval/rejection changes them
    const dbBal = await fetchDbBalances(currentUserId)
    if (dbBal && Object.keys(dbBal).length > 0) {
      dbBalancesCache = { ...defaultBalances(), ...(dbBal as BalanceMap) }
      saveSessionBalances(dbBalancesCache)
    }

    emit()
  } catch (err) {
    console.error('pollPendingTransactions error:', err)
  }
}

/**
 * Polls for admin-side changes (deposits, balance updates).
 * Runs a cheap count query — only does a full fetch if the DB has
 * more transactions than what we have cached. Called on a slower
 * interval (e.g. every 30 s) regardless of pending withdrawal state.
 */
export async function pollAdminUpdates(): Promise<void> {
  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return

    const dbCount = await fetchTransactionCount(currentUserId)
    if (dbCount < 0) return // query failed, skip

    const cachedCount = dbTransactionsCache.length

    if (dbCount !== cachedCount) {
      // Something changed — fetch full transactions + fresh balances
      const [dbTx, dbBal] = await Promise.all([
        fetchDbTransactions(currentUserId),
        fetchDbBalances(currentUserId),
      ])

      dbTransactionsCache = dbTx
      saveSessionTransactions(dbTx)

      if (dbBal && Object.keys(dbBal).length > 0) {
        dbBalancesCache = { ...defaultBalances(), ...(dbBal as BalanceMap) }
        saveSessionBalances(dbBalancesCache)
      }

      syncLocalFromDb()
      emit()
    }
  } catch (err) {
    console.error('pollAdminUpdates error:', err)
  }
}

/**
 * Force a full re-fetch from DB (used after submitting a withdrawal
 * to get the authoritative DB record immediately).
 */
export async function syncDbTransactions(): Promise<void> {
  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return
    const dbTx = await fetchDbTransactions(currentUserId)
    dbTransactionsCache = dbTx
    saveSessionTransactions(dbTx)
    syncLocalFromDb()
    emit()
  } catch (err) {
    console.error('syncDbTransactions error:', err)
  }
}

/**
 * Fetch balances directly from DB and store in memory + session cache.
 * Pure read — does not push back to DB.
 */
export async function syncBalancesFromDb(): Promise<void> {
  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return
    const dbBalances = await fetchDbBalances(currentUserId)
    if (dbBalances && Object.keys(dbBalances).length > 0) {
      dbBalancesCache = { ...defaultBalances(), ...(dbBalances as BalanceMap) }
      saveSessionBalances(dbBalancesCache)
      emit()
    }
  } catch (err) {
    console.error('syncBalancesFromDb error:', err)
  }
}

/** Push current in-memory balances to DB */
export async function pushCurrentBalancesToDb(): Promise<void> {
  try {
    if (!currentUserId) {
      currentUserId = await getCurrentUserId()
    }
    if (!currentUserId) return
    const balances = getBalances()
    await pushBalancesToDb(currentUserId, balances)
  } catch (err) {
    console.error('pushCurrentBalancesToDb error:', err)
  }
}

export function submitWithdraw(params: {
  coin: PortfolioSymbol
  qty: number
  fee: number
  address: string
  networkId: string
}): TransferRecord | null {
  const balances = getBalances()
  const available = balances[params.coin] ?? 0
  const totalDebit = params.qty

  if (totalDebit <= 0 || totalDebit > available) return null

  const now = new Date()
  const record = createWithdrawRecord({
    coin: params.coin,
    qty: params.qty,
    fee: params.fee,
    address: params.address,
    networkId: params.networkId,
    createdAt: now,
    pendingUntil: now,
  })

  // Deduct balance immediately in memory
  const newBalance = available - totalDebit
  dbBalancesCache = { ...balances, [params.coin]: newBalance }
  saveSessionBalances(dbBalancesCache)
  emit()

  // Save optimistic local record so it shows up instantly
  const user = loadUserTransactions()
  saveUserTransactions([record, ...user])
  emit()

  // Persist updated balances to DB
  void pushCurrentBalancesToDb()

  // Push withdrawal record to DB, then do a full sync to get authoritative state
  void pushWithdrawalToDb({
    userId: currentUserId ?? '',
    coin: params.coin,
    qty: params.qty,
    fee: params.fee,
    address: params.address,
    networkId: params.networkId,
    txid: record.txid,
  }).then(() => syncDbTransactions())

  return record
}

export function getAccountCoins() {
  const balances = getBalances()
  return PORTFOLIO_ASSETS.map((asset) => ({
    ...asset,
    amount: balances[asset.symbol] ?? 0,
  })).filter((asset) => asset.amount > 0)
}
