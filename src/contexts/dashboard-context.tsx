import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DashboardContextType {
  isRefreshing: boolean
  triggerRefresh: () => void
  setRefreshing: (val: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isRefreshing, setRefreshing] = useState(false)

  const triggerRefresh = () => {
    setRefreshing(true)
  }

  return (
    <DashboardContext.Provider value={{ isRefreshing, triggerRefresh, setRefreshing }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
