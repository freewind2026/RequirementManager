import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, ListTodo, ChevronRight } from 'lucide-react'
import { getRequirements, createRequirement, updateRequirement, deleteRequirement } from '@/api/resources'
import { getProjects } from '@/api/projects'
import type { Requirement } from '@/api/types'
import type { Project } from '@/api/types'

export const RequirementPage = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentRequirement, setCurrentRequirement] = useState<Requirement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'pending' as 'pending' | 'in_progress' | 'review' | 'completed',
    project_id: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reqData, projectData] = await Promise.all([
        getRequirements(),
        getProjects(),
      ])
      setRequirements(reqData)
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (requirement?: Requirement) => {
    if (requirement) {
      setIsEditing(true)
      setCurrentRequirement(requirement)
      setFormData({
        title: requirement.title,
        description: requirement.description || '',
        priority: requirement.priority,
        status: requirement.status,
        project_id: requirement.project.id,
      })
    } else {
      setIsEditing(false)
      setCurrentRequirement(null)
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        project_id: projects[0]?.id || 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setCurrentRequirement(null)
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      project_id: projects[0]?.id || 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && currentRequirement) {
        await updateRequirement(currentRequirement.id, formData)
      } else {
        await createRequirement(formData)
      }
      fetchData()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save requirement:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个需求吗？')) {
      try {
        await deleteRequirement(id)
        fetchData()
      } catch (err) {
        console.error('Failed to delete requirement:', err)
      }
    }
  }

  const filteredRequirements = requirements.filter(
    (req) =>
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    review: '审核中',
    completed: '已完成',
  }

  const priorityLabels: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    review: 'bg-yellow-100 text-yellow-600',
    completed: 'bg-green-100 text-green-600',
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600',
  }

  const groupedRequirements = {
    pending: filteredRequirements.filter((r) => r.status === 'pending'),
    in_progress: filteredRequirements.filter((r) => r.status === 'in_progress'),
    review: filteredRequirements.filter((r) => r.status === 'review'),
    completed: filteredRequirements.filter((r) => r.status === 'completed'),
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">需求管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          创建需求
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索需求..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4">
          {Object.entries(groupedRequirements).map(([status, items]) => (
            <div key={status} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{statusLabels[status]}</h3>
                <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : items.length > 0 ? (
                  items.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800 text-sm">{req.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[req.priority]}`}>
                          {priorityLabels[req.priority]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{req.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{req.project.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(req)}
                            className="p-1 text-gray-400 hover:text-primary"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(req.id)}
                            className="p-1 text-gray-400 hover:text-danger"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">暂无需求</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? '编辑需求' : '创建需求'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="critical">紧急</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in_progress' | 'review' | 'completed' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  >
                    <option value="pending">待处理</option>
                    <option value="in_progress">进行中</option>
                    <option value="review">审核中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">所属项目</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  required
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isEditing ? '保存修改' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
