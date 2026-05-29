export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'developer'
  date_joined: string
}

export interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'inactive' | 'completed'
  created_by: User
  created_at: string
  updated_at: string
}

export interface ProjectGroup {
  id: number
  name: string
  description: string | null
  project: Project
  created_by: User
  member_count: number
  created_at: string
  updated_at: string
}

export interface ProjectGroupCreate {
  name: string
  description: string | null
  project_id: number
}

export interface Requirement {
  id: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'review' | 'completed'
  project: Project
  created_by: User
  created_at: string
  updated_at: string
}

export interface RequirementCreate {
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'review' | 'completed'
  project_id: number
}

export interface Design {
  id: number
  title: string
  content: string | null
  file_url: string | null
  project: Project
  created_by: User
  created_at: string
  updated_at: string
}

export interface DesignCreate {
  title: string
  content: string | null
  file_url: string | null
  project_id: number
}

export interface Code {
  id: number
  title: string
  content: string | null
  branch: string
  commit_hash: string | null
  project: Project
  created_by: User
  created_at: string
  updated_at: string
}

export interface CodeCreate {
  title: string
  content: string | null
  branch: string
  commit_hash: string | null
  project_id: number
}

export interface Change {
  id: number
  resource_type: 'requirement' | 'design' | 'code'
  resource_id: number
  action: 'create' | 'update' | 'delete'
  old_value: string | null
  new_value: string | null
  user: User
  created_at: string
}
