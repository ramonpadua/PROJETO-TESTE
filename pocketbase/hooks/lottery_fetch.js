routerAdd(
  'POST',
  '/backend/v1/lottery/fetch',
  (e) => {
    const systemPrompt = `Você é um agente especializado em extrair resultados das loterias da Caixa Econômica Federal do Brasil.
Sua tarefa é navegar na web (usando suas ferramentas de busca) para encontrar os ÚLTIMOS resultados oficiais (de hoje ou o mais recente) para TODAS as 11 loterias.
Você DEVE confirmar cada resultado em pelo menos 2 fontes diferentes (ex: site da Caixa e portal de notícias como G1, UOL ou Estadão) para garantir a integridade dos dados antes de incluí-lo.

Retorne APENAS um objeto JSON válido, sem NENHUM texto antes, depois, ou blocos markdown.
Se um campo não estiver disponível, retorne null. O valor de 'premio' e 'proximo_premio' deve ser numérico.

Estrutura EXATA do JSON:
{
  "data_consulta": "YYYY-MM-DD",
  "hora_consulta": "HH:MM",
  "loterias": {
    "mega_sena": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01","02","03","04","05","06"], "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "lotofacil": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "premio": 1000000, "acumulou": false, "proximo_premio": 2000000 },
    "quina": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "lotomania": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "timemania": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "time_coracao": "FLAMENGO", "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "dupla_sena": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas_1": ["01", "02"], "dezenas_2": ["01", "02"], "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "federal": { "concurso": "1234", "data": "DD/MM/YYYY", "bilhetes": [{"premio": 1, "bilhete": "12345", "valor": 500000}] },
    "loteca": { "concurso": "1234", "data": "DD/MM/YYYY", "jogos": [{"jogo": 1, "equipe_casa": "A", "placar": "1x0", "equipe_fora": "B"}] },
    "dia_de_sorte": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "mes_sorte": "JANEIRO", "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 },
    "super_sete": { "concurso": "1234", "data": "DD/MM/YYYY", "colunas": [{"coluna": 1, "numero": "5"}] },
    "mais_milionaria": { "concurso": "1234", "data": "DD/MM/YYYY", "dezenas": ["01", "02"], "trevos": ["1","2"], "premio": 1000000, "acumulou": true, "proximo_premio": 2000000 }
  }
}`

    try {
      const reply = $ai.chat({
        model: 'reasoning',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content:
              'Busque os resultados das loterias da Caixa agora e verifique em múltiplas fontes. Retorne apenas o JSON final validado.',
          },
        ],
      })

      let jsonStr = reply.choices[0].message.content
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (match) jsonStr = match[1]

      const data = JSON.parse(jsonStr.trim())
      const collection = $app.findCollectionByNameOrId('lottery_results')
      const record = new Record(collection)

      let d = data.data_consulta || new Date().toISOString().split('T')[0]
      record.set('data_consulta', d + ' 00:00:00.000Z')
      record.set('resultados', data)
      $app.save(record)

      return e.json(200, { success: true, id: record.id })
    } catch (err) {
      $app.logger().error('Manual lottery fetch failed', 'error', err.message)
      return e.internalServerError('Falha ao buscar resultados. Tente novamente mais tarde.')
    }
  },
  $apis.requireAuth(),
)
