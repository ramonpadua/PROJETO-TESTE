routerAdd(
  'POST',
  '/backend/v1/lottery/fetch',
  (e) => {
    // Integração de Secret para uso em verificação externa (se necessário)
    const geminiSecret = $secrets.get('GEMINI_API') || ''
    if (geminiSecret) {
      $app
        .logger()
        .info('GEMINI_API secret read for external verification', 'length', geminiSecret.length)
    }

    const systemPrompt = `Você é um Agente de monitoramento de loterias especializado em extrair resultados das loterias da Caixa Econômica Federal do Brasil.
Sua tarefa é navegar na web (usando suas ferramentas de busca) para encontrar os ÚLTIMOS resultados oficiais (de hoje ou o mais recente) para TODAS as 11 loterias.
Você DEVE confirmar cada resultado em pelo menos 2 fontes diferentes (ex: site da Caixa e portal de notícias como G1, UOL ou Estadão) para garantir a integridade dos dados antes de incluí-lo.

Retorne APENAS um objeto JSON válido, sem NENHUM texto antes, depois, ou blocos markdown.
Se um campo não estiver disponível, retorne null. Os valores financeiros devem ser numéricos.

Estrutura EXATA do JSON:
{
  "data_consulta": "YYYY-MM-DD",
  "hora_consulta": "HH:MM",
  "loterias": {
    "mega_sena": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01","02","03","04","05","06"], "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "lotofacil": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "valor_premio_principal": 1000000, "acumulou": false, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 1, "data_proximo_sorteio": "DD/MM/YYYY" },
    "quina": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "lotomania": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "timemania": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "time_coracao": "FLAMENGO", "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "dupla_sena": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "primeiro_sorteio": ["01", "02"], "segundo_sorteio": ["01", "02"], "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "federal": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "bilhetes_premiados": [{"premio": 1, "bilhete": "12345", "valor": 500000}], "acumulou": false, "valor_premio_principal": 500000, "valor_estimado_proximo": 500000, "ganhadores_faixa_principal": 1, "data_proximo_sorteio": "DD/MM/YYYY" },
    "loteca": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "jogos": [{"jogo": 1, "equipe_casa": "A", "placar": "1x0", "equipe_fora": "B"}], "acumulou": true, "valor_premio_principal": 1000000, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "dia_de_sorte": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "mes_da_sorte": "JANEIRO", "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "super_sete": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "colunas": [{"coluna": 1, "numero": "5"}], "acumulou": true, "valor_premio_principal": 1000000, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" },
    "mais_milionaria": { "numero_concurso": "1234", "data_sorteio": "DD/MM/YYYY", "numeros_sorteados": ["01", "02"], "trevos_sorteados": ["1","2"], "valor_premio_principal": 1000000, "acumulou": true, "valor_estimado_proximo": 2000000, "ganhadores_faixa_principal": 0, "data_proximo_sorteio": "DD/MM/YYYY" }
  }
}`

    try {
      const reply = $ai.chat({
        model: 'fast',
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
