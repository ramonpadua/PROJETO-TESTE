export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return
  const headers = [
    'Data',
    'Hora',
    'Pessoa que ligou',
    'Departamento',
    'Cliente',
    'Aparelho',
    'Duração',
  ]
  const rows = data.map((item) => [
    item.data || '',
    item.hora || '',
    item.pessoa_que_ligou || '',
    item.departamentos?.nome || '',
    item.clientes?.nome || '',
    item.aparelho || '',
    item.duracao || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF(data: any[], filename: string, filtersDesc: string) {
  if (!data || data.length === 0) return
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #0f172a; }
          .meta { font-size: 14px; color: #64748b; }
          .filters { margin-bottom: 20px; font-size: 14px; background: #f8fafc; padding: 12px; border-radius: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Relatório de Ligações (Assistente IA)</div>
          <div class="meta">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        </div>
        <div class="filters">
          <strong>Contexto da Consulta:</strong><br/>
          ${filtersDesc}
        </div>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Pessoa que Ligou</th>
              <th>Departamento</th>
              <th>Cliente</th>
              <th>Aparelho</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map((item) => {
                let dateStr = item.data || ''
                if (dateStr) {
                  try {
                    dateStr = new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                  } catch {
                    /* intentionally ignored */
                  }
                }
                return `
              <tr>
                <td>${dateStr}</td>
                <td>${item.hora || ''}</td>
                <td>${item.pessoa_que_ligou || ''}</td>
                <td>${item.departamentos?.nome || ''}</td>
                <td>${item.clientes?.nome || ''}</td>
                <td>${item.aparelho || ''}</td>
                <td>${item.duracao || ''}</td>
              </tr>
            `
              })
              .join('')}
          </tbody>
        </table>
        <script>
          window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }
        </script>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}
