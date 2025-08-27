import { api, toQueryString, type ListContratosQuery } from './client'

export type Contrato = {
  contrato: string
  data: string
  valortotal: number
  valorentrada?: number
  valorfinanciado?: number
}

export type ListResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
}

export async function fetchContratos(query: ListContratosQuery, endpoint = '/contratos') {
  const qs = toQueryString(query)
  const url = `http://localhost:3000/api${endpoint}?${qs}`
  const { data } = await api.get<ListResponse<Contrato>>(url)
  return data
}
