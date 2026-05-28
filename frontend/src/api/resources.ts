import api from './axios'
import type { Requirement, Design, Code, Change } from './types'

export const getRequirements = async (): Promise<Requirement[]> => {
  const response = await api.get('requirements/')
  return response.data
}

export const getRequirement = async (id: number): Promise<Requirement> => {
  const response = await api.get(`requirements/${id}/`)
  return response.data
}

export const createRequirement = async (requirement: Omit<Requirement, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Requirement> => {
  const response = await api.post('requirements/', requirement)
  return response.data
}

export const updateRequirement = async (id: number, requirement: Partial<Omit<Requirement, 'id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Requirement> => {
  const response = await api.put(`requirements/${id}/`, requirement)
  return response.data
}

export const deleteRequirement = async (id: number): Promise<void> => {
  await api.delete(`requirements/${id}/`)
}

export const getDesigns = async (): Promise<Design[]> => {
  const response = await api.get('designs/')
  return response.data
}

export const getDesign = async (id: number): Promise<Design> => {
  const response = await api.get(`designs/${id}/`)
  return response.data
}

export const createDesign = async (design: Omit<Design, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Design> => {
  const response = await api.post('designs/', design)
  return response.data
}

export const updateDesign = async (id: number, design: Partial<Omit<Design, 'id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Design> => {
  const response = await api.put(`designs/${id}/`, design)
  return response.data
}

export const deleteDesign = async (id: number): Promise<void> => {
  await api.delete(`designs/${id}/`)
}

export const getCodes = async (): Promise<Code[]> => {
  const response = await api.get('codes/')
  return response.data
}

export const getCode = async (id: number): Promise<Code> => {
  const response = await api.get(`codes/${id}/`)
  return response.data
}

export const createCode = async (code: Omit<Code, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Code> => {
  const response = await api.post('codes/', code)
  return response.data
}

export const updateCode = async (id: number, code: Partial<Omit<Code, 'id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Code> => {
  const response = await api.put(`codes/${id}/`, code)
  return response.data
}

export const deleteCode = async (id: number): Promise<void> => {
  await api.delete(`codes/${id}/`)
}

export const getChanges = async (params?: { resource_type?: string; resource_id?: string }): Promise<Change[]> => {
  const response = await api.get('changes/', { params })
  return response.data
}

export const getChange = async (id: number): Promise<Change> => {
  const response = await api.get(`changes/${id}/`)
  return response.data
}
