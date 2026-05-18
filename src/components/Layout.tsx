import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, FileText, Settings, RefreshCw, PhoneCall, Bot, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useDashboard } from '@/contexts/dashboard-context'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const { isRefreshing, triggerRefresh } = useDashboard()
  const { userProfile, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  const userName = userProfile?.name || 'Administrador'
  const userRole = 'Administrador'
  const initials = userName.substring(0, 2).toUpperCase()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <PhoneCall className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-slate-800">TeleGestão</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/relatorios'}>
                    <Link to="/relatorios">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Relatórios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/resultados'}>
                    <Link to="/resultados">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Resultados Loterias</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/chat'}>
                    <Link to="/chat">
                      <Bot className="mr-2 h-4 w-4" />
                      <span>Assistente IA</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/configuracoes'}>
                    <Link to="/configuracoes">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-slate-50 flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-2 md:hidden" />
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
              Gestão de Telefonia
            </h1>
            <h1 className="text-lg font-semibold text-slate-800 sm:hidden">Telefonia</h1>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerRefresh}
              disabled={isRefreshing}
              className="hidden md:flex text-slate-700 bg-white"
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4 text-primary', isRefreshing && 'animate-spin')}
              />
              Atualizar Dados
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={triggerRefresh}
              disabled={isRefreshing}
              className="md:hidden bg-white text-primary"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </Button>
            <div className="flex items-center gap-3 border-l pl-3 md:pl-4 md:ml-2">
              <div className="hidden flex-col items-end md:flex">
                <span className="text-sm font-medium text-slate-800">{userName}</span>
                <span className="text-xs text-slate-500">{userRole}</span>
              </div>
              <Avatar className="h-9 w-9 border border-slate-200 shadow-sm">
                <AvatarFallback className="bg-blue-50 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="ml-1 text-slate-500 hover:text-red-600 hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
