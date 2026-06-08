import { useState } from 'react'
import {
  ChevronDown,
  BookUser,
  ArrowLeftRight,
  ChevronRight,
} from 'lucide-react'
import type { PortfolioSymbol } from '../../lib/portfolioData'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'
import {
  getNetworksForCoin,
  isValidAddress,
  MIN_WITHDRAW,
  WITHDRAW_FEE_RATE,
} from '../../lib/transferConstants'
import { formatCoinAmount } from '../../hooks/usePortfolioMarketData'
import { submitWithdraw } from '../../lib/portfolioStore'
import { StepHeader } from './StepHeader'
import { CoinLogo } from '../shared/CoinLogo'

export function WithdrawCryptoContent() {
  const { coins } = usePortfolioStore()
  const [coinOpen, setCoinOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [addressTab, setAddressTab] = useState<'address' | 'user'>('address')
  const [selectedCoin, setSelectedCoin] = useState<PortfolioSymbol>('USDT')
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null)
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selectedAsset = coins.find((c) => c.symbol === selectedCoin)
  const available = selectedAsset?.amount ?? 0

  // Networks available for the selected coin
  const availableNetworks = getNetworksForCoin(selectedCoin)
  const selectedNetwork = availableNetworks.find((n) => n.id === selectedNetworkId) ?? null

  const step1Done = coins.some((c) => c.symbol === selectedCoin)

  // Address validation uses the selected network's specific regex
  const addressValid =
    addressTab === 'address' &&
    selectedNetworkId !== null &&
    isValidAddress(withdrawAddress, selectedNetworkId, selectedCoin)

  const step2Done = step1Done && selectedNetworkId !== null && addressValid

  const amountNum = parseFloat(amount) || 0
  const fee = amountNum * WITHDRAW_FEE_RATE
  const receive = Math.max(0, amountNum - fee)
  const minWithdraw = MIN_WITHDRAW[selectedCoin] ?? 0.01

  const amountError =
    amountNum > 0 && amountNum < minWithdraw
      ? `Minimum withdrawal is ${minWithdraw} ${selectedCoin}`
      : amountNum > available
        ? 'Amount exceeds available balance'
        : receive <= 0 && amountNum > 0
          ? 'Amount too small after network fee'
          : null

  const canWithdraw = step2Done && amountNum > 0 && !amountError && !submitted
  const step3Enabled = step2Done

  function handleWithdraw() {
    if (!canWithdraw || !selectedNetworkId) return
    const ok = submitWithdraw({
      coin: selectedCoin,
      qty: amountNum,
      fee,
      address: withdrawAddress.trim(),
      networkId: selectedNetworkId,
    })
    if (ok) {
      setSubmitted(true)
      setAmount('')
    }
  }

  return (
    <div>
      {/* ── Step 1: Select coin ── */}
      <StepHeader step={1} title="Select coin">
        <button
          type="button"
          onClick={() => setCoinOpen((v) => !v)}
          className="flex h-12 w-full max-w-xl items-center justify-between rounded-md border border-input-border bg-card px-4 text-left"
        >
          {selectedAsset ? (
            <span className="flex items-center gap-3">
              <CoinLogo symbol={selectedAsset.symbol} size={24} iconBg={selectedAsset.iconBg} />
              <span>
                <span className="font-medium text-text">{selectedAsset.symbol} </span>
                <span className="text-muted">{selectedAsset.name}</span>
              </span>
            </span>
          ) : (
            <span className="text-muted">Select coin</span>
          )}
          <ChevronDown size={18} className="text-muted" />
        </button>
        {coinOpen && (
          <div className="mt-1 max-w-xl rounded-md border border-card-border bg-card py-1 shadow-lg">
            {coins.map((asset) => (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => {
                  setSelectedCoin(asset.symbol)
                  setSelectedNetworkId(null)
                  setWithdrawAddress('')
                  setAmount('')
                  setSubmitted(false)
                  setCoinOpen(false)
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-sidebar-active"
              >
                <CoinLogo symbol={asset.symbol} size={24} iconBg={asset.iconBg} />
                <span className="text-text">{asset.symbol} {asset.name}</span>
                <span className="ml-auto text-xs text-muted">
                  {formatCoinAmount(asset.amount, asset.symbol)}
                </span>
              </button>
            ))}
          </div>
        )}
      </StepHeader>

      {/* ── Step 2: Withdraw to (address + network) ── */}
      <StepHeader step={2} title="Withdraw to" enabled={step1Done}>
        {/* Address / User tab */}
        <div className="mb-4 flex gap-6 border-b border-card-border">
          {(['address', 'user'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setAddressTab(tab)}
              disabled={tab === 'user'}
              className={`border-b-2 pb-2 text-sm ${
                addressTab === tab
                  ? 'border-accent font-medium text-text'
                  : 'border-transparent text-muted'
              } ${tab === 'user' ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {tab === 'address' ? 'Address' : 'Binance user'}
            </button>
          ))}
        </div>

        {/* Address input */}
        <div
          className={`mb-3 flex max-w-xl items-center gap-2 rounded-md border bg-card px-3 py-2.5 ${
            withdrawAddress && !addressValid ? 'border-error' : 'border-input-border'
          }`}
        >
          <input
            type="text"
            value={withdrawAddress}
            onChange={(e) => {
              setWithdrawAddress(e.target.value)
              setSubmitted(false)
            }}
            placeholder={
              selectedNetwork?.addressHint ?? 'Select a network first'
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-accent outline-none placeholder:text-muted"
          />
          <button type="button" className="text-muted hover:text-text" aria-label="Address book">
            <BookUser size={20} />
          </button>
        </div>
        {withdrawAddress && selectedNetworkId && !addressValid && (
          <p className="mb-2 text-sm text-error">
            {selectedNetwork?.addressFormatNote ?? 'Invalid address format.'}
          </p>
        )}

        {/* Network selector */}
        <button
          type="button"
          onClick={() => step1Done && setNetworkOpen((v) => !v)}
          disabled={!step1Done}
          className="mb-2 flex h-12 w-full max-w-xl items-center justify-between rounded-md border border-input-border bg-card px-4 disabled:opacity-60"
        >
          <span className="text-text">{selectedNetwork?.label ?? 'Select network'}</span>
          <ChevronDown size={18} className="text-muted" />
        </button>

        {networkOpen && step1Done && (
          <div className="mb-2 max-w-xl rounded-md border border-card-border bg-card py-1 shadow-lg">
            {availableNetworks.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">No networks available for this coin.</p>
            ) : (
              availableNetworks.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => {
                    setSelectedNetworkId(network.id)
                    setWithdrawAddress('')
                    setSubmitted(false)
                    setNetworkOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-text hover:bg-sidebar-active"
                >
                  <span>{network.label}</span>
                </button>
              ))
            )}
          </div>
        )}

        {selectedNetwork && (
          <p className="mt-1 text-sm text-muted">
            {selectedNetwork.addressHint}
          </p>
        )}
      </StepHeader>

      {/* ── Step 3: Amount ── */}
      <StepHeader step={3} title="Withdraw amount" isLast enabled={step3Enabled}>
        <div
          className={`mb-2 flex max-w-xl items-center rounded-md border bg-card px-3 ${
            amountError ? 'border-error' : 'border-input-border'
          }`}
        >
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^0-9.]/g, ''))
              setSubmitted(false)
            }}
            className="h-12 flex-1 bg-transparent text-sm text-text outline-none"
            placeholder="0.00"
          />
          <span className="text-sm text-muted">{selectedCoin}</span>
          <button
            type="button"
            onClick={() => setAmount(String(available))}
            className="ml-2 text-sm font-medium text-accent hover:underline"
          >
            MAX
          </button>
        </div>
        {amountError && <p className="mb-3 text-sm text-error">{amountError}</p>}
        {submitted && (
          <p className="mb-3 text-sm text-accent">
            Withdrawal submitted — status: Pending Approval.
          </p>
        )}

        <p className="mb-4 max-w-xl text-sm leading-relaxed text-muted">
          Network fee is {WITHDRAW_FEE_RATE * 100}% of the withdrawal amount. Recipient receives the remainder.
        </p>

        <div className="mb-4 space-y-1 text-sm">
          <p className="text-muted">
            Available:{' '}
            <span className="text-text">
              {formatCoinAmount(available, selectedCoin)} {selectedCoin}
            </span>
          </p>
          <p className="text-muted">
            24h remaining limit:{' '}
            <span className="text-text">
              {formatCoinAmount(available, selectedCoin)} {selectedCoin}
            </span>
          </p>
        </div>

        <div className="mb-6 max-w-xl">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <ArrowLeftRight size={14} />
            Receive amount
          </div>
          <p className="text-2xl font-semibold text-text">
            {formatCoinAmount(receive, selectedCoin)} {selectedCoin}
          </p>
          <button type="button" className="mt-1 text-sm text-muted hover:text-text">
            Network Fee {formatCoinAmount(fee, selectedCoin)} {selectedCoin} ({WITHDRAW_FEE_RATE * 100}%)
            <ChevronRight size={14} className="inline" />
          </button>
        </div>

        <button
          type="button"
          disabled={!canWithdraw}
          onClick={handleWithdraw}
          className={`h-12 w-full max-w-xl rounded-md text-sm font-semibold ${
            canWithdraw
              ? 'bg-accent text-black hover:bg-accent-hover'
              : 'bg-accent/40 text-black/60'
          }`}
        >
          Withdraw
        </button>
      </StepHeader>
    </div>
  )
}
