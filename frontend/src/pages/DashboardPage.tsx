import { useEffect, useState } from 'react'
import { FolderKanban, ListTodo, Palette, Code2, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react'
import { getProjects } from '@/api/projects'
import { getRequirements } from '@/api/resources'
import { getUsers } from '@/api/auth'
import type { Project, Requirement, User } from '@/api/types'

export const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, requirementData, userData] = await Promise.all([
          getProjects(),
          getRequirements(),
          getUsers(),
        ])
        setProjects(projectData)
        setRequirements(requirementData)
        setUsers(userData)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: '项目总数',
      value: projects.length,
      icon: FolderKanban,
      color: 'bg-primary',
      textColor: 'text-primary',
    },
    {
      title: '待处理需求',
      value: requirements.filter(r => r.status === 'pending').length,
      icon: ListTodo,
      color: 'bg-warning',
      textColor: 'text-warning',
    },
    {
      title: '设计文档',
      value: 0,
      icon: Palette,
      color: 'bg-secondary',
      textColor: 'text-secondary',
    },
    {
      title: '代码提交',
      value: 0,
      icon: Code2,
      color: 'bg-success',
      textColor: 'text-success',
    },
    {
      title: '团队成员',
      value: users.length,
      icon: Users,
      color: 'bg-primary',
      textColor: 'text-primary',
    },
    {
      title: '进行中任务',
      value: requirements.filter(r => r.status === 'in_progress').length,
      icon: Clock,
      color: 'bg-warning',
      textColor: 'text-warning',
    },
  ]

  const recentRequirements = requirements.slice(0, 5)
  const recentProjects = projects.slice(0, 5)

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    review: '审核中',
    completed: '已完成',
    active: '进行中',
    inactive: '已暂停',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    review: 'bg-yellow-100 text-yellow-600',
    completed: 'bg-green-100 text-green-600',
    active: 'bg-green-100 text-green-600',
    inactive: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">仪表盘</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="bg-card rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 ${stat.color}/10 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              )
            })}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-primary" />
                  最近需求
                </h3>
                <span className="text-sm text-gray-500">{recentRequirements.length} 条</span>
              </div>
              <div className="divide-y divide-gray-100">
                {recentRequirements.length > 0 ? (
                  recentRequirements.map((req) => (
                    <div key={req.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{req.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{req.project.name}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[req.status]}`}>
                          {statusLabels[req.status]}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暂无需求</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  最近项目
                </h3>
                <span className="text-sm text-gray-500">{recentProjects.length} 个</span>
              </div>
              <div className="divide-y divide-gray-100">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{project.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{project.created_by.username}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暂无项目</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-card rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                项目状态分布
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-around">
                {['active', 'inactive', 'completed'].map((status) => {
                  const count = projects.filter(p => p.status === status).length
                  const percentage = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0
                  return (
                    <div key={status} className="text-center">
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#f1f5f9"
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={status === 'active' ? '#22c55e' : status === 'completed' ? '#1e3a5f' : '#94a3b8'}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${percentage * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-800">{percentage}%</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-700">{statusLabels[status]}</p>
                      <p className="text-sm text-gray-500">{count} 个项目</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
