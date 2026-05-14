import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, FileText, Table as TableIcon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  data?: any[]
  isError?: boolean
}

export default function ChatPage() {
  const { userProfile } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content:
        'Olá! Sou o Adapta ONE, seu assistente inteligente. Como posso ajudar com os dados de telefonia hoje? (Ex: "Quantas ligações o cliente X teve em maio?")',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [clientes, setClientes] = useState<any[]>([])
  const [selectedCliente, setSelectedCliente] = useState<string>('all')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [aparelho, setAparelho] = useState<string>('')

  useEffect(() => {
    const fetchClientes = async () => {
      let query = supabase.from('clientes').select('id, nome').order('nome')
      if (userProfile?.tipo !== 'admin' && userProfile?.cliente_id) {
        query = query.eq('id', userProfile.cliente_id)
      }
      const { data } = await query
      if (data) setClientes(data)
    }
    fetchClientes()
  }, [userProfile])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          question: userText,
          filters: {
            cliente_id: selectedCliente !== 'all' ? selectedCliente : null,
            data_inicio: dataInicio || null,
            data_fim: dataFim || null,
            aparelho: aparelho || null,
          },
        },
      })

      if (error) throw error

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: data.message || 'Aqui estão os resultados.',
          data: data.data,
        },
      ])
    } catch (err: any) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content:
            'Desculpe, ocorreu um erro ao processar sua pergunta. Verifique sua conexão e tente novamente.',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUserMsg) {
      setInput(lastUserMsg.content)
      setMessages((prev) => prev.filter((m) => !m.isError))
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Assistente IA (Adapta ONE)</h2>
            <p className="text-sm text-slate-500">
              Faça perguntas em linguagem natural sobre seus relatórios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Cliente (Filtro base)</label>
            <Select value={selectedCliente} onValueChange={setSelectedCliente}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todos os Clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Data Início</label>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Data Fim</label>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Aparelho</label>
            <Input
              placeholder="Ex: Ramal 10"
              value={aparelho}
              onChange={(e) => setAparelho(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4 md:p-6 bg-slate-50/30">
        <div className="space-y-6 max-w-4xl mx-auto pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div
                className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-blue-600 text-white',
                )}
              >
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={cn(
                  'flex flex-col gap-2 max-w-[85%] md:max-w-[75%]',
                  msg.role === 'user' ? 'items-end' : 'items-start',
                )}
              >
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : msg.isError
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-sm'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm',
                  )}
                >
                  {msg.content}
                </div>

                {msg.isError && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 mt-1"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" /> Tentar novamente
                  </Button>
                )}

                {msg.data && msg.data.length > 0 && (
                  <Card className="p-3 bg-white border-slate-200 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm mt-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <TableIcon className="h-4 w-4 text-emerald-600" />
                      <span>{msg.data.length} registros encontrados.</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-xs border-slate-200 hover:bg-slate-50"
                        onClick={() =>
                          exportToPDF(msg.data || [], 'relatorio-ia', `Pergunta: ${msg.content}`)
                        }
                      >
                        <FileText className="mr-2 h-3 w-3 text-red-500" />
                        Gerar PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-xs border-slate-200 hover:bg-slate-50"
                        onClick={() => exportToCSV(msg.data || [], 'relatorio-ia')}
                      >
                        <TableIcon className="mr-2 h-3 w-3 text-emerald-600" />
                        Gerar Excel
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                <div
                  className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="relative max-w-4xl mx-auto flex items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte à IA (ex: quais os ramais que mais ligaram hoje?)"
            className="pr-12 py-6 rounded-full border-slate-300 focus-visible:ring-primary/20 shadow-sm text-base"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-9 w-9 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
