import { useState } from 'react'
import { ChevronDown, Copy } from 'lucide-react'
import type { PortfolioSymbol } from '../../lib/portfolioData'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'
import { getNetworksForCoin } from '../../lib/transferConstants'
import { formatCoinAmount } from '../../hooks/usePortfolioMarketData'
import { DepositQrCode } from './DepositQrCode'
import { StepHeader } from './StepHeader'
import { CoinLogo } from '../shared/CoinLogo'

export function DepositCryptoContent() {
  const { coins } = usePortfolioStore()
  const [coinOpen, setCoinOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<PortfolioSymbol | null>(null)
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const selectedAsset = coins.find((c) => c.symbol === selectedCoin)

  // Networks available for the selected coin
  const availableNetworks = selectedCoin ? getNetworksForCoin(selectedCoin) : []
  const selectedNetwork = availableNetworks.find((n) => n.id === selectedNetworkId) ?? null

  const step2Enabled = selectedCoin !== null
  const step3Enabled = selectedNetwork !== null

  const depositAddress = selectedNetwork?.depositAddress ?? ''

  function handleCopy() {
    if (!depositAddress) return
    navigator.clipboard.writeText(depositAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      {/* ── Step 1: Select coin ── */}
      <StepHeader step={1} title="Select Coin">
        <button
          type="button"
          onClick={() => setCoinOpen((v) => !v)}
          className="flex h-12 w-full max-w-xl items-center justify-between rounded-md border border-input-border bg-card px-4 text-left transition-colors hover:border-input-hover"
        >
          {selectedAsset ? (
            <span className="flex items-center gap-3">
              <CoinLogo symbol={selectedAsset.symbol} size={24} iconBg={selectedAsset.iconBg} />
              <span>
                <span className="font-medium text-text">{selectedAsset.symbol} </span>
                <span className="text-muted">{selectedAsset.name}</span>
                <span className="ml-2 text-xs text-muted">
                  ({formatCoinAmount(selectedAsset.amount, selectedAsset.symbol)} available)
                </span>
              </span>
            </span>
          ) : (
            <span className="text-muted">Select coin</span>
          )}
          <ChevronDown size={18} className="text-muted" />
        </button>

        {coinOpen && (
          <div className="mt-1 max-w-xl rounded-md border border-card-border bg-card py-1 shadow-lg">
            {coins.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">No tokens in your account.</p>
            ) : (
              coins.map((asset) => (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => {
                    setSelectedCoin(asset.symbol)
                    setSelectedNetworkId(null)
                    setCoinOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sidebar-active"
                >
                  <CoinLogo symbol={asset.symbol} size={24} iconBg={asset.iconBg} />
                  <span>
                    <span className="font-medium text-text">{asset.symbol} </span>
                    <span className="text-muted">{asset.name}</span>
                  </span>
                  <span className="ml-auto text-xs text-muted">
                    {formatCoinAmount(asset.amount, asset.symbol)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </StepHeader>

      {/* ── Step 2: Select Network ── */}
      <StepHeader step={2} title="Select Network" enabled={step2Enabled}>
        <button
          type="button"
          onClick={() => step2Enabled && setNetworkOpen((v) => !v)}
          disabled={!step2Enabled}
          className="mb-2 flex h-12 w-full max-w-xl items-center justify-between rounded-md border border-input-border bg-card px-4 text-left disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-text">
            {selectedNetwork?.label ?? 'Select network'}
          </span>
          <ChevronDown size={18} className="text-muted" />
        </button>

        {networkOpen && step2Enabled && (
          <div className="mb-2 max-w-xl rounded-md border border-card-border bg-card py-1 shadow-lg">
            {availableNetworks.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted">No networks available.</p>
            ) : (
              availableNetworks.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => {
                    setSelectedNetworkId(network.id)
                    setNetworkOpen(false)
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm text-text hover:bg-sidebar-active"
                >
                  {network.label}
                </button>
              ))
            )}
          </div>
        )}
      </StepHeader>

      {/* ── Step 3: Deposit address ── */}
      <StepHeader step={3} title="Deposit Address" isLast enabled={step3Enabled}>
        <div className="max-w-xl rounded-lg border border-card-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <DepositQrCode address={depositAddress} />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-sm text-muted">Network</p>
              <p className="mb-3 text-sm font-medium text-text">{selectedNetwork?.label}</p>
              <p className="mb-2 text-sm text-muted">Address</p>
              <div className="flex items-start gap-2">
                <p className="break-all text-sm font-medium text-accent">{depositAddress}</p>
                <button
                  type="button"
                  className="shrink-0 text-muted transition-colors hover:text-text"
                  aria-label="Copy address"
                  onClick={handleCopy}
                >
                  <Copy size={18} />
                </button>
              </div>
              {copied && (
                <p className="mt-1 text-xs text-success">Address copied!</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 max-w-xl space-y-1 rounded-md border border-card-border bg-card/50 px-4 py-3 text-sm text-muted">
          <p>• Only send <span className="text-text font-medium">{selectedCoin}</span> on the <span className="text-text font-medium">{selectedNetwork?.label}</span> network to this address.</p>
          <p>• Sending the wrong coin or network may result in permanent loss.</p>
          <p>• Minimum deposit: more than 0 {selectedCoin}</p>
        </div>
      </StepHeader>
    </div>
  )
}
