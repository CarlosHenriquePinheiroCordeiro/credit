import React from 'react'
import ContratosListPage from '@/components/contratos/ContratosListPage'
import PageHeader from '@/components/common/PageHeader'

export function Contratos() {
  return (
    <>
      <PageHeader title="Contratos" />
      <ContratosListPage endpoint="/contratos" />
    </>
  )
}
