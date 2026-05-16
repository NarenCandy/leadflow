

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost'
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral'
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales'
}


export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}


export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}


export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: {
    items: T[]
    pagination: PaginationMeta
  }
}


export interface LeadQueryParams {
  page?: string
  limit?: string
  status?: string
  source?: string
  search?: string
  sort?: 'latest' | 'oldest'
}