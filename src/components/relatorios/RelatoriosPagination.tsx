import { Button } from '@/components/ui/button'

interface RelatoriosPaginationProps {
  page: number
  setPage: (updater: (p: number) => number) => void
  totalCount: number
  limit: number
}

export function RelatoriosPagination({
  page,
  setPage,
  totalCount,
  limit,
}: RelatoriosPaginationProps) {
  const totalPages = Math.ceil(totalCount / limit)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-medium">{page * limit + 1}</span> a{' '}
        <span className="font-medium">{Math.min((page + 1) * limit, totalCount)}</span> de{' '}
        <span className="font-medium">{totalCount}</span> resultados
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
