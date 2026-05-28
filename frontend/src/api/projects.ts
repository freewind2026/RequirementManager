import api from './axios'
import type { Project, ProjectGroup, ProjectGroupCreate } from './types'

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('projects/')
  return response.data
}

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`projects/${id}/`)
  return response.data
}

export const createProject = async (project: Omit<Project, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Project> => {
  const response = await api.post('projects/', project)
  return response.data
}

export const updateProject = async (id: number, project: Partial<Omit<Project, 'id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Project> => {
  const response = await api.put(`projects/${id}/`, project)
  return response.data
}

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`projects/${id}/`)
}

export const getProjectGroups = async (): Promise<ProjectGroup[]> => {
  const response = await api.get('project-groups/')
  return response.data
}

export const getProjectGroup = async (id: number): Promise<ProjectGroup> => {
  const response = await api.get(`project-groups/${id}/`)
  return response.data
}

export const createProjectGroup = async (group: ProjectGroupCreate): Promise<ProjectGroup> => {
  const response = await api.post('project-groups/', group)
  return response.data
}

export const updateProjectGroup = async (id: number, group: Partial<Omit<ProjectGroup, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'member_count'>>): Promise<ProjectGroup> => {
  const response = await api.put(`project-groups/${id}/`, group)
  return response.data
}

export const deleteProjectGroup = async (id: number): Promise<void> => {
  await api.delete(`project-groups/${id}/`)
}

export const addGroupMember = async (groupId: number, userId: number): Promise<void> => {
  await api.post(`project-groups/${groupId}/members/`, { user_id: userId })
}

export const removeGroupMember = async (groupId: number, userId: number): Promise<void> => {
  await api.delete(`project-groups/${groupId}/members/${userId}/`)
}
