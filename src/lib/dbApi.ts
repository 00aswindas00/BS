import { supabase } from './supabaseClient'
import type { PortfolioSymbol } from './portfolioData'
import type { TransferRecord } from './transactionHistory'
import { toDbDisplay } from './transactionHistory'

const CURRENT_USER_EMAIL = 'sunilkryptousdt@gmail.com'

// ─── User Helpers ─────────────────────────────────────────────

export async function getOrCreateUser(email: string, password: string): Promise<string | null> {
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) return existing.id

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ email, password, wallet_id: null })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    return newUser?.id ?? null
  } catch (err) {
    console.error('getOrCreateUser error:', err)
    return null
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  return getOrCreateUser(CURRENT_USER_EMAIL, 'sunil@9964')
}

// ─── Transactions ─────────────────────────────────────────────

/** Lightweight count query — used to detect new transactions without fetching full rows */
export async function fetchTransactionCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) return -1
    return count ?? 0
  } catch {
    return -1
  }
}

export async function fetchDbTransactions(userId: string): Promise<TransferRecord[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timedate', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }

    return (data ?? []).map((row) => ({
      id: `db-${row.id}`,
      kind: row.kind as 'Deposit' | 'Withdraw',
      status: mapStatus(row.status),
      coin: row.coin as PortfolioSymbol,
      qty: String(row.amount),
      fee: String(row.fee),
      address: row.to_address ?? row.from_address ?? '',
      // Use the DB row's UUID as txid fallback so null-txid deposits are never dropped
      txid: row.txid ?? `db-deposit-${row.id}`,
      createdAt: row.timedate,
      completedAt: row.completed_at ?? row.timedate,
      // Display the time exactly as stored in the DB — no timezone conversion
      time: toDbDisplay(row.timedate),
      networkId: (row.network as 'BTC' | 'ETH' | 'BSC' | 'SOL') ?? undefined,
      rawStatus: row.status,
    }))
  } catch (err) {
    console.error('fetchDbTransactions error:', err)
    return []
  }
}

function mapStatus(
  status: string,
): 'Pending Approval' | 'Completed' | 'Rejected' {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'waiting_for_approval':
    case 'pending_approval':
      return 'Pending Approval'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Pending Approval'
  }
}

// ─── Balances ─────────────────────────────────────────────────

/** Fetch user asset balances from DB */
export async function fetchDbBalances(
  userId: string,
): Promise<Partial<Record<PortfolioSymbol, number>>> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('token, amount')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching balances:', error)
      return {}
    }

    const balances: Partial<Record<PortfolioSymbol, number>> = {}
    for (const row of data ?? []) {
      const token = row.token as PortfolioSymbol
      if (['BTC', 'ETH', 'USDT', 'TRX'].includes(token)) {
        balances[token] = Number(row.amount)
      }
    }
    return balances
  } catch (err) {
    console.error('fetchDbBalances error:', err)
    return {}
  }
}

/** Push user balances to DB (upsert into assets table) */
export async function pushBalancesToDb(
  userId: string,
  balances: Record<string, number>,
): Promise<boolean> {
  try {
    const rows = Object.entries(balances)
      .filter(([, amount]) => amount > 0)
      .map(([token, amount]) => ({
        user_id: userId,
        token,
        amount,
        updated_at: new Date().toISOString(),
      }))

    if (rows.length === 0) return true

    const { error } = await supabase
      .from('assets')
      .upsert(rows, { onConflict: 'user_id,token' })

    if (error) {
      console.error('Error pushing balances to DB:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('pushBalancesToDb error:', err)
    return false
  }
}

// ─── Withdrawals ──────────────────────────────────────────────

export async function pushWithdrawalToDb(params: {
  userId: string
  coin: PortfolioSymbol
  qty: number
  fee: number
  address: string
  networkId: string
  txid: string
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').insert({
      user_id: params.userId,
      coin: params.coin,
      kind: 'Withdraw' as const,
      to_address: params.address,
      from_address: null,
      amount: params.qty,
      fee: params.fee,
      network: params.networkId,
      txid: params.txid,
      status: 'waiting_for_approval' as const,
      timedate: new Date().toISOString(),
    })

    if (error) {
      console.error('Error pushing withdrawal to DB:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('pushWithdrawalToDb error:', err)
    return false
  }
}

// ─── Admin: Fetch pending withdrawals ─────────────────────────

export type PendingWithdrawal = {
  id: string
  userId: string
  coin: string
  kind: string
  amount: number
  fee: number
  address: string
  network: string | null
  txid: string | null
  status: string
  timedate: string
  userEmail: string | null
}

export async function fetchPendingWithdrawals(): Promise<PendingWithdrawal[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, users(email)')
      .eq('status', 'waiting_for_approval')
      .eq('kind', 'Withdraw')
      .order('timedate', { ascending: false })

    if (error) {
      console.error('Error fetching pending withdrawals:', error)
      return []
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      coin: row.coin,
      kind: row.kind,
      amount: Number(row.amount),
      fee: Number(row.fee),
      address: row.to_address ?? '',
      network: row.network,
      txid: row.txid,
      status: row.status,
      timedate: row.timedate,
      userEmail: (row as unknown as { users: { email: string } | null }).users?.email ?? null,
    }))
  } catch (err) {
    console.error('fetchPendingWithdrawals error:', err)
    return []
  }
}

