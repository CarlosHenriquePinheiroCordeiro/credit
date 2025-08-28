export const formatToBRL = (num?: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num ?? 0)
export const formatToDate = (str?: string) =>
  str ? new Date(str + (str.endsWith('Z') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR') : '-'
