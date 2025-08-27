import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, FileDown, Eye } from "lucide-react";
import { motion } from "framer-motion";

// ===================== Utils =====================
const fmtBRL = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n ?? 0);
const fmtDate = (s) => (s ? new Date(s + (s.endsWith("Z") ? "" : "T00:00:00")).toLocaleDateString("pt-BR") : "-");

// ===================== Pagination Hook =====================
function usePagination(items, pageSizeInitial = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeInitial);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  useEffect(() => {
    // reset to first page if items or pageSize change and current page would be out of range
    const newTotal = Math.max(1, Math.ceil(items.length / pageSize));
    if (page > newTotal) setPage(1);
  }, [items, pageSize]);

  return { page, setPage, pageSize, setPageSize, totalPages, current };
}

// ===================== Components =====================
function Toolbar({ query, setQuery, pageSize, setPageSize, onDownload }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 w-full md:w-1/2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código do contrato…"
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onDownload}>
          <FileDown className="h-4 w-4 mr-2" /> Exportar JSON
        </Button>
      </div>
    </div>
  );
}

function PaginationBar({ page, totalPages, setPage }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-sm opacity-70">Página {page} de {totalPages}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
          Próxima <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function ContratoRow({ c, onDetail }) {
  const totalParcelas = c.parcelas?.length ?? 0;
  const totalPago = c.parcelas?.reduce((acc, p) => acc + (p.totalpago ?? 0), 0) ?? 0;
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{c.contrato}</TableCell>
      <TableCell>{fmtDate(c.data)}</TableCell>
      <TableCell className="text-right">{fmtBRL(c.valortotal)}</TableCell>
      <TableCell className="text-right">{fmtBRL(c.valorentrada ?? 0)}</TableCell>
      <TableCell className="text-right">{fmtBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</TableCell>
      <TableCell className="text-center">{totalParcelas}</TableCell>
      <TableCell className="text-right">{fmtBRL(totalPago)}</TableCell>
      <TableCell className="text-right">
        <Button size="sm" onClick={() => onDetail(c)}>
          <Eye className="h-4 w-4 mr-1" /> Detalhar parcelas
        </Button>
      </TableCell>
    </TableRow>
  );
}

function ContratoCard({ c, onDetail }) {
  const totalParcelas = c.parcelas?.length ?? 0;
  const totalPago = c.parcelas?.reduce((acc, p) => acc + (p.totalpago ?? 0), 0) ?? 0;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Contrato {c.contrato}</span>
            <Button size="sm" onClick={() => onDetail(c)}>
              <Eye className="h-4 w-4 mr-1" /> Parcelas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm">
          <span className="opacity-60">Data</span>
          <span className="text-right">{fmtDate(c.data)}</span>
          <span className="opacity-60">Valor total</span>
          <span className="text-right">{fmtBRL(c.valortotal)}</span>
          <span className="opacity-60">Entrada</span>
          <span className="text-right">{fmtBRL(c.valorentrada ?? 0)}</span>
          <span className="opacity-60">Financiado</span>
          <span className="text-right">{fmtBRL(c.valorfinanciado ?? (c.valortotal - (c.valorentrada ?? 0)))}</span>
          <span className="opacity-60">Parcelas</span>
          <span className="text-right">{totalParcelas}</span>
          <span className="opacity-60">Total pago</span>
          <span className="text-right">{fmtBRL(totalPago)}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===================== Main Page =====================
/**
 * Props:
 * - data?: { contratos: Contrato[] }
 * - fetchUrl?: string (optional URL to fetch JSON with shape {contratos: Contrato[]})
 */
export default function ContratosListPage({ data, fetchUrl }) {
  const [contratos, setContratos] = useState(/** @type {Contrato[]} */(data?.contratos ?? []));
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);

  // Load from URL if provided and no data passed
  useEffect(() => {
    let active = true;
    async function load() {
      if (contratos.length || !fetchUrl) return;
      try {
        setPending(true);
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (active) setContratos(json?.contratos ?? []);
      } catch (e) {
        console.error("Erro ao carregar JSON:", e);
      } finally {
        setPending(false);
      }
    }
    load();
    return () => { active = false; };
  }, [fetchUrl]);

  // Client-side file import as a fallback (when neither data nor fetchUrl provided)
  const [localFileName, setLocalFileName] = useState("");
  const onLocalFile = async (file) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setContratos(json?.contratos ?? []);
      setLocalFileName(file.name);
    } catch (e) {
      alert("Arquivo inválido. Certifique-se que é um JSON com { contratos: [...] }.");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contratos;
    return contratos.filter((c) => String(c.contrato).toLowerCase().includes(q));
  }, [contratos, query]);

  const { page, setPage, pageSize, setPageSize, totalPages, current } = usePagination(filtered, 10);

  const handleExport = () => {
    const payload = { contratos: filtered };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contratos-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onDetail = (contrato) => {
    // Placeholder – navegação/drawer/modal será implementada depois
    console.log("Detalhar parcelas de", contrato.contrato);
    alert(`Detalhamento de parcelas do contrato ${contrato.contrato} será implementado.`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Listagem de Contratos</h1>
        <p className="text-sm opacity-70">Visualize, pesquise e pagina contratos. Clique em "Detalhar parcelas" para abrir o detalhamento (em breve).</p>
      </div>

      {/* Optional local file input */}
      {!contratos.length && !fetchUrl && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="text-sm">Carregue um arquivo JSON com o formato {"{ contratos: [...] }"}.</div>
              <input
                type="file"
                accept="application/json"
                onChange={(e) => e.target.files?.[0] && onLocalFile(e.target.files[0])}
              />
              {localFileName && <div className="text-xs opacity-60">{localFileName}</div>}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardContent className="space-y-4 pt-6">
          <Toolbar query={query} setQuery={setQuery} pageSize={pageSize} setPageSize={setPageSize} onDownload={handleExport} />

          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableCaption>{pending ? "Carregando…" : filtered.length ? `${filtered.length} contrato(s)` : "Nenhum contrato encontrado"}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead className="text-right">Entrada</TableHead>
                  <TableHead className="text-right">Financiado</TableHead>
                  <TableHead className="text-center"># Parcelas</TableHead>
                  <TableHead className="text-right">Total pago</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.map((c) => (
                  <ContratoRow key={c.contrato} c={c} onDetail={onDetail} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid md:hidden gap-3">
            {current.map((c) => (
              <ContratoCard key={c.contrato} c={c} onDetail={onDetail} />
            ))}
          </div>

          <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}