import { useState } from 'react'
import { ChevronDown, Copy, ChevronRight } from 'lucide-react'
import type { PortfolioSymbol } from '../../lib/portfolioData'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'
import { DEPOSIT_ADDRESS, TRANSFER_NETWORKS } from '../../lib/transferConstants'
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

  const step2Enabled = selectedCoin !== null
  const step3Enabled = step2Enabled && selectedNetworkId === 'TRX'

  const selectedAsset = coins.find((c) => c.symbol === selectedCoin)
  const selectedNetwork = TRANSFER_NETWORKS.find((n) => n.id === selectedNetworkId)

  return (
    <div>
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
              <p className="px-4 py-3 text-sm text-muted">No tokens with balance in your account.</p>
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
            {TRANSFER_NETWORKS.map((network) => (
              <button
                key={network.id}
                type="button"
                disabled={!network.selectable}
                onClick={() => {
                  if (!network.selectable) return
                  setSelectedNetworkId(network.id)
                  setNetworkOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                  network.selectable
                    ? 'text-text hover:bg-sidebar-active'
                    : 'cursor-not-allowed text-muted/50'
                }`}
              >
                <span>{network.label}</span>
                {!network.selectable && (
                  <span className="text-xs text-muted">Unavailable</span>
                )}
              </button>
            ))}
          </div>
        )}
        {selectedNetwork && (
          <p className="text-sm text-muted">
            Contract address ending in{' '}
            <button type="button" className="text-text hover:text-accent">
              {selectedNetwork.contractSuffix}
            </button>
            <ChevronRight size={14} className="inline" />
          </p>
        )}
      </StepHeader>

      <StepHeader step={3} title="Deposit Address" isLast enabled={step3Enabled}>
        <div className="max-w-xl rounded-lg border border-card-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <DepositQrCode address={DEPOSIT_ADDRESS} />
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm text-muted">Address</p>
              <div className="flex items-start gap-2">
                <p className="break-all text-sm font-medium text-accent">{DEPOSIT_ADDRESS}</p>
                <button
                  type="button"
                  className="shrink-0 text-muted hover:text-text"
                  aria-label="Copy address"
                  onClick={() => navigator.clipboard.writeText(DEPOSIT_ADDRESS)}
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex max-w-xl justify-between text-sm">
          <span className="text-muted">Minimum deposit</span>
          <span className="text-text">
            More than 0.01 {selectedCoin ?? 'USDT'}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-sm text-muted hover:text-text"
        >
          More Details
          <ChevronDown size={16} />
        </button>
      </StepHeader>
    </div>
  )
}

