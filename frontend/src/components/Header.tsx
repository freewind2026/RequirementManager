import { Bell, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export const Header = () => {
  const { user } = useAuthStore()

  const roleLabels = {
    admin: '管理员',
    manager: '项目经理',
    developer: '开发者',
  }

  return (
    <header className="bg-card border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">欢迎回来，{user?.username}</h2>
        <p className="text-sm text-gray-500">角色：{user ? roleLabels[user.role] : ''}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
