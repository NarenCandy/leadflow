import type { PaginationMeta } from '../../types/index'
import Button from './Button'

interface PaginationProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, pages, total, limit } = pagination

  if (pages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{start}–{end}</span> of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="text-xs px-3 py-1.5"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </Button>

        {/* Page numbers */}
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
          .reduce<(number | string)[]>((acc, p, idx, arr) => {
            if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
              acc.push('...')
            }
            acc.push(p)
            return acc
          }, [])
          .map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                  ${page === p
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {p}
              </button>
            )
          )}

        <Button
          variant="ghost"
          className="text-xs px-3 py-1.5"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  )
}

export default Pagination