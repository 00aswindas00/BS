export function QrLoginPanel() {
  return (
    <div
      className="mt-4 rounded-lg border border-card-border bg-page p-6 text-center"
      role="region"
      aria-label="QR code login"
    >
      <div
        className="mx-auto mb-4 grid h-[160px] w-[160px] place-items-center rounded-lg bg-white p-3"
        aria-hidden
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect width="100" height="100" fill="#fff" />
          <rect x="8" y="8" width="28" height="28" fill="#0b0e11" />
          <rect x="12" y="12" width="20" height="20" fill="#fff" />
          <rect x="16" y="16" width="12" height="12" fill="#0b0e11" />
          <rect x="64" y="8" width="28" height="28" fill="#0b0e11" />
          <rect x="68" y="12" width="20" height="20" fill="#fff" />
          <rect x="72" y="16" width="12" height="12" fill="#0b0e11" />
          <rect x="8" y="64" width="28" height="28" fill="#0b0e11" />
          <rect x="12" y="68" width="20" height="20" fill="#fff" />
          <rect x="16" y="72" width="12" height="12" fill="#0b0e11" />
          {[
            [44, 12],
            [52, 12],
            [44, 20],
            [60, 44],
            [68, 52],
            [76, 60],
            [44, 52],
            [52, 60],
            [60, 68],
            [68, 76],
            [76, 44],
            [84, 52],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="6" height="6" fill="#0b0e11" />
          ))}
        </svg>
      </div>
      <p className="text-sm font-medium text-text">Scan with Binance app</p>
      <p className="mt-1 text-xs text-muted">
        Open the Binance app and scan this QR code to log in instantly.
      </p>
    </div>
  )
}
