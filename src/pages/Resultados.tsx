import { useEffect, useState } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import { getLatestLotteryResults, triggerLotteryFetch } from '@/services/lottery'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, RefreshCw, Trophy } from 'lucide-react'
import { format } from 'date-fns'

const formatBRL = (val: number | null | undefined) => {
  if (val === null || val === undefined) return 'Não divulgado'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const LOTERIA_META: Record<string, { name: string; color: string; bgColor: string }> = {
  mega_sena: { name: 'Mega-Sena', color: 'text-white', bgColor: 'bg-[#209869]' },
  lotofacil: { name: 'Lotofácil', color: 'text-white', bgColor: 'bg-[#930089]' },
  quina: { name: 'Quina', color: 'text-white', bgColor: 'bg-[#260085]' },
  lotomania: { name: 'Lotomania', color: 'text-white', bgColor: 'bg-[#f78100]' },
  timemania: { name: 'Timemania', color: 'text-[#049645]', bgColor: 'bg-[#fff600]' },
  dupla_sena: { name: 'Dupla Sena', color: 'text-white', bgColor: 'bg-[#a61324]' },
  federal: { name: 'Federal', color: 'text-white', bgColor: 'bg-[#0039a6]' },
  loteca: { name: 'Loteca', color: 'text-white', bgColor: 'bg-[#d30836]' },
  dia_de_sorte: { name: 'Dia de Sorte', color: 'text-white', bgColor: 'bg-[#cb8510]' },
  super_sete: { name: 'Super Sete', color: 'text-[#049645]', bgColor: 'bg-[#a8d052]' },
  mais_milionaria: { name: '+Milionária', color: 'text-white', bgColor: 'bg-[#000000]' },
}

const NumberBall = ({ num, bg, color }: { num: string; bg: string; color: string }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${color}`}
    style={{ backgroundColor: bg }}
  >
    {num}
  </div>
)

const LoteriaCard = ({ loteriaKey, data }: { loteriaKey: string; data: any }) => {
  if (!data) return null
  const meta = LOTERIA_META[loteriaKey] || {
    name: loteriaKey,
    color: 'text-white',
    bgColor: 'bg-slate-700',
  }
  const {
    numero_concurso,
    data_sorteio,
    valor_premio_principal,
    acumulou,
    valor_estimado_proximo,
    numeros_sorteados,
  } = data

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div
        className={`p-4 flex justify-between items-center ${meta.color}`}
        style={{ backgroundColor: meta.bgColor }}
      >
        <h3 className="font-bold text-lg">{meta.name}</h3>
        <span className="text-sm opacity-90 font-medium">Conc. {numero_concurso || '---'}</span>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col gap-4 bg-white">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Sorteio: {data_sorteio || '---'}</span>
          {acumulou ? (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Acumulou
            </Badge>
          ) : (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Premiado</Badge>
          )}
        </div>

        {/* Regular Dezenas */}
        {numeros_sorteados && numeros_sorteados.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {numeros_sorteados.map((d: string, i: number) => (
              <NumberBall key={i} num={d} bg={meta.bgColor} color={meta.color} />
            ))}
          </div>
        )}

        {/* Mais Milionária Trevos */}
        {data.trevos_sorteados && data.trevos_sorteados.length > 0 && (
          <div className="flex flex-col items-center gap-1 border-t pt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Trevos</span>
            <div className="flex gap-2">
              {data.trevos_sorteados.map((t: string, i: number) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded text-white bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm rotate-45"
                >
                  <span className="-rotate-45">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dupla Sena */}
        {data.primeiro_sorteio && (
          <div className="flex flex-col gap-2 py-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                1º Sorteio
              </Badge>
              <div className="flex flex-wrap gap-1">
                {data.primeiro_sorteio.map((d: string, i: number) => (
                  <NumberBall key={i} num={d} bg={meta.bgColor} color={meta.color} />
                ))}
              </div>
            </div>
            {data.segundo_sorteio && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  2º Sorteio
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {data.segundo_sorteio.map((d: string, i: number) => (
                    <NumberBall key={i} num={d} bg={meta.bgColor} color={meta.color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Super Sete Colunas */}
        {data.colunas && data.colunas.length > 0 && (
          <div className="flex gap-2 justify-center py-2">
            {data.colunas.map((c: any, i: number) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 mb-1">C{c.coluna}</span>
                <div
                  className={`w-7 h-7 rounded border-2 border-[${meta.bgColor}] flex items-center justify-center font-bold text-sm`}
                  style={{ borderColor: meta.bgColor, color: meta.bgColor }}
                >
                  {c.numero}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timemania & Dia de Sorte */}
        {(data.time_coracao || data.mes_da_sorte) && (
          <div className="flex justify-center border-t pt-2">
            <Badge variant="outline" className="font-semibold px-3 py-1 bg-slate-50">
              {data.time_coracao && `Time do Coração: ${data.time_coracao}`}
              {data.mes_da_sorte && `Mês da Sorte: ${data.mes_da_sorte}`}
            </Badge>
          </div>
        )}

        {/* Federal Bilhetes */}
        {data.bilhetes_premiados && data.bilhetes_premiados.length > 0 && (
          <div className="flex flex-col gap-1 text-sm bg-slate-50 p-2 rounded-md border">
            {data.bilhetes_premiados.map((b: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center border-b last:border-0 pb-1 last:pb-0 border-slate-200"
              >
                <span className="text-slate-500">{b.premio}º</span>
                <span className="font-mono font-bold tracking-wider">{b.bilhete}</span>
                <span className="text-emerald-700 font-medium">{formatBRL(b.valor)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Loteca Jogos */}
        {data.jogos && data.jogos.length > 0 && (
          <div className="flex flex-col gap-1 text-xs bg-slate-50 p-2 rounded-md border h-32 overflow-y-auto">
            {data.jogos.map((j: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center border-b last:border-0 pb-1 border-slate-200"
              >
                <span className="truncate w-1/3 text-right">{j.equipe_casa}</span>
                <span className="font-bold bg-slate-200 px-2 py-0.5 rounded mx-1">{j.placar}</span>
                <span className="truncate w-1/3 text-left">{j.equipe_fora}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Prêmio:</span>
            <span className="font-semibold text-slate-800">
              {formatBRL(valor_premio_principal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Próx. Prêmio:</span>
            <span className="font-semibold text-emerald-700">
              {formatBRL(valor_estimado_proximo)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Resultados() {
  const [resultsData, setResultsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFetchingAI, setIsFetchingAI] = useState(false)
  const { toast } = useToast()

  const loadData = async () => {
    const res = await getLatestLotteryResults()
    if (res) setResultsData(res)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('lottery_results', () => {
    loadData()
  })

  const handleManualFetch = async () => {
    setIsFetchingAI(true)
    toast({
      title: 'Buscando resultados...',
      description:
        'O agente de IA está consultando as fontes oficiais. Isso pode levar alguns segundos.',
    })
    try {
      await triggerLotteryFetch()
      toast({
        title: 'Sucesso!',
        description: 'Os resultados foram atualizados com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar novos resultados agora.',
        variant: 'destructive',
      })
    } finally {
      setIsFetchingAI(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const loteriasList = [
    'mega_sena',
    'lotofacil',
    'quina',
    'lotomania',
    'timemania',
    'dupla_sena',
    'federal',
    'loteca',
    'dia_de_sorte',
    'super_sete',
    'mais_milionaria',
  ]

  const ultimosResultados = resultsData?.resultados?.loterias || {}
  const dataConsulta = resultsData?.resultados?.data_consulta
    ? format(new Date(resultsData.resultados.data_consulta), 'dd/MM/yyyy')
    : 'Desconhecida'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Resultados das Loterias
          </h2>
          <p className="text-slate-500 mt-1">
            Última consulta realizada pelo agente:{' '}
            <span className="font-medium">{dataConsulta}</span>
            {resultsData?.resultados?.hora_consulta &&
              ` às ${resultsData.resultados.hora_consulta}`}
          </p>
        </div>
        <Button
          onClick={handleManualFetch}
          disabled={isFetchingAI}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          {isFetchingAI ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isFetchingAI ? 'Agente Trabalhando...' : 'Forçar Atualização via IA'}
        </Button>
      </div>

      {!resultsData ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
            <Trophy className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">Nenhum resultado encontrado.</p>
            <p>Clique em atualizar para que a IA busque os dados recentes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loteriasList.map((key) => {
            const data = ultimosResultados[key]
            if (!data) return null
            return <LoteriaCard key={key} loteriaKey={key} data={data} />
          })}
        </div>
      )}
    </div>
  )
}
