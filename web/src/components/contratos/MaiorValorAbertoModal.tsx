import React from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { postMaiorValorAberto } from '../../api/contratos'
import { formatToBRL } from '@/utils/formaters'

export default function MaiorValorAbertoModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [file, setFile] = React.useState<File | null>(null)
  const [result, setResult] = React.useState<{ mes: string; total_aberto: number } | null>(null)

  const mutation = useMutation({
    mutationFn: (f: File) => postMaiorValorAberto(f),
    onSuccess: (data) => setResult(data),
  })

  const handleSubmit = () => {
    if (!file) return
    mutation.mutate(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg text-foreground">
        {' '}
        {/* <-- garante contraste */}
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Consultar período de maior valor aberto
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Insira um arquivo JSON válido e clique em "Enviar"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            type="file"
            accept="application/json"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setFile(f)
              setResult(null)
            }}
          />

          {result && (
            <div className="p-3 rounded-md border border-border bg-muted text-sm text-card-foreground">
              <p>
                <span className="font-medium">Mês:</span> {result.mes}
              </p>
              <p>
                <span className="font-medium">Valor Total Aberto:</span>{' '}
                {formatToBRL(result.total_aberto)}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!file || mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
