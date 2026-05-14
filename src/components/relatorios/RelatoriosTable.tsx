import { format, parseISO } from 'date-fns'
import { FileText, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface RelatoriosTableProps {
  ligacoes: any[]
  isLoading: boolean
  isClientSelected: boolean
}

export function RelatoriosTable({ ligacoes, isLoading, isClientSelected }: RelatoriosTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {!isClientSelected ? (
          <div className="p-12 text-center text-slate-500">
            <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Selecione um cliente</h3>
            <p>O filtro de cliente é obrigatório para visualizar o histórico de ligações.</p>
          </div>
        ) : isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : ligacoes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Nenhuma ligação encontrada</h3>
            <p>Não há registros que correspondam aos filtros selecionados.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Dia</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Pessoa que ligou</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Aparelho</TableHead>
                    <TableHead className="text-right">Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ligacoes.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">
                        {l.data ? format(parseISO(l.data), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell>{l.hora || '-'}</TableCell>
                      <TableCell>{l.pessoa_que_ligou || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {l.departamentos?.nome || '-'}
                        </span>
                      </TableCell>
                      <TableCell>{l.clientes?.nome || '-'}</TableCell>
                      <TableCell>{l.aparelho || '-'}</TableCell>
                      <TableCell className="text-right">{l.duracao || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {ligacoes.map((l) => (
                <div key={l.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900">
                        {l.pessoa_que_ligou || 'Desconhecido'}
                      </div>
                      <div className="text-sm text-slate-500">
                        {l.data ? format(parseISO(l.data), 'dd/MM/yyyy') : '-'} às {l.hora || '-'}
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {l.duracao || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs">Departamento</span>
                      <span className="font-medium text-slate-700">
                        {l.departamentos?.nome || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Aparelho</span>
                      <span className="font-medium text-slate-700">{l.aparelho || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
