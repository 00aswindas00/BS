export type PortfolioSymbol = 'BTC' | 'ETH' | 'USDT' | 'TRX'

export type PortfolioAsset = {
  symbol: PortfolioSymbol
  name: string
  iconBg: string
  amount: number
  coingeckoId: string
}

export const PORTFOLIO_ASSETS: PortfolioAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', iconBg: '#f7931a', amount: 2.591604, coingeckoId: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', iconBg: '#627eea', amount: 15.63784, coingeckoId: 'ethereum' },
  {
    symbol: 'USDT',
    name: 'TetherUS',
    iconBg: '#26a17b',
    amount: 48424654.068037,
    coingeckoId: 'tether',
  },
  { symbol: 'TRX', name: 'Tron', iconBg: '#ef0027', amount: 2769231.825442, coingeckoId: 'tron' },
]

export const COINGECKO_IDS = PORTFOLIO_ASSETS.map((a) => a.coingeckoId).join(',')
