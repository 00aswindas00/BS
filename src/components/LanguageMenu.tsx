import { useEffect, useRef, useState } from 'react'
import { GlobeIcon } from '../icons/GlobeIcon'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
] as const

const STORAGE_KEY = 'bclone_language'

export function LanguageMenu() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? 'en'
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === selected) ?? LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectLanguage(code: string) {
    setSelected(code)
    localStorage.setItem(STORAGE_KEY, code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-text"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <GlobeIcon className="text-muted" />
        {current.label}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 z-50 mb-2 min-w-[120px] overflow-hidden rounded-lg border border-card-border bg-card py-1 shadow-lg"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={selected === lang.code}>
              <button
                type="button"
                onClick={() => selectLanguage(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-card-border ${
                  selected === lang.code ? 'text-accent' : 'text-text'
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
