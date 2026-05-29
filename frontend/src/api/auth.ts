import api from './axios'
import type { User } from '@/store/authStore'

export interface LoginResponse {
  access: string
  refresh: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('auth/login/', { email, password })
  return response.data
}

export const register = async (user: Omit<User, 'id' | 'date_joined'> & { password: string }): Promise<User> => {
  const response = await api.post('auth/register/', user)
  return response.data
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('users/')
  return response.data
}

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`users/${id}/`)
  return response.data
}

export const createUser = async (user: Omit<User, 'id' | 'date_joined'> & { password: string }): Promise<User> => {
  const response = await api.post('users/', user)
  return response.data
}

export const updateUser = async (id: number, user: Partial<Omit<User, 'id' | 'date_joined'>>): Promise<User> => {
  const response = await api.put(`users/${id}/`, user)
  return response.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`users/${id}/`)
}
