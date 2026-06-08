import { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck,
  LogOut,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  ArrowDownToLine,
} from 'lucide-react'
import {
  verifyAdmin,
  fetchPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  createAdminDeposit,
  fetchAllTransactions,
  type PendingWithdrawal,
} from '../lib/dbApi'
import { COIN_NETWORKS } from '../lib/transferConstants'
import type { PortfolioSymbol } from '../lib/portfolioData'

const ADMIN_SESSION_KEY = 'bclone_admin_auth'

const COINS = ['USDT', 'BTC', 'ETH', 'TRX'] as const

function formatTime(iso: string): string {
  const d = new Date(iso)
  const utc8 = new Date(d.getTime() + 8 * 60 * 60 * 1000)
  const y = utc8.getUTCFullYear()
  const m = String(utc8.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utc8.getUTCDate()).padStart(2, '0')
  const hh = String(utc8.getUTCHours()).padStart(2, '0')
  const mm = String(utc8.getUTCMinutes()).padStart(2, '0')
  const ss = String(utc8.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

function statusBadge(status: string) {
  switch (status) {
    case 'waiting_for_approval':
      return 'text-accent bg-accent/10 px-2 py-0.5 rounded text-xs font-medium'
    case 'completed':
      return 'text-success bg-success/10 px-2 py-0.5 rounded text-xs font-medium'
    case 'rejected':
      return 'text-error bg-error/10 px-2 py-0.5 rounded text-xs font-medium'
    default:
      return 'text-muted bg-muted/10 px-2 py-0.5 rounded text-xs font-medium'
  }
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Dashboard state
  const [pending, setPending] = useState<PendingWithdrawal[]>([])
  const [allTx, setAllTx] = useState<PendingWithdrawal[]>([])
  const [loading, setLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  // Deposit form
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [depEmail, setDepEmail] = useState('')
  const [depCoin, setDepCoin] = useState<PortfolioSymbol>('USDT')
  const [depAmount, setDepAmount] = useState('')
  const [depAddress, setDepAddress] = useState('')
  const [depTxid, setDepTxid] = useState('')
  const [depNetwork, setDepNetwork] = useState('TRX')
  const [depTimedate, setDepTimedate] = useState('')
  const [depLoading, setDepLoading] = useState(false)

  // When coin changes, reset network to the first available for that coin
  function handleCoinChange(coin: PortfolioSymbol) {
    setDepCoin(coin)
    const nets = COIN_NETWORKS[coin] ?? []
    setDepNetwork(nets[0]?.id ?? '')
  }

  const depNetworkOptions = COIN_NETWORKS[depCoin] ?? []

  // Check existing session
  useEffect(() => {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
    if (raw) setIsLoggedIn(true)
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    const [p, a] = await Promise.all([fetchPendingWithdrawals(), fetchAllTransactions()])
    setPending(p)
    setAllTx(a)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadData()
  }, [isLoggedIn, loadData])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const ok = await verifyAdmin(email.trim(), password)
    setLoginLoading(false)
    if (!ok) {
      setLoginError('Invalid admin credentials.')
      return
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email: email.trim(), loggedInAt: new Date().toISOString() }))
    setIsLoggedIn(true)
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
  }

  async function handleApprove(id: string) {
    setActionMsg('Approving...')
    const ok = await approveWithdrawal(id)
    setActionMsg(ok ? 'Withdrawal approved!' : 'Error approving.')
    await loadData()
    setTimeout(() => setActionMsg(''), 3000)
  }

  async function handleReject(id: string) {
    setActionMsg('Rejecting...')
    const ok = await rejectWithdrawal(id)
    setActionMsg(ok ? 'Withdrawal rejected.' : 'Error rejecting.')
    await loadData()
    setTimeout(() => setActionMsg(''), 3000)
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault()
    setDepLoading(true)
    const timeIso = depTimedate ? new Date(depTimedate).toISOString() : new Date().toISOString()
    const ok = await createAdminDeposit({
      userEmail: depEmail.trim(),
      coin: depCoin,
      amount: parseFloat(depAmount),
      address: depAddress.trim() || undefined,
      txid: depTxid.trim() || undefined,
      network: depNetwork,
      timedate: timeIso,
    })
    setDepLoading(false)
    if (ok) {
      setActionMsg('Deposit created successfully!')
      setDepEmail('')
      setDepAmount('')
      setDepAddress('')
      setDepTxid('')
      setDepTimedate('')
      setShowDepositForm(false)
      await loadData()
    } else {
      setActionMsg('Error creating deposit. Check user email.')
    }
    setTimeout(() => setActionMsg(''), 4000)
  }

  // ─── LOGIN UI ───────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="w-full max-w-md rounded-xl border border-card-border bg-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck size={28} className="text-accent" />
            <h1 className="text-xl font-bold text-text">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-md border border-input-border bg-page px-4 text-sm text-text outline-none focus:border-accent"
                placeholder="admin email"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-md border border-input-border bg-page px-4 text-sm text-text outline-none focus:border-accent"
                placeholder="password"
                required
              />
            </div>
            {loginError && <p className="text-sm text-error">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="h-12 w-full rounded-md bg-accent text-sm font-semibold text-black hover:bg-accent-hover disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD UI ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-card-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-accent" />
          <h1 className="text-lg font-bold text-text">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-sm text-muted hover:text-text"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-error hover:text-error/80"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {/* Action message */}
        {actionMsg && (
          <div className="mb-4 rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
            {actionMsg}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="text-sm text-muted">Pending Withdrawals</p>
            <p className="mt-1 text-2xl font-bold text-accent">{pending.length}</p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <p className="text-sm text-muted">Total Transactions</p>
            <p className="mt-1 text-2xl font-bold text-text">{allTx.length}</p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowDepositForm((v) => !v)}
              className="flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-black hover:bg-accent-hover"
            >
              <Plus size={18} />
              New Deposit
            </button>
          </div>
        </div>

        {/* Deposit Form */}
        {showDepositForm && (
          <div className="mb-6 rounded-xl border border-card-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ArrowDownToLine size={20} className="text-success" />
              <h2 className="text-lg font-semibold text-text">Create Deposit</h2>
            </div>
            <form onSubmit={handleDeposit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-muted">User Email</label>
                <input
                  type="email"
                  value={depEmail}
                  onChange={(e) => setDepEmail(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Coin</label>
                <select
                  value={depCoin}
                  onChange={(e) => handleCoinChange(e.target.value as PortfolioSymbol)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                >
                  {COINS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Network</label>
                <select
                  value={depNetwork}
                  onChange={(e) => setDepNetwork(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                >
                  {depNetworkOptions.map((n) => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Amount</label>
                <input
                  type="number"
                  step="any"
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  From Address <span className="text-xs text-muted/60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={depAddress}
                  onChange={(e) => setDepAddress(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                  placeholder="Sender's address"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  TxID <span className="text-xs text-muted/60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={depTxid}
                  onChange={(e) => setDepTxid(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                  placeholder="Transaction ID"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Date &amp; Time{' '}
                  <span className="text-xs text-muted/60">(optional — defaults to now)</span>
                </label>
                <input
                  type="datetime-local"
                  value={depTimedate}
                  onChange={(e) => setDepTimedate(e.target.value)}
                  className="h-11 w-full rounded-md border border-input-border bg-page px-3 text-sm text-text outline-none focus:border-accent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={depLoading}
                  className="h-11 rounded-md bg-success px-6 text-sm font-semibold text-black hover:bg-success/80 disabled:opacity-50"
                >
                  {depLoading ? 'Creating...' : 'Create Deposit'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pending Withdrawals */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text">
            Pending Withdrawal Requests ({pending.length})
          </h2>
          <div className="rounded-xl border border-card-border bg-card">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw size={24} className="animate-spin text-muted" />
              </div>
            ) : pending.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted">No pending withdrawal requests.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-xs text-muted">
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Time (UTC+8)</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">User</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Coin</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Amount</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Fee</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Address</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">TxID</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((w) => (
                      <tr key={w.id} className="border-b border-card-border last:border-b-0">
                        <td className="whitespace-nowrap px-4 py-3 text-text">{formatTime(w.timedate)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{w.userEmail ?? 'Unknown'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-text">{w.coin}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-text">{w.amount}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-muted">{w.fee}</td>
                        <td className="max-w-[140px] truncate px-4 py-3 text-muted" title={w.address}>{w.address}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{w.network ?? '--'}</td>
                        <td className="max-w-[120px] truncate px-4 py-3 text-muted" title={w.txid ?? ''}>{w.txid ?? '--'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(w.id)}
                              className="flex items-center gap-1 rounded bg-success/20 px-2 py-1 text-xs text-success hover:bg-success/30"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(w.id)}
                              className="flex items-center gap-1 rounded bg-error/20 px-2 py-1 text-xs text-error hover:bg-error/30"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* All Transactions */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text">All Transactions ({allTx.length})</h2>
          <div className="rounded-xl border border-card-border bg-card">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw size={24} className="animate-spin text-muted" />
              </div>
            ) : allTx.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted">No transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-xs text-muted">
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Time (UTC+8)</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">User</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Type</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Coin</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Amount</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Address</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
                      <th className="whitespace-nowrap px-4 py-3 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTx.map((tx) => (
                      <tr key={tx.id} className="border-b border-card-border last:border-b-0">
                        <td className="whitespace-nowrap px-4 py-3 text-text">{formatTime(tx.timedate)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{tx.userEmail ?? 'Unknown'}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={tx.kind === 'Deposit' ? 'text-success' : 'text-accent'}>{tx.kind}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-text">{tx.coin}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-text">{tx.amount}</td>
                        <td className="max-w-[140px] truncate px-4 py-3 text-muted" title={tx.address}>{tx.address}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{tx.network ?? '--'}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={statusBadge(tx.status)}>{tx.status.replace(/_/g, ' ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
