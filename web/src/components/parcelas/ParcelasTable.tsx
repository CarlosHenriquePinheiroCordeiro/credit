import React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import SortHeader from "./SortHeader"

const fmtBRL = (n?: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n ?? 0)
const fmtDate = (s?: string) => (s ? new Date(s + (s.endsWith("Z") ? "" : "T00:00:00")).toLocaleDateString("pt-BR") : "-")

export type Order = "ASC" | "DESC"
export type SortKeyParcela =
  | "datavencimento"
  | "valorvencimento"
  | "totalpago"
  | "capitalaberto"
  | "createdAt"

export type Parcela = {
  datavencimento: string
  valorvencimento: number
  dataultimopagamento?: string | null
  totalpago?: number
  capitalaberto?: number
  createdAt?: string
}

export default function ParcelasTable({
  data,
  total,
  page,
  limit,
  loading,
  sort,
  order,
  onChangeSort,
}: {
  data: Parcela[]
  total: number
  page: number
  limit: number
  loading?: boolean
  sort?: SortKeyParcela
  order?: Order
  onChangeSort: (key: SortKeyParcela) => void
}) {
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortHeader label="Vencimento" active={sort === "datavencimento"} order={order} onSort={() => onChangeSort("datavencimento")} />
            </TableHead>
            <TableHead className="text-right">
              <SortHeader label="Valor" active={sort === "valorvencimento"} order={order} onSort={() => onChangeSort("valorvencimento")} alignRight />
            </TableHead>
            <TableHead>Último pagamento</TableHead>
            <TableHead className="text-right">
              <SortHeader label="Total pago" active={sort === "totalpago"} order={order} onSort={() => onChangeSort("totalpago")} alignRight />
            </TableHead>
            <TableHead className="text-right">
              <SortHeader label="Capital aberto" active={sort === "capitalaberto"} order={order} onSort={() => onChangeSort("capitalaberto")} alignRight />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p, idx) => (
            <TableRow key={idx} className="hover:bg-muted/50">
              <TableCell>{fmtDate(p.datavencimento)}</TableCell>
              <TableCell className="text-right">{fmtBRL(p.valorvencimento)}</TableCell>
              <TableCell>{fmtDate(p.dataultimopagamento ?? undefined)}</TableCell>
              <TableCell className="text-right">{fmtBRL(p.totalpago)}</TableCell>
              <TableCell className="text-right">{fmtBRL(p.capitalaberto)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground border-t border-border">
        <span>Página {page} • {Math.max(1, Math.ceil((total ?? 0) / (limit || 10)))} </span>
        <span>{total ?? 0} registro(s)</span>
      </div>
    </div>
  )
}
