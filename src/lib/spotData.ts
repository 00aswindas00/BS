import { PORTFOLIO_ASSETS } from './portfolioData'

export type SpotAsset = {
  symbol: string
  name: string
  iconBg: string
  amount: string
  amountUsd: string
  available: string
  softStaking?: boolean
}

export const SPOT_ASSETS: SpotAsset[] = [
  ...PORTFOLIO_ASSETS.map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    iconBg: asset.iconBg,
    amount: String(asset.amount),
    amountUsd: '$0.00',
    available: String(asset.amount),
    softStaking: asset.symbol === 'ETH' ? true : undefined,
  })),
]
