import { ChevronDown } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'

export function ApiManagementContent() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">API Management</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-9 rounded-md bg-accent px-4 text-sm font-semibold text-black hover:bg-accent-hover"
          >
            Create API
          </button>
          <button
            type="button"
            className="h-9 rounded-md border border-input-border bg-card px-4 text-sm font-medium text-text hover:bg-sidebar-active"
          >
            Create Tax Report API
          </button>
          <button
            type="button"
            className="h-9 rounded-md border border-input-border bg-card px-4 text-sm font-medium text-text hover:bg-sidebar-active"
          >
            Delete all API
          </button>
        </div>
      </div>

      <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-muted">
        <li>Each account can create up to 30 API Keys.</li>
        <li>
          Do not disclose your API Key, Secret Key (HMAC) or Private Key to anyone to avoid asset
          losses.
        </li>
        <li>It is recommended to restrict access to trusted IPs only.</li>
        <li>You will not be able to create an API Key if KYC is not completed.</li>
      </ol>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-t-2 border-t-accent border-card-border bg-accent/5 p-4">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" defaultChecked />
        <p className="text-sm text-text">
          By checking this box, all existing API Key(s) on your master account and sub-accounts
          will be subject to Default Security Controls.{' '}
          <button type="button" className="inline-flex items-center gap-0.5 text-accent">
            Default Security Controls Details
            <ChevronDown size={14} />
          </button>
        </p>
      </div>

      <div className="rounded-xl border border-card-border bg-card">
        <EmptyTableState message="Your Account has not created any API Keys yet." />
      </div>
    </div>
  )
}
