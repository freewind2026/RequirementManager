import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, FolderKanban, MoreVertical } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject } from '@/api/projects'
import type { Project } from '@/api/types'

export const ProjectManagementPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive' | 'completed',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setIsEditing(true)
      setCurrentProject(project)
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
      })
    } else {
      setIsEditing(false)
      setCurrentProject(null)
      setFormData({
        name: '',
        description: '',
        status: 'active',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setCurrentProject(null)
    setFormData({
      name: '',
      description: '',
      status: 'active',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && currentProject) {
        await updateProject(currentProject.id, formData)
      } else {
        await createProject(formData)
      }
      fetchProjects()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save project:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个项目吗？')) {
      try {
        await deleteProject(id)
        fetchProjects()
      } catch (err) {
        console.error('Failed to delete project:', err)
      }
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusLabels: Record<string, string> = {
    active: '进行中',
    inactive: '已暂停',
    completed: '已完成',
  }

  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success',
    inactive: 'bg-gray-100 text-gray-600',
    completed: 'bg-primary/10 text-primary',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">项目管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          创建项目
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
              placeholder="搜索项目..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.created_by.username}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 hidden group-hover:block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenModal(project)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        编辑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(project.id)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              没有找到项目
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? '编辑项目' : '创建项目'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">项目名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'completed' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                >
                  <option value="active">进行中</option>
                  <option value="inactive">已暂停</option>
                  <option value="completed">已完成</option>
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
