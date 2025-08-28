import { api, toQueryString, type ListContratosQuery } from './client'

export type Contrato = {
  contrato: string
  data: string
  valortotal: number
  valorentrada?: number
  valorfinanciado?: number
  qtdParcelas?: number
  totalPago?: number
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

export async function postMaiorValorAberto(file: File, endpoint = "/maximo-aberto") {
  const url = `http://localhost:3000/api${endpoint}`
  const form = new FormData()
  form.append("file", file)
  const { data } = await api.post<{ mes: string; total_aberto: number }>(url, form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function fetchDividaTotal(endpoint = "/contratos/endividamento-total") {
  const url = `http://localhost:3000/api${endpoint}`
  const { data } = await api.get<{ endividamento_total: number }>(url)
  return data
}