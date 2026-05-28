import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, Palette, FileText } from 'lucide-react'
import { getDesigns, createDesign, updateDesign, deleteDesign } from '@/api/resources'
import { getProjects } from '@/api/projects'
import type { Design } from '@/api/types'
import type { Project } from '@/api/types'

export const DesignPage = () => {
  const [designs, setDesigns] = useState<Design[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file_url: '',
    project_id: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [designData, projectData] = await Promise.all([
        getDesigns(),
        getProjects(),
      ])
      setDesigns(designData)
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (design?: Design) => {
    if (design) {
      setIsEditing(true)
      setCurrentDesign(design)
      setFormData({
        title: design.title,
        content: design.content || '',
        file_url: design.file_url || '',
        project_id: design.project.id,
      })
    } else {
      setIsEditing(false)
      setCurrentDesign(null)
      setFormData({
        title: '',
        content: '',
        file_url: '',
        project_id: projects[0]?.id || 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setCurrentDesign(null)
    setFormData({
      title: '',
      content: '',
      file_url: '',
      project_id: projects[0]?.id || 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && currentDesign) {
        await updateDesign(currentDesign.id, formData)
      } else {
        await createDesign(formData)
      }
      fetchData()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save design:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个设计文档吗？')) {
      try {
        await deleteDesign(id)
        fetchData()
      } catch (err) {
        console.error('Failed to delete design:', err)
      }
    }
  }

  const filteredDesigns = designs.filter(
    (design) =>
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.content?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">设计管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          创建设计文档
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
              placeholder="搜索设计文档..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredDesigns.length > 0 ? (
            filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{design.title}</h3>
                      <p className="text-sm text-gray-500">{design.project.name}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{design.content}</p>
                {design.file_url && (
                  <div className="flex items-center gap-2 text-sm text-primary mb-4">
                    <FileText className="w-4 h-4" />
                    <a href={design.file_url} target="_blank" rel="noopener noreferrer">
                      查看附件
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(design.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(design)}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(design.id)}
                      className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Palette className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无设计文档</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? '编辑设计文档' : '创建设计文档'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">附件链接</label>
                <input
                  type="text"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
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
