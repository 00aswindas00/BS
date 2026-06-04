# Binance Login Clone

Pixel-accurate Binance login page built with React, Vite, Tailwind CSS v4, and React Router.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Routes

| Path | Description |
|------|-------------|
| `/` | Login page |
| `/signup` | Sign-up placeholder |
| `/forgot-password` | Password reset flow |
| `/dashboard` | User dashboard (requires auth) |
| `/assets/overview` | Wallet / Assets Overview |
| `/assets/spot` | Spot wallet |
| `/assets/margin` | Margin (Cross / Isolated) |
| `/assets/funding` | Funding wallet |
| `/orders/p2p` | P2P Orders |
| `/orders/spot` | Spot Orders |
| `/orders/payment` | Payment History |
| `/account/security` | Security settings |
| `/account/payment` | Payment methods (P2P) |
| `/account/api` | API Management |
| `/account/statement` | Account Statement |
| `/account/reports` | Financial Reports |
| `/settings` | User Settings |
| `/orders/assets-history` | Orders → Assets History |
| `/account/identification` | Account → Identification (KYC) |
| `/assets/*`, `/orders/*`, `/account/*` | Other sub-sections (placeholders) |

## Interactions

- **Continue** — validates email or phone, then redirects to `/dashboard`
- **Social buttons** — mock OAuth flow (600ms delay)
- **QR toggle** — shows mock QR panel
- **Language menu** — persists selection in `localStorage`
- **Test failure** — use `fail@example.com` to simulate login error

## Build

```bash
npm run build
npm run preview
```
