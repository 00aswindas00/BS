export const MARKET_TABS = [
  'Holding',
  'Hot',
  'New Listing',
  'Favorite',
  'Top Gainers',
  '24h Volume',
] as const

export const HOLDINGS = [
  {
    coin: 'ACT',
    amount: '0.50',
    lastPrice: '$0.01',
    costPrice: '$0.01',
    change: '-0.45%',
    changePositive: false,
    iconBg: '#8247e5',
  },
]

export const DISCOVER_TABS = ['Earn', 'Copy Trading'] as const

export const EARN_PRODUCTS = [
  { coin: 'USDC', apr: '32.54%', duration: 'Flexible', iconBg: '#2775ca' },
  { coin: 'USDT', apr: '11.47%', duration: 'Flexible', iconBg: '#26a17b' },
  { coin: 'USD1', apr: '0.25%', duration: 'Flexible', iconBg: '#f0b90b' },
  { coin: 'BNB', apr: '0.18% - 159.53%', duration: 'Flexible', iconBg: '#f0b90b' },
]

export const TRENDING_TOPICS = [
  '#ARInvestSells352MCircleShares',
  '#Bitcoin',
  '#AltcoinSeason',
  '#Ethereum',
  '#CryptoNews',
]

export const NEWS_ITEMS = [
  {
    title: "MCX Launches 'Silver 100' Futures Contract",
    excerpt:
      'The Multi Commodity Exchange of India has announced the launch of a new futures contract.',
    time: '1 min ago',
  },
  {
    title: 'Bitcoin Holds Steady Above Key Support Level',
    excerpt:
      'BTC continues to trade within a narrow range as traders await macroeconomic data.',
    time: '19 mins ago',
  },
  {
    title: 'Ethereum Network Upgrade Scheduled for Next Month',
    excerpt:
      'Developers confirm timeline for the upcoming protocol improvement.',
    time: '1 hour ago',
  },
  {
    title: 'Global Crypto Market Cap Reaches New Weekly High',
    excerpt: 'Total market capitalization rises amid renewed institutional interest.',
    time: '3 hours ago',
  },
]

export const FOOTER_LINKS = {
  Community: ['X', 'Telegram', 'Facebook', 'Instagram', 'Discord', 'Reddit'],
  'About Us': [
    'About',
    'Careers',
    'Announcements',
    'News',
    'Press',
    'Legal',
    'Terms',
    'Privacy',
    'Building Trust',
    'Blog',
    'Community',
    'Risk Warning',
    'Notices',
    'Downloads',
    'Desktop Application',
  ],
  Products: [
    'Exchange',
    'Buy Crypto',
    'Pay',
    'Academy',
    'Live',
    'Gift Card',
    'Launchpool',
    'Auto-Invest',
    'ETH Staking',
    'NFT',
    'BABT',
    'Research',
    'Charity',
  ],
  Business: [
    'P2P Merchant Application',
    'P2Pro Merchant Application',
    'Listing Application',
    'Institutional & VIP Services',
    'Labs',
    'Binance Connect',
  ],
  Learn: [
    'Learn & Earn',
    'Browse Crypto Prices',
    'Bitcoin Price',
    'Ethereum Price',
    'Browse Crypto Price Predictions',
    'Bitcoin Price Prediction',
    'Ethereum Price Prediction',
    'Buy Bitcoin',
    'Buy BNB',
    'Buy XRP',
    'Buy Dogecoin',
    'Buy Ethereum',
    'Buy Tradable Altcoins',
  ],
  Service: [
    'Affiliate',
    'Referral',
    'BNB',
    'OTC Trading',
    'Historical Market Data',
    'Trading Insight',
    'Proof of Reserves',
  ],
  Support: [
    '24/7 Chat Support',
    'Support Center',
    'Product Feedback & Suggestions',
    'Fees',
    'APIs',
    'Binance Verify',
    'Trading Rules',
    'Binance Airdrop Portal',
    'Law Enforcement Requests',
  ],
} as const
