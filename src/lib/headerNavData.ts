import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Wallet,
  ClipboardList,
  UserCircle,
  UserPlus,
  Gift,
  Settings,
  LayoutGrid,
  CircleDot,
  ArrowLeftRight,
  FileText,
  SquareStack,
  Bot,
  PiggyBank,
  Coins,
  History,
  PieChart,
  ShieldCheck,
  MessageSquare,
  Megaphone,
  Sparkles,
  Gift as GiftIcon,
} from 'lucide-react'

export type HeaderNavLink = {
  label: string
  path: string
  icon: LucideIcon
  external?: boolean
}

export const PROFILE_MENU: HeaderNavLink[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Assets', path: '/assets/overview', icon: Wallet },
  { label: 'Orders', path: '/orders/assets-history', icon: ClipboardList },
  { label: 'Account', path: '/account/identification', icon: UserCircle },
  { label: 'Referral', path: 'https://www.binance.com/en/activity/referral/offers?stopRedirectToActivity=true', icon: UserPlus, external: true },
  { label: 'Rewards Hub', path: '/rewards', icon: Gift },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const WALLET_MENU: HeaderNavLink[] = [
  { label: 'Overview', path: '/assets/overview', icon: LayoutGrid },
  { label: 'Spot', path: '/assets/spot', icon: CircleDot },
  { label: 'Margin', path: '/assets/margin', icon: ArrowLeftRight },
  { label: 'Futures', path: 'https://www.binance.com/en/trade/AI_USDT', icon: FileText, external: true },
  { label: 'Options', path: 'https://www.binance.com/en/trade/AI_USDT', icon: SquareStack, external: true },
  { label: 'Trading Bots', path: 'https://www.binance.com/en/trade/AI_USDT', icon: Bot, external: true },
  { label: 'Earn', path: '/assets/earn', icon: PiggyBank },
  { label: 'Funding', path: '/assets/funding', icon: Coins },
  { label: 'Asset History', path: '/orders/assets-history', icon: History },
  { label: 'Account Statement', path: '/account/statement', icon: PieChart },
  { label: 'Verification', path: '/account/identification', icon: ShieldCheck },
]

export type MessageItem = {
  id: string
  label: string
  icon: LucideIcon
  subtitle?: string
  time?: string
  path?: string
}

export const MESSAGES_MENU: MessageItem[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '#' },
  {
    id: 'announcement',
    label: 'Announcement',
    icon: Megaphone,
    subtitle: 'Binance Earn: Enjoy Up to 7% APR wit...',
    time: '10:00',
    path: '#',
  },
  { id: 'ai-pro', label: 'Binance Ai Pro', icon: Sparkles, path: '#' },
  { id: 'campaign', label: 'Campaign', icon: GiftIcon, path: '#' },
]

export const DEFAULT_USER = {
  emailMasked: 'su***@gmail.com',
  displayName: 'SUNIL KUMAR',
  uid: '182798465',
}

export function maskIdentifier(identifier: string): string {
  if (identifier.includes('@')) {
    const [local, domain] = identifier.split('@')
    if (!local || !domain) return DEFAULT_USER.emailMasked
    const visible = local.slice(0, Math.min(2, local.length))
    return `${visible}***@${domain}`
  }
  return identifier.length > 4
    ? `${identifier.slice(0, 2)}***${identifier.slice(-2)}`
    : DEFAULT_USER.emailMasked
}
