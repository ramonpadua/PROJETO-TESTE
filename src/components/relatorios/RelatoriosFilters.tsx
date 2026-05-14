import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface RelatoriosFiltersProps {
  filters: {
    cliente: string
    dataInicio: string
    dataFim: string
    departamento: string
    aparelho: string
  }
  updateFilter: (key: string, value: string) => void
  clientes: any[]
  departamentos: any[]
  aparelhos: string[]
}

export function RelatoriosFilters({
  filters,
  updateFilter,
  clientes,
  departamentos,
  aparelhos,
}: RelatoriosFiltersProps) {
  const isClientSelected = !!filters.cliente && filters.cliente !== 'all'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" /> Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente (Obrigatório)</Label>
            <Select value={filters.cliente} onValueChange={(v) => updateFilter('cliente', v)}>
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Selecione...</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={filters.dataInicio}
              onChange={(e) => updateFilter('dataInicio', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={filters.dataFim}
              onChange={(e) => updateFilter('dataFim', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Select
              value={filters.departamento}
              onValueChange={(v) => updateFilter('departamento', v)}
              disabled={!isClientSelected}
            >
              <SelectTrigger id="departamento">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departamentos.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aparelho">Aparelho</Label>
            <Select
              value={filters.aparelho}
              onValueChange={(v) => updateFilter('aparelho', v)}
              disabled={!isClientSelected}
            >
              <SelectTrigger id="aparelho">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {aparelhos.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
