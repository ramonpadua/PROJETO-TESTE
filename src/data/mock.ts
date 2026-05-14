import { subDays } from 'date-fns'

export const departments = ['Vendas', 'Suporte', 'Financeiro'] as const
export const devices = ['Ramal 101', 'Ramal 102', 'Ramal 103'] as const
export const clients = ['Ana Silva', 'Carlos Oliveira', 'Mariana Santos'] as const

export interface CallRecord {
  id: string
  date: Date
  time: string
  client: string
  department: string
  device: string
  duration: string
}

export const generateMockData = (): CallRecord[] => {
  const data: CallRecord[] = []
  const today = new Date()

  for (let i = 0; i < 50; i++) {
    const randomDaysOffset = Math.floor(Math.random() * 10)
    const recordDate = subDays(today, randomDaysOffset)

    // Ensure we have some calls specifically for today
    if (i < 8) {
      recordDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate())
    }

    const h = Math.floor(Math.random() * 10) + 8
    const m = Math.floor(Math.random() * 60)
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

    const durM = Math.floor(Math.random() * 15)
    const durS = Math.floor(Math.random() * 60)
    const duration = `${durM.toString().padStart(2, '0')}:${durS.toString().padStart(2, '0')}`

    data.push({
      id: `call-${i}-${Date.now()}`,
      date: recordDate,
      time,
      client: clients[Math.floor(Math.random() * clients.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      duration,
    })
  }

  // Sort descending by date and time
  return data.sort((a, b) => b.date.getTime() - a.date.getTime())
}
