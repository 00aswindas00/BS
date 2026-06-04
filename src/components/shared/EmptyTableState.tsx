import { FileSearch } from 'lucide-react'

export function EmptyTableState({ message = 'No records' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-sidebar-active text-muted">
        <FileSearch size={32} strokeWidth={1.25} />
      </div>
      <p className="text-sm text-muted">{message}</p>
    </div>
  )
}
