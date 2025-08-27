import React from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ContractsToolbar } from './ContratosToolbar'
import { ContractsTable } from './ContratosTable'
import { Contrato, fetchContratos, ListResponse } from '@/api/contratos'
import type { ListContratosQuery, SortKey, Order } from '@/api/client'
import { ChevronLeft, ChevronRight } from "lucide-react"
import ParcelasModal from '../parcelas/ParcelasModal'

export default function ContratosListPage({ endpoint = '/contratos' }: { endpoint?: string }) {
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [sort, setSort] = React.useState<SortKey>('data')
  const [order, setOrder] = React.useState<Order>('DESC')
  const [showParcelas, setShowParcelas] = React.useState(false)
  const [selectedContratoId, setSelectedContratoId] = React.useState<string | null>(null)

  const params: ListContratosQuery = {
    contratoLike: query || undefined,
    page,
    limit,
    sort,
    order,
  }

  const { data, isFetching, refetch } = useQuery<ListResponse<Contrato>>({
    queryKey: ['contratos', params],
    queryFn: () => fetchContratos(params, endpoint),
    placeholderData: keepPreviousData,
  })

  const total = data?.total ?? 0
  const contratos = data?.items ?? []

  const onChangeSort = (key: SortKey) => {
    if (key === sort) {
      setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      setSort(key)
      setOrder('ASC')
    }
    setPage(1)
  }

  const onDetail = (c: Contrato) => {
    setSelectedContratoId(c.contrato)
    setShowParcelas(true)
  }

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (limit || 10)))

  return (
    <div className="container mx-auto p-4 md:p-6">

      <div className="space-y-4">
        <ContractsToolbar
          query={query}
          setQuery={(v) => { setQuery(v); setPage(1) }}
          pageSize={limit}
          setPageSize={(n) => { setLimit(n); setPage(1) }}
          onRefresh={() => refetch()}
        />

        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-1 text-sm underline disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-sm opacity-70">Página {page} de {totalPages} - {`${total ?? 0} contrato(s)`}</span>
          
          <button
            className="flex items-center gap-1 text-sm underline disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching || (page * limit >= total)}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <ContractsTable
          data={contratos}
          sort={sort}
          order={order}
          onChangeSort={onChangeSort}
          onDetail={onDetail}
        />

        <ParcelasModal
          open={showParcelas}
          onOpenChange={setShowParcelas}
          contratoId={selectedContratoId}
          endpoint="/parcelas"
        />

      </div>
    </div>
  )
}