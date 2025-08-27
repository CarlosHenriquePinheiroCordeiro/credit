import React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "../../components/ui/button"

type Order = "ASC" | "DESC"

export default function SortHeader({
  label,
  active,
  order,
  onSort,
  alignRight,
}: {
  label: string
  active: boolean
  order?: Order
  onSort: () => void
  alignRight?: boolean
}) {
  const Icon = !active ? ArrowUpDown : order === "ASC" ? ArrowUp : ArrowDown
  return (
    <Button variant="ghost" className={`px-0 font-normal ${alignRight ? "justify-end w-full" : ""}`} onClick={onSort}>
      <span className={`mr-2 ${alignRight ? "hidden md:inline" : ""}`}>{label}</span>
      <Icon className="h-4 w-4" />
    </Button>
  )
}
