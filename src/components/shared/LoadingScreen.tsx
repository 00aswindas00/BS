import { BinanceLogo } from '../../icons/BinanceLogo'

/**
 * Full-screen loading overlay shown during login (2 s) and page
 * transitions (1 s).  Fades out smoothly when `visible` becomes false.
 */
interface LoadingScreenProps {
  visible: boolean
}

export function LoadingScreen({ visible }: LoadingScreenProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page">
      <div className="mb-6">
        <BinanceLogo size="lg" />
      </div>

      {/* Spinner */}
      <span className="spinner inline-block h-8 w-8 rounded-full border-[3px] border-accent/30 border-t-accent" />

      <p className="mt-4 text-sm text-muted">Loading…</p>
    </div>
  )
}
