import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Order } from '@/api/client'

export function SortHeader({
  label,
  active,
  order,
  onSort,
}: {
  label: string
  active: boolean
  order?: Order
  onSort: () => void
}) {
  const Icon = !active ? ArrowUpDown : order === 'ASC' ? ArrowUp : ArrowDown
  return (
    <Button variant="ghost" className="px-0 font-normal" onClick={onSort}>
      <span className="mr-2">{label}</span>
      <Icon className="h-4 w-4" />
    </Button>
  )
}
