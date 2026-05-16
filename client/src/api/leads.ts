import axiosInstance from './axios'
import type { LeadFormData, LeadFilters } from '../types/index'

export const getLeadsApi = async (filters: Partial<LeadFilters>) => {
  const params = new URLSearchParams()

  if (filters.page) params.append('page', filters.page.toString())
  if (filters.search) params.append('search', filters.search)
  if (filters.status) params.append('status', filters.status)
  if (filters.source) params.append('source', filters.source)
  if (filters.sort) params.append('sort', filters.sort)

  const response = await axiosInstance.get(`/leads?${params.toString()}`)
  return response.data
}

export const getLeadApi = async (id: string) => {
  const response = await axiosInstance.get(`/leads/${id}`)
  return response.data
}

export const createLeadApi = async (data: LeadFormData) => {
  const response = await axiosInstance.post('/leads', data)
  return response.data
}

export const updateLeadApi = async (id: string, data: Partial<LeadFormData>) => {
  const response = await axiosInstance.put(`/leads/${id}`, data)
  return response.data
}

export const deleteLeadApi = async (id: string) => {
  const response = await axiosInstance.delete(`/leads/${id}`)
  return response.data
}

export const exportLeadsCSVApi = async (filters: Partial<LeadFilters>) => {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.source) params.append('source', filters.source)
  if (filters.search) params.append('search', filters.search)

  const response = await axiosInstance.get(`/leads/export/csv?${params.toString()}`, {
    responseType: 'blob' 
  })
  return response
}