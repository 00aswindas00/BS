import { DEPOSIT_ADDRESS } from '../../lib/transferConstants'

export function DepositQrCode({ address = DEPOSIT_ADDRESS }: { address?: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(address)}`

  return (
    <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded bg-white p-2">
      <img src={src} alt="Deposit QR code" width={104} height={104} className="h-[104px] w-[104px]" />
    </div>
  )
}
