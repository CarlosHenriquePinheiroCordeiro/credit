import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Search, Eye } from 'lucide-react'
import { SortHeader } from './SortHeader'
import { fetchDividaTotal, type Contrato } from '@/api/contratos'
import type { SortKey, Order } from '@/api/client'
import { formatToBRL, formatToDate } from '@/utils/formaters'
import MaiorValorAbertoModal from './MaiorValorAbertoModal'
import { useMutation } from '@tanstack/react-query'

export function ContractsTable({
  data,
  sort,
  order,
  onChangeSort,
  onDetail,
}: {
  data: Contrato[]
  loading?: boolean
  sort?: SortKey
  order?: Order
  onChangeSort: (key: SortKey) => void
  onDetail: (c: Contrato) => void
}) {

  const [showMaiorValor, setShowMaiorValor] = React.useState(false)
  const [dividaTotal, setDividaTotal] = React.useState<number | null>(null)
  const dividaMutation = useMutation({
    mutationFn: () => fetchDividaTotal("/contratos/endividamento-total"),
    onSuccess: ({ endividamento_total }) => setDividaTotal(endividamento_total),
  })

  const rows = data.map((c) => {
    return (
      <TableRow key={c.contrato} className="hover:bg-muted/50">
        <TableCell className="font-medium">{c.contrato}</TableCell>
        <TableCell>{formatToDate(c.data)}</TableCell>
        <TableCell className="text-right">{formatToBRL(c.valortotal)}</TableCell>
        <TableCell className="text-right">{formatToBRL(c.valorentrada)}</TableCell>
        <TableCell className="text-right">{formatToBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</TableCell>
        <TableCell className="text-center">{c.qtdParcelas}</TableCell>
        <TableCell className="text-right">{formatToBRL(c.totalPago)}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" onClick={() => onDetail(c)}>
            <Eye className="h-4 w-4 mr-1" /> Detalhar parcelas
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 pt-6">
      <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setShowMaiorValor(true)} className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Período de Maior Valor Aberto
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => dividaMutation.mutate()}
              disabled={dividaMutation.isPending}
              className="inline-flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Dívida Total: 
            </Button>

            {dividaTotal !== null && (
              <span className="text-sm font-medium">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(dividaTotal)}
              </span>
            )}
          </div>
        </div>

        <MaiorValorAbertoModal
          open={showMaiorValor}
          onOpenChange={setShowMaiorValor}
        />
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortHeader label="Contrato" active={sort === 'contrato'} order={order} onSort={() => onChangeSort('contrato')} />
                </TableHead>
                <TableHead>
                  <SortHeader label="Data" active={sort === 'data'} order={order} onSort={() => onChangeSort('data')} />
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader label="Valor total" active={sort === 'valortotal'} order={order} onSort={() => onChangeSort('valortotal')} />
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader label="Entrada" active={sort === 'valorentrada'} order={order} onSort={() => onChangeSort('valorentrada')} />
                </TableHead>
                <TableHead className="text-right">
                  <SortHeader label="Financiado" active={sort === 'valorfinanciado'} order={order} onSort={() => onChangeSort('valorfinanciado')} />
                </TableHead>
                <TableHead className="text-center">Parcelas</TableHead>
                <TableHead className="text-right">Total pago</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{rows}</TableBody>
          </Table>
        </div>

        <div className="grid md:hidden gap-3">
          {data.map((c) => {
            return (
              <Card key={c.contrato} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Contrato {c.contrato}</span>
                    <Button size="sm" onClick={() => onDetail(c)}>
                      <Eye className="h-4 w-4 mr-1" /> Parcelas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  <span className="opacity-60">Data</span>
                  <span className="text-right">{formatToDate(c.data)}</span>
                  <span className="opacity-60">Valor total</span>
                  <span className="text-right">{formatToBRL(c.valortotal)}</span>
                  <span className="opacity-60">Entrada</span>
                  <span className="text-right">{formatToBRL(c.valorentrada)}</span>
                  <span className="opacity-60">Financiado</span>
                  <span className="text-right">{formatToBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</span>
                  <span className="opacity-60">Parcelas</span>
                  <span className="text-right">{c.qtdParcelas}</span>
                  <span className="opacity-60">Total pago</span>
                  <span className="text-right">{formatToBRL(c.totalPago)}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
