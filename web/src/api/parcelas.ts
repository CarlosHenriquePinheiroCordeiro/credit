import { api, toQueryString } from '../api/client'

export type Parcela = {
  datavencimento: string
  valorvencimento: number
  dataultimopagamento?: string | null
  totalpago?: number
  capitalaberto?: number
  createdAt?: string
}

export type ListResponse<T> = {
  items: T[]
  page: number
  limit: number
  total: number
}

export type Order = 'ASC' | 'DESC'
export type SortKeyParcela =
  | 'datavencimento'
  | 'valorvencimento'
  | 'totalpago'
  | 'capitalaberto'
  | 'createdAt'

export type ListParcelasQuery = {
  contratoId: string
  vencFrom?: string
  vencTo?: string
  hasPayment?: string
  hasOpenCapital?: string
  page?: number
  limit?: number
  sort?: SortKeyParcela
  order?: Order
}

export async function fetchParcelas(query: ListParcelasQuery, endpoint = '/parcelas') {
  const qs = toQueryString(query as Record<string, unknown>)
  const url = `http://localhost:3000/api${endpoint}?${qs}`
  const { data } = await api.get<ListResponse<Parcela>>(url)
  return data
}
