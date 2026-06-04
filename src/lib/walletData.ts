export const ASSET_HOLDING = {
  symbol: 'ACT',
  name: 'Act I : The AI Prophecy',
  iconBg: '#8247e5',
  amount: '0.10',
  amountUsd: '$0.00',
  price: '$0.01',
  costPrice: '--',
  pnl: '+ $0.00',
  fundingAmount: '0.10',
}

export const FEATURE_CARDS = [
  {
    id: 'convert',
    title: 'The easiest way to trade crypto at 0 fees',
    link: 'Convert',
    variant: 'convert' as const,
  },
  {
    id: 'spot',
    title: 'Trade crypto with advanced tools',
    subtitle: 'BTC/USDT $73,444.48',
    change: '-1.03%',
    link: 'Spot Trading',
    variant: 'spot' as const,
  },
]
