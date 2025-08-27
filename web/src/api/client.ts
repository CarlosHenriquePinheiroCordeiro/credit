// =============================================================
// File: src/api/client.ts
// Axios client + helper to build query strings
// =============================================================
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

export type Order = 'ASC' | 'DESC'
export type SortKey = 'data' | 'contrato' | 'valortotal' | 'valorentrada' | 'valorfinanciado'

export type ListContratosQuery = {
  contratoLike?: string
  dataFrom?: string
  dataTo?: string
  minValorTotal?: string
  maxValorTotal?: string
  hasEntrada?: string // 'true' | 'false'
  page?: number
  limit?: number
  sort?: SortKey
  order?: Order
}

export function toQueryString(params: Record<string, any>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    q.set(k, String(v))
  })
  return q.toString()
}