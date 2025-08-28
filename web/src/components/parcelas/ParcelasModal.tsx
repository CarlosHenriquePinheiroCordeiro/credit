import React from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ParcelasTable from './ParcelasTable'
import { fetchParcelas } from '../../api/parcelas'
import type { Parcela } from '../../api/parcelas'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select'

type Order = 'ASC' | 'DESC'
type SortKeyParcela =
  | 'datavencimento'
  | 'valorvencimento'
  | 'totalpago'
  | 'capitalaberto'
  | 'createdAt'

export default function ParcelasModal({
  open,
  onOpenChange,
  contratoId,
  endpoint = '/parcelas',
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  contratoId: string | null
  endpoint?: string
}) {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [sort, setSort] = React.useState<SortKeyParcela>('datavencimento')
  const [order, setOrder] = React.useState<Order>('ASC')

  React.useEffect(() => {
    setPage(1)
  }, [contratoId])

  const queryParams = React.useMemo(
    () => ({
      contratoId: contratoId ?? '',
      page,
      limit,
      sort,
      order,
    }),
    [contratoId, page, limit, sort, order],
  )

  const { data, isFetching } = useQuery({
    enabled: open && !!contratoId,
    queryKey: ['parcelas', queryParams],
    queryFn: () => fetchParcelas(queryParams, endpoint),
    placeholderData: keepPreviousData,
  })

  const total = data?.total ?? 0
  const parcelas = data?.items ?? []

  const onChangeSort = (key: SortKeyParcela) => {
    if (key === sort) {
      setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSort(key)
      setOrder('ASC')
    }
    setPage(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Parcelas</DialogTitle>
          <DialogDescription>
            Contrato: <span className="font-medium">{contratoId ?? '-'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <ParcelasTable
            data={parcelas as Parcela[]}
            total={total}
            page={page}
            limit={limit}
            loading={isFetching}
            sort={sort}
            order={order}
            onChangeSort={onChangeSort}
          />

          {/* Pager + page size */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching || page * limit >= total}
              >
                Próxima <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm opacity-70">Registros por página:</span>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  const newLimit = Number(v)
                  setLimit(newLimit > 12 ? 12 : newLimit)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Itens" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 12].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
