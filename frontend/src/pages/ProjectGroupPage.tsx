import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Search, Users2, UserPlus, UserMinus } from 'lucide-react'
import { getProjectGroups, createProjectGroup, updateProjectGroup, deleteProjectGroup, addGroupMember, removeGroupMember } from '@/api/projects'
import { getUsers } from '@/api/auth'
import { getProjects } from '@/api/projects'
import type { ProjectGroup } from '@/api/types'
import type { User } from '@/store/authStore'
import type { Project } from '@/api/types'

export const ProjectGroupPage = () => {
  const [groups, setGroups] = useState<ProjectGroup[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<ProjectGroup | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [groupData, userData, projectData] = await Promise.all([
        getProjectGroups(),
        getUsers(),
        getProjects(),
      ])
      setGroups(groupData)
      setUsers(userData)
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (group?: ProjectGroup) => {
    if (group) {
      setIsEditing(true)
      setCurrentGroup(group)
      setFormData({
        name: group.name,
        description: group.description || '',
        project_id: group.project.id,
      })
    } else {
      setIsEditing(false)
      setCurrentGroup(null)
      setFormData({
        name: '',
        description: '',
        project_id: projects[0]?.id || 0,
      })
    }
    setShowModal(true)
  }

  const handleOpenMemberModal = (group: ProjectGroup) => {
    setCurrentGroup(group)
    setSelectedMembers([])
    setShowMemberModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setCurrentGroup(null)
    setFormData({
      name: '',
      description: '',
      project_id: projects[0]?.id || 0,
    })
  }

  const handleCloseMemberModal = () => {
    setShowMemberModal(false)
    setCurrentGroup(null)
    setSelectedMembers([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && currentGroup) {
        await updateProjectGroup(currentGroup.id, formData)
      } else {
        await createProjectGroup(formData)
      }
      fetchData()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save group:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个项目组吗？')) {
      try {
        await deleteProjectGroup(id)
        fetchData()
      } catch (err) {
        console.error('Failed to delete group:', err)
      }
    }
  }

  const handleAddMembers = async () => {
    if (!currentGroup) return
    try {
      for (const userId of selectedMembers) {
        await addGroupMember(currentGroup.id, userId)
      }
      fetchData()
      handleCloseMemberModal()
    } catch (err) {
      console.error('Failed to add members:', err)
    }
  }

  const handleRemoveMember = async (userId: number) => {
    if (!currentGroup) return
    try {
      await removeGroupMember(currentGroup.id, userId)
      fetchData()
    } catch (err) {
      console.error('Failed to remove member:', err)
    }
  }

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">项目组管理</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          创建项目组
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
              placeholder="搜索项目组..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属项目</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成员数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{group.name}</p>
                          <p className="text-sm text-gray-500">{group.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-800">{group.project.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-800">{group.member_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-800">{group.created_by.username}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenMemberModal(group)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="管理成员"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(group)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="p-2 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    没有找到项目组
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? '编辑项目组' : '创建项目组'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">名称</label>
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

      {showMemberModal && currentGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">管理成员 - {currentGroup.name}</h3>
              <button
                onClick={handleCloseMemberModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">添加成员</label>
                <div className="flex gap-2 flex-wrap">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        if (selectedMembers.includes(user.id)) {
                          setSelectedMembers(selectedMembers.filter((id) => id !== user.id))
                        } else {
                          setSelectedMembers([...selectedMembers, user.id])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedMembers.includes(user.id)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {user.username}
                    </button>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <button
                    onClick={handleAddMembers}
                    className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    添加选中成员
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">现有成员</label>
                <div className="space-y-2">
                  {currentGroup.member_count > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {users.map((user) => (
                        <span
                          key={user.id}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {user.username}
                          <button
                            onClick={() => handleRemoveMember(user.id)}
                            className="text-gray-400 hover:text-danger"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">暂无成员</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
