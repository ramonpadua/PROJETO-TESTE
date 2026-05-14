import { useState, useEffect, useMemo } from 'react'
import { format, isSameDay, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDashboard } from '@/contexts/dashboard-context'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Phone,
  Users,
  BarChart3,
  SearchX,
  AlertCircle,
  PhoneCall,
  Building2,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'

export interface CallRecord {
  id: string
  date: Date
  time: string
  client: string
  department: string
  device: string
  duration: string
}

export default function Index() {
  const [data, setData] = useState<CallRecord[]>([])
  const [clients, setClients] = useState<string[]>([])
  const [devices, setDevices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { isRefreshing, setRefreshing } = useDashboard()
  const { toast } = useToast()

  const [clientFilter, setClientFilter] = useState<string>('Todos')
  const [deviceFilter, setDeviceFilter] = useState<string>('Todos')
  const [dateStart, setDateStart] = useState<Date | undefined>()
  const [dateEnd, setDateEnd] = useState<Date | undefined>()

  const loadData = async () => {
    setLoading(true)
    setHasError(false)

    try {
      const { data: ligacoesData, error } = await supabase
        .from('ligacoes')
        .select(`
          id,
          data,
          hora,
          aparelho,
          duracao,
          clientes ( nome ),
          departamentos ( nome )
        `)
        .order('data', { ascending: false })
        .order('hora', { ascending: false })

      if (error) throw error

      if (ligacoesData) {
        const formattedData: CallRecord[] = ligacoesData.map((item: any) => ({
          id: item.id,
          date: new Date(item.data + 'T00:00:00'),
          time: item.hora.substring(0, 5),
          client: item.clientes?.nome || 'Desconhecido',
          department: item.departamentos?.nome || 'N/A',
          device: item.aparelho || 'Desconhecido',
          duration: item.duracao || '00:00',
        }))

        setData(formattedData)

        const uniqueClients = Array.from(new Set(formattedData.map((d) => d.client))).sort()
        const uniqueDevices = Array.from(new Set(formattedData.map((d) => d.device))).sort()

        setClients(uniqueClients)
        setDevices(uniqueDevices)
      } else {
        setData([])
      }
    } catch (err) {
      console.error(err)
      setHasError(true)
    } finally {
      setLoading(false)
      if (isRefreshing) {
        setRefreshing(false)
        toast({
          title: 'Dados atualizados',
          description: 'As informações foram atualizadas com sucesso.',
          className: 'border-emerald-500 bg-emerald-50 text-emerald-900',
        })
      }
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isRefreshing) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshing])

  const filteredData = useMemo(() => {
    let res = data
    if (clientFilter !== 'Todos') {
      res = res.filter((d) => d.client === clientFilter)
    }
    if (deviceFilter !== 'Todos') {
      res = res.filter((d) => d.device === deviceFilter)
    }
    if (dateStart) {
      res = res.filter((d) => startOfDay(d.date) >= startOfDay(dateStart))
    }
    if (dateEnd) {
      res = res.filter((d) => startOfDay(d.date) <= startOfDay(dateEnd))
    }
    return res
  }, [data, clientFilter, deviceFilter, dateStart, dateEnd])

  const todayCalls = useMemo(() => data.filter((d) => isSameDay(d.date, new Date())).length, [data])
  const activeClients = useMemo(() => new Set(data.map((d) => d.client)).size, [data])

  const depts = useMemo(() => {
    return data.reduce(
      (acc, curr) => {
        acc[curr.department] = (acc[curr.department] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [data])

  const totalDepts = useMemo(() => Object.values(depts).reduce((a, b) => a + b, 0), [depts])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:-translate-y-1 transition-transform duration-200 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Total de Ligações Hoje
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loading || isRefreshing ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-800">{todayCalls}</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Registradas no dia atual</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Clientes Ativos</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loading || isRefreshing ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-800">{activeClients}</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Total de clientes únicos</p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Ligações por Departamento
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loading || isRefreshing ? (
              <div className="space-y-2.5 mt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-2.5 mt-1">
                {Object.entries(depts).map(([dept, count]) => {
                  const percentage = totalDepts > 0 ? (count / totalDepts) * 100 : 0
                  return (
                    <div key={dept} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs items-center">
                        <span className="font-medium text-slate-700">{dept}</span>
                        <span className="text-slate-500 font-semibold">{count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cliente
              </Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os clientes</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Data Início
              </Label>
              <DatePicker date={dateStart} setDate={setDateStart} placeholder="Selecione a data" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Data Fim
              </Label>
              <DatePicker date={dateEnd} setDate={setDateEnd} placeholder="Selecione a data" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Aparelho
              </Label>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione um aparelho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os aparelhos</SelectItem>
                  {devices.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Histórico de Ligações</h2>

        {loading || isRefreshing ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-16 w-full rounded-lg bg-white border border-slate-100 shadow-sm"
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm">
            <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
            <p className="text-lg font-medium text-slate-700">Erro ao carregar dados</p>
            <p className="text-sm mt-1 mb-4">Ocorreu um problema de comunicação com o servidor.</p>
            <Button onClick={loadData} variant="outline" className="bg-white">
              Tentar novamente
            </Button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm">
            <SearchX className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-700">Nenhum dado encontrado</p>
            <p className="text-sm mt-1 text-slate-500">
              Tente ajustar os filtros selecionados para ver os resultados.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-600">Data</TableHead>
                    <TableHead className="font-semibold text-slate-600">Hora</TableHead>
                    <TableHead className="font-semibold text-slate-600">Cliente</TableHead>
                    <TableHead className="font-semibold text-slate-600">Departamento</TableHead>
                    <TableHead className="font-semibold text-slate-600">Aparelho</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">
                      Duração
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 20).map((call) => (
                    <TableRow key={call.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        {format(call.date, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-slate-600">{call.time}</TableCell>
                      <TableCell className="text-slate-700 font-medium">{call.client}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-primary">
                          {call.department}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{call.device}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-700">
                        {call.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden flex flex-col gap-3 animate-fade-in">
              {filteredData.slice(0, 20).map((call) => (
                <Card key={call.id} className="p-4 flex flex-col gap-3 border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">{call.client}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <CalendarIcon className="mr-1.5 h-3 w-3" />
                        {format(call.date, 'dd/MM/yyyy', { locale: ptBR })}
                        <Clock className="ml-3 mr-1.5 h-3 w-3" />
                        {call.time}
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {call.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t pt-3 mt-1">
                    <div className="flex items-center text-slate-600 font-medium text-xs bg-blue-50 text-primary px-2 py-1 rounded-md">
                      <Building2 className="mr-1.5 h-3 w-3" />
                      {call.department}
                    </div>
                    <div className="flex items-center text-slate-600 text-xs font-medium bg-slate-50 px-2 py-1 rounded-md">
                      <PhoneCall className="mr-1.5 h-3 w-3 text-slate-400" />
                      {call.device}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
