import { useEffect, useState } from 'react'
import { Search, History, Plus, Edit3, Trash2, ListTodo, Palette, Code2 } from 'lucide-react'
import { getChanges } from '@/api/resources'
import type { Change } from '@/api/types'

export const ChangeHistoryPage = () => {
  const [changes, setChanges] = useState<Change[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    fetchChanges()
  }, [filterType])

  const fetchChanges = async () => {
    setLoading(true)
    try {
      const params = filterType !== 'all' ? { resource_type: filterType } : undefined
      const data = await getChanges(params)
      setChanges(data)
    } catch (err) {
      console.error('Failed to fetch changes:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredChanges = changes.filter((change) => {
    const matchesSearch =
      change.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const resourceTypeLabels: Record<string, string> = {
    requirement: '需求',
    design: '设计',
    code: '代码',
  }

  const actionLabels: Record<string, string> = {
    create: '创建',
    update: '更新',
    delete: '删除',
  }

  const resourceTypeIcons: Record<string, typeof ListTodo> = {
    requirement: ListTodo,
    design: Palette,
    code: Code2,
  }

  const actionIcons: Record<string, typeof Plus> = {
    create: Plus,
    update: Edit3,
    delete: Trash2,
  }

  const actionColors: Record<string, string> = {
    create: 'bg-success/10 text-success',
    update: 'bg-warning/10 text-warning',
    delete: 'bg-danger/10 text-danger',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">变更历史</h1>
      </div>

      <div className="bg-card rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索变更记录..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {['all', 'requirement', 'design', 'code'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filterType === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? '全部' : resourceTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredChanges.length > 0 ? (
            filteredChanges.map((change) => {
              const ResourceIcon = resourceTypeIcons[change.resource_type]
              const ActionIcon = actionIcons[change.action]
              return (
                <div key={change.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionColors[change.action]}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-800">
                          {actionLabels[change.action]} {resourceTypeLabels[change.resource_type]}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <ResourceIcon className="w-4 h-4" />
                          ID: {change.resource_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>操作人: {change.user.username}</span>
                        <span>{new Date(change.created_at).toLocaleString()}</span>
                      </div>
                      {(change.old_value || change.new_value) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            {change.old_value && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">变更前</p>
                                <pre className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-auto">
                                  {change.old_value}
                                </pre>
                              </div>
                            )}
                            {change.new_value && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">变更后</p>
                                <pre className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-auto">
                                  {change.new_value}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无变更记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
