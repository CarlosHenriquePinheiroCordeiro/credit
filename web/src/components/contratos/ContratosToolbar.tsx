import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RefreshCcw } from 'lucide-react'

export type ToolbarProps = {
  query: string
  setQuery: (s: string) => void
  pageSize: number
  setPageSize: (n: number) => void
  onRefresh: () => void
}

export function ContractsToolbar({ query, setQuery, pageSize, setPageSize, onRefresh }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código do contrato…"
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        Registros por página:
        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
          <SelectTrigger>
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>
    </div>
  )
}
