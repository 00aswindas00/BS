import { useState } from 'react'
import { LanguageMenu } from './LanguageMenu'

export function SiteFooter() {
  const [notice, setNotice] = useState<string | null>(null)

  function showNotice(message: string) {
    setNotice(message)
    setTimeout(() => setNotice(null), 3000)
  }

  function handleLegalClick(e: React.MouseEvent, label: string) {
    e.preventDefault()
    showNotice(`${label} — placeholder content for portfolio demo.`)
  }

  return (
    <>
      <footer className="absolute bottom-6 left-0 right-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
        <LanguageMenu />
        <a
          href="#cookies"
          onClick={(e) => handleLegalClick(e, 'Cookies')}
          className="text-[13px] text-muted transition-colors hover:text-text"
        >
          Cookies
        </a>
        <a
          href="#privacy"
          onClick={(e) => handleLegalClick(e, 'Privacy')}
          className="text-[13px] text-muted transition-colors hover:text-text"
        >
          Privacy
        </a>
      </footer>
      {notice && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg border border-card-border bg-card px-4 py-3 text-center text-sm text-text shadow-lg"
        >
          {notice}
        </div>
      )}
    </>
  )
}
