export type SubNavItem = { label: string; path: string }

export const ASSETS_NAV: SubNavItem[] = [
  { label: 'Overview', path: '/assets/overview' },
  { label: 'Spot', path: '/assets/spot' },
  { label: 'Margin', path: '/assets/margin' },
  { label: 'Funding', path: '/assets/funding' },
  { label: 'Third-Party Wallet', path: '/assets/third-party' },
]

export const ORDERS_NAV: SubNavItem[] = [
  { label: 'Assets History', path: '/orders/assets-history' },
  { label: 'Spot Order', path: '/orders/spot' },
  { label: 'P2P Order', path: '/orders/p2p' },
  { label: 'Payment History', path: '/orders/payment' },
]

export const ACCOUNT_NAV: SubNavItem[] = [
  { label: 'Identification', path: '/account/identification' },
  { label: 'Security', path: '/account/security' },
  { label: 'Payment', path: '/account/payment' },
  { label: 'API Management', path: '/account/api' },
  { label: 'Account Statement', path: '/account/statement' },
  { label: 'Financial Reports', path: '/account/reports' },
]

export function getExpandedSection(pathname: string): 'assets' | 'orders' | 'account' | null {
  if (pathname.startsWith('/assets')) return 'assets'
  if (pathname.startsWith('/orders')) return 'orders'
  if (pathname.startsWith('/account')) return 'account'
  return null
}