export async function approveWithdrawal(txId: string): Promise<boolean> {
  try {
    // Fetch the transaction to know the amount and user
    const { data: tx, error: txErr } = await supabase
      .from('transactions')
      .select('user_id, coin, amount')
      .eq('id', txId)
      .single()

    if (txErr || !tx) {
      console.error('Transaction not found for approval:', txId)
      return false
    }

    // Mark transaction as completed
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', txId)

    if (error) {
      console.error('Error approving withdrawal:', error)
      return false
    }

    // Deduct the withdrawal amount from the user's asset balance in DB
    const { data: asset } = await supabase
      .from('assets')
      .select('amount')
      .eq('user_id', tx.user_id)
      .eq('token', tx.coin)
      .single()

    if (asset) {
      const newAmount = Math.max(0, Number(asset.amount) - Number(tx.amount))
      await supabase
        .from('assets')
        .update({ amount: newAmount, updated_at: new Date().toISOString() })
        .eq('user_id', tx.user_id)
        .eq('token', tx.coin)
    }

    return true
  } catch (err) {
    console.error('approveWithdrawal error:', err)
    return false
  }
}

export async function rejectWithdrawal(txId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'rejected' })
      .eq('id', txId)

    if (error) {
      console.error('Error rejecting withdrawal:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('rejectWithdrawal error:', err)
    return false
  }
}

// ─── Admin: Create deposit ────────────────────────────────────

export async function createAdminDeposit(params: {
  userEmail: string
  coin: string
  amount: number
  address?: string
  txid?: string
  network?: string
  timedate?: string
}): Promise<boolean> {
  try {
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', params.userEmail)
      .single()

    if (userErr || !user) {
      console.error('User not found:', params.userEmail)
      return false
    }

    const depositTime = params.timedate ?? new Date().toISOString()

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      coin: params.coin,
      kind: 'Deposit' as const,
      amount: params.amount,
      fee: 0,
      status: 'completed' as const,
      txid: params.txid ?? null,
      network: params.network ?? null,
      from_address: params.address ?? null,
      timedate: depositTime,
      completed_at: depositTime,
    })

    if (error) {
      console.error('Error creating deposit:', error)
      return false
    }

    // Update user's asset balance in DB
    const { data: existing } = await supabase
      .from('assets')
      .select('amount')
      .eq('user_id', user.id)
      .eq('token', params.coin)
      .single()

    const newAmount = (Number(existing?.amount ?? 0)) + params.amount
    await supabase
      .from('assets')
      .upsert(
        { user_id: user.id, token: params.coin, amount: newAmount, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,token' },
      )

    return true
  } catch (err) {
    console.error('createAdminDeposit error:', err)
    return false
  }
}

// ─── Admin: Auth ──────────────────────────────────────────────

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (error || !data) return false
    return true
  } catch {
    // Fallback: hardcoded check if DB not yet set up
    return email === 'admin99@gmail.com' && password === 'admin@99'
  }
}

// ─── Admin: Fetch all transactions ────────────────────────────

export async function fetchAllTransactions(): Promise<PendingWithdrawal[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, users(email)')
      .order('timedate', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching all transactions:', error)
      return []
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      coin: row.coin,
      kind: row.kind,
      amount: Number(row.amount),
      fee: Number(row.fee),
      address: row.to_address ?? '',
      network: row.network,
      txid: row.txid,
      status: row.status,
      timedate: row.timedate,
      userEmail: (row as unknown as { users: { email: string } | null }).users?.email ?? null,
    }))
  } catch (err) {
    console.error('fetchAllTransactions error:', err)
    return []
  }
}
