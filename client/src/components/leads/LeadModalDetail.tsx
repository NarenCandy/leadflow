import { useQuery } from '@tanstack/react-query'
import { getLeadApi } from '../../api/leads'
import { LeadStatus } from '../../types/index'
import type { Lead } from '../../types/index'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface LeadDetailModalProps {
  isOpen: boolean
  onClose: () => void
  leadId: string | null
  onEdit: (lead: Lead) => void
}

const LeadDetailModal = ({ isOpen, onClose, leadId, onEdit }: LeadDetailModalProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => getLeadApi(leadId!),
    enabled: !!leadId && isOpen  // only fetch when modal is open and we have an ID
  })

  const lead: Lead | undefined = data?.data?.lead

  const getCreatedByName = (createdBy: Lead['createdBy']): string => {
    if (typeof createdBy === 'string') return createdBy
    return createdBy.name
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lead Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium">Failed to load lead details</p>
          </div>
        )}

        {/* Content */}
        {lead && !isLoading && (
          <>
            {/* Name + Status */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {lead.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                  {lead.email}
                </p>
              </div>
              <Badge status={lead.status as LeadStatus} />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Source
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {lead.source}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Created By
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getCreatedByName(lead.createdBy)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Created At
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(lead.updatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-6">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {lead.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={onClose}>
                Close
              </Button>
              <Button fullWidth onClick={() => { onEdit(lead); onClose() }}>
                Edit Lead
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LeadDetailModal