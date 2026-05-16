// ─── Enums (mirror the backend exactly) ───────────────────────────────────
export const LeadStatus = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  LOST: 'Lost'
} as const

export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus]

export const LeadSource = {
  WEBSITE: 'Website',
  INSTAGRAM: 'Instagram',
  REFERRAL: 'Referral'
} as const

export type LeadSource = typeof LeadSource[keyof typeof LeadSource]

export const UserRole = {
  ADMIN: 'admin',
  SALES: 'sales'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]
export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Lead {
  _id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  notes?: string
  createdBy: User | string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface LeadsResponse {
  leads: Lead[]
  pagination: PaginationMeta
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface LeadFormData {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  notes?: string
}

export interface LeadFilters {
  search: string
  status: string
  source: string
  sort: 'latest' | 'oldest'
  page: number
}
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}