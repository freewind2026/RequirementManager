import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { UserManagementPage } from '@/pages/UserManagementPage'
import { ProjectManagementPage } from '@/pages/ProjectManagementPage'
import { ProjectGroupPage } from '@/pages/ProjectGroupPage'
import { RequirementPage } from '@/pages/RequirementPage'
import { DesignPage } from '@/pages/DesignPage'
import { CodePage } from '@/pages/CodePage'
import { ChangeHistoryPage } from '@/pages/ChangeHistoryPage'

const pageComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  users: UserManagementPage,
  projects: ProjectManagementPage,
  'project-groups': ProjectGroupPage,
  requirements: RequirementPage,
  designs: DesignPage,
  codes: CodePage,
  changes: ChangeHistoryPage,
}

function App() {
  const { isAuthenticated } = useAuthStore()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const PageComponent = pageComponents[activeMenu] || DashboardPage

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}

export default App
