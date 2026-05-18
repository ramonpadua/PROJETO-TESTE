import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DashboardProvider } from '@/contexts/dashboard-context'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Index from './pages/Index'
import Relatorios from './pages/Relatorios'
import Resultados from './pages/Resultados'
import Chat from './pages/Chat'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Carregando...
      </div>
    )
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <DashboardProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/configuracoes" element={<Index />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardProvider>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
