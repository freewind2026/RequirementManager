import { LayoutDashboard, Users, FolderKanban, Users2, ListTodo, Palette, Code2, History, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface SidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'projects', label: '项目管理', icon: FolderKanban },
  { id: 'project-groups', label: '项目组管理', icon: Users2 },
  { id: 'requirements', label: '需求管理', icon: ListTodo },
  { id: 'designs', label: '设计管理', icon: Palette },
  { id: 'codes', label: '代码管理', icon: Code2 },
  { id: 'changes', label: '变更历史', icon: History },
]

export const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  const { logout } = useAuthStore()

  return (
    <aside className="w-64 bg-primary min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          需求管理系统
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-primary font-medium'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>
  )
}
