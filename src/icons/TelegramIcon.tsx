export function TelegramIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#29A8E0" />
      <path
        fill="#fff"
        d="M5.5 11.5l11.5-4.5-2 10.5-3.5-2.5-2 1.5v-2l7.5-5.5-6 4.5z"
      />
    </svg>
  )
}
