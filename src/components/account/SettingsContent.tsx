import type { ReactNode } from 'react'
import {
  User,
  Bell,
  Palette,
  Wallet,
  TrendingUp,
  Link2,
  Shield,
} from 'lucide-react'
import { SettingsRow, ManageButton } from '../shared/SettingsRow'

export function SettingsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text">Settings</h1>

      <SettingsSection title="Profile">
        <SettingsRow
          icon={<User size={20} />}
          title="Nickname & Avatar"
          description="SUNIL KUMAR"
          action={<ManageButton label="Edit" />}
        />
        <SettingsRow
          title="C2C Profile"
          description="User-829sk"
          action={<ManageButton label="Edit" />}
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsRow
          icon={<Bell size={20} />}
          title="Notification Language"
          description="English"
          action={<ManageButton label="Edit" />}
        />
        <SettingsRow
          title="Notification Preferences"
          description="Portfolio, Trade Notification, and more"
          action={<ManageButton />}
        />
        <SettingsRow
          title="Price Alert"
          description="Notification On, Sound On"
          action={<ManageButton />}
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsRow
          icon={<Palette size={20} />}
          title="Color Preference"
          description="Green Up / Red Down"
          action={<ManageButton label="Edit" />}
        />
        <SettingsRow title="Style Settings" action={<ManageButton label="Edit" />} />
        <SettingsRow
          title="Unit Time Zone"
          description="Local / UTC+8"
          action={<ManageButton label="Edit" />}
        />
        <SettingsRow title="Shortcuts" action={<ManageButton label="Edit" />} />
        <SettingsRow
          title="Theme"
          description="Dark"
          action={
            <div className="h-5 w-9 rounded-full bg-accent p-0.5">
              <div className="ml-auto h-4 w-4 rounded-full bg-black" />
            </div>
          }
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Withdrawal">
        <SettingsRow
          icon={<Wallet size={20} />}
          title="Withdrawal Whitelist"
          description="Off"
          action={<ManageButton label="Enable" />}
        />
        <SettingsRow
          title="One-step Withdrawal"
          description="Off"
          action={<ManageButton label="Enable" />}
        />
        <SettingsRow
          title="Withdrawal Limit"
          description="Off-chain withdrawal"
          action={<ManageButton label="Edit" />}
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Trade">
        <SettingsRow
          icon={<TrendingUp size={20} />}
          title="Order Confirmation Reminders"
          description="Spot, Margin, Futures, and more"
          action={<ManageButton />}
        />
        <SettingsRow
          title="Fee Deduction"
          description="Configure"
          action={<ManageButton />}
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Link Account">
        <SettingsRow
          icon={<Link2 size={20} />}
          title="Link TikTok account"
          description="Not Linked"
          action={<ManageButton label="Link" />}
          border={false}
        />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SettingsRow
          icon={<Shield size={20} />}
          title="Download Personal Data"
          action={<ManageButton label="Download" />}
        />
        <SettingsRow
          title="Export Transaction Records"
          action={<ManageButton label="Export" />}
        />
        <SettingsRow title="Modify Personal Data" action={<ManageButton label="Modify" />} />
        <SettingsRow title="Update Documents" action={<ManageButton label="Update" />} />
        <SettingsRow title="Close Account" action={<ManageButton label="Delete" />} />
        <SettingsRow
          title="Privacy Portal"
          action={<ManageButton label="Enter" />}
          border={false}
        />
      </SettingsSection>
    </div>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-card-border bg-card px-4 sm:px-6">
      <h2 className="border-b border-card-border py-4 text-lg font-semibold text-text">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}
