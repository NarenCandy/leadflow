import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getLeadsApi, deleteLeadApi, exportLeadsCSVApi } from '../api/leads'
import type { Lead, LeadFilters } from '../types/index'
import { LeadStatus, LeadSource } from '../types/index'
import { useAuth } from '../context/AuthContext'
import useDebounce from '../hooks/useDebounce'
import Navbar from '../components/layout/Navbar'
import LeadsTable from '../components/leads/LeadsTable'
import LeadFormModal from '../components/leads/LeadFormModal'
import DeleteModal from '../components/leads/DeleteModal'
import Pagination from '../components/ui/Pagination'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import LeadDetailModal from '../components/leads/LeadModalDetail'


const DashboardPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  

  // ── Filter state ──
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: '',
    source: '',
    sort: 'latest',
    page: 1
  })
  const hasActiveFilters = !!(
  filters.search ||
  filters.status ||
  filters.source ||
  filters.sort !== 'latest'
)

  // ── Modal state ──
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null)

  // ── Debounced search — only fires API call 500ms after user stops typing ──
  const debouncedSearch = useDebounce(filters.search, 500)

  // ── Fetch leads with React Query ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', { ...filters, search: debouncedSearch }],
    queryFn: () => getLeadsApi({ ...filters, search: debouncedSearch }),
  })

  const leads: Lead[] = data?.data?.leads || []
  const pagination = data?.data?.pagination

  // ── Helpers to update a single filter and reset to page 1 ──
  const updateFilter = useCallback(<K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  // ── Modal handlers ──
  const handleAddClick = () => {
    setSelectedLead(null)
    setIsFormOpen(true)
  }
  const handleViewClick = (lead: Lead) => {
  setDetailLeadId(lead._id)
  setIsDetailOpen(true)
}

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedLead) return
    setIsDeleting(true)
    try {
      await deleteLeadApi(selectedLead._id)
      toast.success('Lead deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setIsDeleteOpen(false)
    } catch {
      toast.error('Failed to delete lead')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    // Refetch leads after create or edit
    queryClient.invalidateQueries({ queryKey: ['leads'] })
  }

  // ── CSV Export ──
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await exportLeadsCSVApi({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch
      })

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'leads.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('CSV exported successfully')
    } catch {
      toast.error('Failed to export CSV')
    } finally {
      setIsExporting(false)
    }
  }

  const selectClass = `px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none
    focus:ring-2 focus:ring-blue-500 focus:border-transparent`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leads
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {user?.role === 'admin' ? 'Manage all leads' : 'Manage your leads'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleExport}
              isLoading={isExporting}
            >
              ↓ Export CSV
            </Button>
            <Button onClick={handleAddClick}>
              + Add Lead
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              className={`flex-1 ${selectClass}`}
            />

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={e => updateFilter('status', e.target.value)}
              className={selectClass}
            >
              <option value="">All Statuses</option>
              {Object.values(LeadStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={filters.source}
              onChange={e => updateFilter('source', e.target.value)}
              className={selectClass}
            >
              <option value="">All Sources</option>
              {Object.values(LeadSource).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value as 'latest' | 'oldest')}
              className={selectClass}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Clear filters */}
            {(filters.search || filters.status || filters.source || filters.sort !== 'latest') && (
              <Button
                variant="ghost"
                onClick={() => setFilters({ search: '', status: '', source: '', sort: 'latest', page: 1 })}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Leads table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="text-center py-16">
              <p className="text-red-500 font-medium">Failed to load leads</p>
              <p className="text-gray-400 text-sm mt-1">Please try refreshing the page</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && (
            <LeadsTable
              leads={leads}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onView={handleViewClick}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={page => setFilters(prev => ({ ...prev, page }))}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        lead={selectedLead}
      />
      <LeadDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        leadId={detailLeadId}
        onEdit={handleEditClick}
        />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        leadName={selectedLead?.name || ''}
      />
    </div>
  )
}

export default DashboardPage