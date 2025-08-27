import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { SortHeader } from './SortHeader'
import type { Contrato } from '@/api/contratos'
import type { SortKey, Order } from '@/api/client'

const fmtBRL = (n?: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0)
const fmtDate = (s?: string) => (s ? new Date(s + (s.endsWith('Z') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR') : '-')

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

  const rows = data.map((c) => {
    return (
      <TableRow key={c.contrato} className="hover:bg-muted/50">
        <TableCell className="font-medium">{c.contrato}</TableCell>
        <TableCell>{fmtDate(c.data)}</TableCell>
        <TableCell className="text-right">{fmtBRL(c.valortotal)}</TableCell>
        <TableCell className="text-right">{fmtBRL(c.valorentrada)}</TableCell>
        <TableCell className="text-right">{fmtBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</TableCell>
        <TableCell className="text-center">{c.qtdParcelas}</TableCell>
        <TableCell className="text-right">{fmtBRL(c.totalPago)}</TableCell>
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
                  <span className="text-right">{fmtDate(c.data)}</span>
                  <span className="opacity-60">Valor total</span>
                  <span className="text-right">{fmtBRL(c.valortotal)}</span>
                  <span className="opacity-60">Entrada</span>
                  <span className="text-right">{fmtBRL(c.valorentrada)}</span>
                  <span className="opacity-60">Financiado</span>
                  <span className="text-right">{fmtBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</span>
                  <span className="opacity-60">Parcelas</span>
                  <span className="text-right">{c.qtdParcelas}</span>
                  <span className="opacity-60">Total pago</span>
                  <span className="text-right">{fmtBRL(c.totalPago)}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
