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
  hasEntrada?: string
  page?: number
  limit?: number
  sort?: SortKey
  order?: Order
}

export function toQueryString(params: Record<string, unknown>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    q.set(k, String(v))
  })
  return q.toString()
}

export const urlApi = `${import.meta.env.VITE_API_BASE_URL}`