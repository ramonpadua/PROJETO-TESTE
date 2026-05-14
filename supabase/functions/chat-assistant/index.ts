import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('api_gemini')

    // Use anon key with user's auth token so RLS is automatically applied
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const { question, filters } = await req.json()

    let aiFilters = { ...filters }

    // Attempt to extract filters from natural language if API key is present
    if (geminiApiKey) {
      const extractPrompt = `
      Você é um assistente de IA. O usuário fez uma pergunta sobre relatórios de telefonia: "${question}"
      
      Extraia os seguintes filtros (se mencionados na pergunta):
      - cliente_nome (string)
      - departamento_nome (string)
      - aparelho (string)
      - data_inicio (YYYY-MM-DD)
      - data_fim (YYYY-MM-DD)
      
      Considere que referências como "maio", "este mês", "ontem" devem ser convertidas para as datas correspondentes no ano atual (${new Date().getFullYear()}).
      
      Responda APENAS com um JSON válido. Não inclua Markdown (\`\`\`json).
      Exemplo: {"cliente_nome": "Empresa X", "data_inicio": "2023-05-01"}
      Se nada for encontrado, retorne {}.
      `

      try {
        const aiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
        const aiRes = await fetch(aiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: extractPrompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
          }),
        })

        if (aiRes.ok) {
          const aiData = await aiRes.json()
          const textResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (textResponse) {
            const extracted = JSON.parse(textResponse)
            if (extracted.cliente_nome && !aiFilters.cliente_id)
              aiFilters.cliente_nome = extracted.cliente_nome
            if (extracted.departamento_nome)
              aiFilters.departamento_nome = extracted.departamento_nome
            if (extracted.aparelho) aiFilters.aparelho = extracted.aparelho
            if (extracted.data_inicio) aiFilters.data_inicio = extracted.data_inicio
            if (extracted.data_fim) aiFilters.data_fim = extracted.data_fim
          }
        }
      } catch (e) {
        console.error('AI extraction error:', e)
      }
    }

    let query = supabase.from('ligacoes').select('*, clientes(nome), departamentos(nome)')

    // Apply Filters
    if (aiFilters.cliente_id) {
      query = query.eq('cliente_id', aiFilters.cliente_id)
    } else if (aiFilters.cliente_nome) {
      // Find cliente_id by name since RLS allows us to read what we have access to
      const { data: c } = await supabase
        .from('clientes')
        .select('id')
        .ilike('nome', `%${aiFilters.cliente_nome}%`)
      if (c && c.length > 0)
        query = query.in(
          'cliente_id',
          c.map((x) => x.id),
        )
    }

    if (aiFilters.departamento_nome) {
      const { data: d } = await supabase
        .from('departamentos')
        .select('id')
        .ilike('nome', `%${aiFilters.departamento_nome}%`)
      if (d && d.length > 0)
        query = query.in(
          'departamento_id',
          d.map((x) => x.id),
        )
    }

    if (aiFilters.aparelho) {
      query = query.ilike('aparelho', `%${aiFilters.aparelho}%`)
    }
    if (aiFilters.data_inicio) {
      query = query.gte('data', aiFilters.data_inicio)
    }
    if (aiFilters.data_fim) {
      query = query.lte('data', aiFilters.data_fim)
    }

    // Limit to 200 for AI processing to avoid massive payloads, but order by most recent
    const { data: resultData, error: queryError } = await query
      .order('data', { ascending: false })
      .order('hora', { ascending: false })
      .limit(200)

    if (queryError) throw queryError

    let message = `Encontramos ${resultData?.length || 0} ligações baseadas na sua pesquisa.`

    if (geminiApiKey && resultData && resultData.length > 0) {
      const summarizePrompt = `
      Você é a inteligência artificial "Adapta ONE" de um dashboard de telefonia.
      O usuário perguntou: "${question}"
      Sua busca no banco retornou ${resultData.length} ligações.
      Exemplo de alguns dados encontrados: ${JSON.stringify(resultData.slice(0, 3))}
      
      Formule uma resposta natural, direta e profissional.
      Resuma as informações de forma humanizada. Se o usuário perguntar por quantidades, dê o número exato encontrado (${resultData.length}).
      Não mencione "JSON", "banco de dados" ou "registros". Fale sempre de "ligações" ou "chamadas".
      `

      try {
        const aiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`
        const aiRes = await fetch(aiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: summarizePrompt }] }],
            generationConfig: { temperature: 0.5 },
          }),
        })

        if (aiRes.ok) {
          const aiData = await aiRes.json()
          const textResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (textResponse) {
            message = textResponse
          }
        }
      } catch (e) {
        console.error('AI summarization error:', e)
      }
    } else if (resultData?.length === 0) {
      message = 'Não encontrei nenhuma ligação com os parâmetros e filtros informados.'
    }

    return new Response(JSON.stringify({ message, data: resultData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
