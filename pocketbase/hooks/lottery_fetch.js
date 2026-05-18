routerAdd(
  'POST',
  '/backend/v1/lottery/fetch',
  (e) => {
    // Integração de Secret para uso em verificação externa
    const geminiSecret = $secrets.get('GEMINI_API') || ''
    if (geminiSecret) {
      $app.logger().info('GEMINI_API secret read for AI integration', 'length', geminiSecret.length)
    } else {
      $app.logger().warn('GEMINI_API secret is not configured')
    }

    const systemPrompt = `Você é um Agente de monitoramento de loterias especializado em extrair resultados das loterias da Caixa Econômica Federal do Brasil.
Sua tarefa é encontrar os ÚLTIMOS resultados oficiais (de hoje ou o mais recente) para TODAS as 11 loterias.

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
      $app.logger().info('Starting lottery fetch processing')

      let reply
      try {
        reply = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content:
                'Retorne APENAS o JSON final com os resultados mais recentes. Certifique-se de que é um JSON válido.',
            },
          ],
        })
      } catch (aiErr) {
        $app.logger().error('AI Request failed', 'error', aiErr.message)
        return e.json(200, { success: false, error: 'Falha na comunicação com o modelo de IA.' })
      }

      if (!reply?.choices?.[0]?.message?.content) {
        $app.logger().warn('Invalid AI response structure')
        return e.json(200, { success: false, error: 'Resposta inválida da IA.' })
      }

      let jsonStr = reply.choices[0].message.content
      const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (match) {
        jsonStr = match[1]
      }
      jsonStr = jsonStr.trim()

      let data
      try {
        const firstBrace = jsonStr.indexOf('{')
        const lastBrace = jsonStr.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1) {
          data = JSON.parse(jsonStr.substring(firstBrace, lastBrace + 1))
        } else {
          data = JSON.parse(jsonStr)
        }
      } catch (parseErr) {
        $app
          .logger()
          .error('Failed to parse AI JSON', 'response', jsonStr, 'error', parseErr.message)
        return e.json(200, {
          success: false,
          error: 'O formato dos dados retornados não pôde ser processado.',
        })
      }

      if (!data || !data.loterias) {
        $app.logger().warn('JSON is missing "loterias" field')
        return e.json(200, { success: false, error: 'Estrutura de dados incorreta retornada.' })
      }

      const collection = $app.findCollectionByNameOrId('lottery_results')
      const record = new Record(collection)

      let d = data.data_consulta || new Date().toISOString().split('T')[0]
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        d = d + ' 00:00:00.000Z'
      } else {
        try {
          d = new Date(d).toISOString()
        } catch (_) {
          d = new Date().toISOString()
        }
      }

      record.set('data_consulta', d)
      record.set('resultados', data)
      $app.save(record)

      $app.logger().info('Lottery results saved successfully', 'recordId', record.id)
      return e.json(200, { success: true, id: record.id })
    } catch (err) {
      $app.logger().error('Unexpected error during lottery fetch', 'error', err.message)
      return e.json(200, {
        success: false,
        error: 'Ocorreu um erro interno durante o processamento. Verifique os logs.',
      })
    }
  },
  $apis.requireAuth(),
)
