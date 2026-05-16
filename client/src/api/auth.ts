import axiosInstance from './axios'
import type { LoginCredentials, RegisterCredentials } from '../types/index'

export const loginApi = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/auth/login', credentials)
  return response.data
}

export const registerApi = async (credentials: RegisterCredentials) => {
  const response = await axiosInstance.post('/auth/register', credentials)
  return response.data
}

export const getMeApi = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}