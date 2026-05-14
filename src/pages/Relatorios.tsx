import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { FileText, RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RelatoriosFilters } from '@/components/relatorios/RelatoriosFilters'
import { RelatoriosTable } from '@/components/relatorios/RelatoriosTable'
import { RelatoriosPagination } from '@/components/relatorios/RelatoriosPagination'

export default function Relatorios() {
  const [clientes, setClientes] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [aparelhos, setAparelhos] = useState<string[]>([])

  const [filters, setFilters] = useState({
    cliente: '',
    dataInicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dataFim: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    departamento: 'all',
    aparelho: 'all',
  })

  const [ligacoes, setLigacoes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 50

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => {
      if (key === 'cliente') {
        return { ...prev, cliente: value, departamento: 'all', aparelho: 'all' }
      }
      return { ...prev, [key]: value }
    })
    setPage(0)
  }

  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase.from('clientes').select('id, nome').order('nome')
      if (data) setClientes(data)
    }
    fetchClientes()
  }, [])

  useEffect(() => {
    if (!filters.cliente || filters.cliente === 'all') {
      setDepartamentos([])
      setAparelhos([])
      return
    }

    const fetchDeps = async () => {
      const { data } = await supabase
        .from('departamentos')
        .select('id, nome')
        .eq('cliente_id', filters.cliente)
        .order('nome')
      if (data) setDepartamentos(data)
    }

    const fetchAparelhos = async () => {
      const { data } = await supabase
        .from('ligacoes')
        .select('aparelho')
        .eq('cliente_id', filters.cliente)
      if (data) {
        const unique = Array.from(new Set(data.map((d) => d.aparelho).filter(Boolean))) as string[]
        setAparelhos(unique.sort())
      }
    }

    fetchDeps()
    fetchAparelhos()
  }, [filters.cliente])

  const fetchLigacoes = useCallback(async () => {
    if (!filters.cliente || filters.cliente === 'all') {
      setLigacoes([])
      setTotalCount(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('ligacoes')
        .select(
          'id, data, hora, pessoa_que_ligou, aparelho, duracao, clientes(nome), departamentos(nome)',
          { count: 'exact' },
        )
        .eq('cliente_id', filters.cliente)

      if (filters.dataInicio) query = query.gte('data', filters.dataInicio)
      if (filters.dataFim) query = query.lte('data', filters.dataFim)
      if (filters.departamento && filters.departamento !== 'all')
        query = query.eq('departamento_id', filters.departamento)
      if (filters.aparelho && filters.aparelho !== 'all')
        query = query.eq('aparelho', filters.aparelho)

      query = query.order('data', { ascending: false }).order('hora', { ascending: false })

      const {
        data,
        error: fetchError,
        count,
      } = await query.range(page * limit, (page + 1) * limit - 1)

      if (fetchError) throw fetchError

      setLigacoes(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchLigacoes()
  }, [fetchLigacoes])

  const fetchAllForExport = async () => {
    if (!filters.cliente || filters.cliente === 'all') return []
    let query = supabase
      .from('ligacoes')
      .select(
        'id, data, hora, pessoa_que_ligou, aparelho, duracao, clientes(nome), departamentos(nome)',
      )
      .eq('cliente_id', filters.cliente)

    if (filters.dataInicio) query = query.gte('data', filters.dataInicio)
    if (filters.dataFim) query = query.lte('data', filters.dataFim)
    if (filters.departamento && filters.departamento !== 'all')
      query = query.eq('departamento_id', filters.departamento)
    if (filters.aparelho && filters.aparelho !== 'all')
      query = query.eq('aparelho', filters.aparelho)

    query = query.order('data', { ascending: false }).order('hora', { ascending: false })
    const { data } = await query
    return data || []
  }

  const generateExcel = async () => {
    const data = await fetchAllForExport()
    if (!data.length) return

    const headers = [
      'Dia',
      'Pessoa que ligou',
      'Hora',
      'Departamento',
      'Cliente',
      'Aparelho',
      'Duração',
    ]
    const rows = data.map((d) => [
      d.data ? format(parseISO(d.data), 'dd/MM/yyyy') : '',
      d.pessoa_que_ligou || '',
      d.hora || '',
      d.departamentos?.nome || '',
      d.clientes?.nome || '',
      d.aparelho || '',
      d.duracao || '',
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Relatorio_Ligacoes_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDF = async () => {
    const data = await fetchAllForExport()
    if (!data.length) return

    const clienteNome = clientes.find((c) => c.id === filters.cliente)?.nome || 'Todos'
    const depNome =
      filters.departamento !== 'all'
        ? departamentos.find((d) => d.id === filters.departamento)?.nome || 'Todos'
        : 'Todos'

    const win = window.open('', '', 'width=1024,height=768')
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Relatório de Ligações</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .meta { font-size: 12px; color: #666; text-align: right; }
            .filters { margin-bottom: 20px; font-size: 14px; background: #f8fafc; padding: 10px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">TeleGestão</div>
            <div class="meta">Relatório gerado em:<br/><strong>${format(new Date(), 'dd/MM/yyyy HH:mm')}</strong></div>
          </div>
          <div class="filters">
            <strong>Filtros Aplicados:</strong><br/>
            Cliente: ${clienteNome} | Período: ${filters.dataInicio ? format(parseISO(filters.dataInicio), 'dd/MM/yyyy') : '-'} a ${filters.dataFim ? format(parseISO(filters.dataFim), 'dd/MM/yyyy') : '-'} <br/>
            Departamento: ${depNome} | Aparelho: ${filters.aparelho === 'all' ? 'Todos' : filters.aparelho}
          </div>
          <table>
            <thead>
              <tr><th>Dia</th><th>Pessoa que ligou</th><th>Hora</th><th>Departamento</th><th>Cliente</th><th>Aparelho</th><th>Duração</th></tr>
            </thead>
            <tbody>
              ${data.map((d) => `<tr><td>${d.data ? format(parseISO(d.data), 'dd/MM/yyyy') : '-'}</td><td>${d.pessoa_que_ligou || '-'}</td><td>${d.hora || '-'}</td><td>${d.departamentos?.nome || '-'}</td><td>${d.clientes?.nome || '-'}</td><td>${d.aparelho || '-'}</td><td>${d.duracao || '-'}</td></tr>`).join('')}
            </tbody>
          </table>
          <script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},500);}</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  const isExportDisabled = !filters.cliente || filters.cliente === 'all' || ligacoes.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Relatórios</h2>
          <p className="text-slate-500">
            Histórico detalhado de ligações com filtros e exportação.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateExcel}
            disabled={isExportDisabled}
            className="bg-white"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Excel
          </Button>
          <Button
            variant="outline"
            onClick={generatePDF}
            disabled={isExportDisabled}
            className="bg-white"
          >
            <FileText className="mr-2 h-4 w-4 text-red-600" /> PDF
          </Button>
        </div>
      </div>

      <RelatoriosFilters
        filters={filters}
        updateFilter={updateFilter}
        clientes={clientes}
        departamentos={departamentos}
        aparelhos={aparelhos}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dados</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchLigacoes}>
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <RelatoriosTable
        ligacoes={ligacoes}
        isLoading={isLoading}
        isClientSelected={!!filters.cliente && filters.cliente !== 'all'}
      />

      {!isLoading && ligacoes.length > 0 && (
        <RelatoriosPagination page={page} setPage={setPage} totalCount={totalCount} limit={limit} />
      )}
    </div>
  )
}
