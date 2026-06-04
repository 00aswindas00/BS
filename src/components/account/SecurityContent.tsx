import {
  KeyRound,
  Smartphone,
  Mail,
  Phone,
  Lock,
  Shield,
  Monitor,
  Activity,
  Ban,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import { SettingsRow, ManageButton, StatusOn, StatusOff } from '../shared/SettingsRow'

const CHECKUP = [
  'Two-factor Authentication (2FA)',
  'Identity Verification',
  'Anti-phishing Code',
  'Withdrawal Whitelist',
]

export function SecurityContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text">Security</h1>

      <section className="rounded-xl border border-card-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap gap-4 sm:gap-8">
          {CHECKUP.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted sm:text-sm">
              <CheckCircle2 size={16} className="text-success" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Two-Factor Authentication (2FA)</h2>
        <div className="mb-4 rounded-lg border border-t-2 border-t-accent border-card-border bg-page/50 p-4 text-sm text-accent">
          To increase your account security, it is recommended that you enable 2FA, including
          Binance/Google Authenticator.
        </div>
        <SettingsRow
          icon={<KeyRound size={20} />}
          title="Passkeys(Biometrics)"
          description="Protect your account and withdrawals with security keys, such as Yubikey"
          trailing={<StatusOn />}
          action={<ManageButton />}
        />
        <SettingsRow
          icon={<Smartphone size={20} />}
          title="Authenticator App"
          description="Use Google Authenticator to protect your account and transactions."
          trailing={<StatusOn />}
          action={<ManageButton />}
        />
        <SettingsRow
          icon={<Mail size={20} />}
          title="Email"
          description="a***1@gmail.com"
          action={<ManageButton />}
        />
        <SettingsRow
          icon={<Phone size={20} />}
          title="Phone Number"
          description="Use your phone number to receive verification codes."
          trailing={<StatusOn />}
          action={<ManageButton />}
        />
        <SettingsRow
          icon={<Lock size={20} />}
          title="Login Password"
          description="Login password is used to log in to your account."
          action={<ManageButton />}
          border={false}
        />
      </section>

      <section className="rounded-xl border border-card-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Advanced Security</h2>
        <SettingsRow
          icon={<Shield size={20} />}
          title="Emergency Control"
          description="If your account is experiencing security issues, please disable it immediately."
          trailing={<StatusOff />}
          action={<ManageButton />}
        />
        <SettingsRow
          title="Account Limit Increase"
          description="Increase your account limits for trading and withdrawals."
          action={<ManageButton />}
        />
        <SettingsRow
          title="Anti-Phishing Code"
          description="Protect your account from phishing attempts."
          trailing={<StatusOff />}
          action={<ManageButton label="Enable" />}
        />
        <SettingsRow title="App Authorization" action={<ManageButton />} />
        <SettingsRow title="2FA Verification Strategy" action={<ManageButton />} />
        <SettingsRow
          title="Withdrawal Protection"
          description="Manage withdrawal security settings."
          action={<ManageButton />}
          border={false}
        />
      </section>

      <section className="rounded-xl border border-card-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Devices and Activities</h2>
        <SettingsRow
          icon={<Monitor size={20} />}
          title="My Devices"
          description="Manage devices that have login status and grant access to your account."
          action={<ManageButton />}
        />
        <SettingsRow
          icon={<Activity size={20} />}
          title="Account Activity"
          description="Last login: 2026-06-01 from India"
          trailing={
            <button type="button" className="text-xs text-accent hover:underline">
              Disable Account
            </button>
          }
          action={<ManageButton label="View" />}
          border={false}
        />
      </section>

      <section className="rounded-xl border border-card-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Account Management</h2>
        <SettingsRow
          icon={<Ban size={20} />}
          title="Disable Account"
          description="Once disabled, most of your actions will be restricted."
          action={<ManageButton label="Disable" />}
        />
        <SettingsRow
          icon={<XCircle size={20} />}
          title="Close Account"
          description="Once closed, your account cannot be restored."
          action={<ManageButton label="Close" />}
          border={false}
        />
      </section>
    </div>
  )
}
