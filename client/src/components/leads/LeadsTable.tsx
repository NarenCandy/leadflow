import {  UserRole } from '../../types/index'
import type {Lead} from '../../types/index'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface LeadsTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  onView: (lead: Lead) => void
  hasActiveFilters:boolean
}

const LeadsTable = ({ leads, onEdit, onDelete, onView, hasActiveFilters }: LeadsTableProps) => {
  const { user } = useAuth()
  const isAdmin = user?.role === UserRole.ADMIN

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        {hasActiveFilters ? (
          <>
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No leads match your filters
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting or clearing your search and filters
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No leads yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Click "Add Lead" to create your first lead
            </p>
          </>
        )}
      </div>
    )
  }

  const getCreatedByName = (createdBy: Lead['createdBy']): string => {
    if (typeof createdBy === 'string') return createdBy
    return createdBy.name
  }

  // Only show these headers for admin
  const headers = ['Name', 'Email', 'Status', 'Source', ...(isAdmin ? ['Created By'] : []), 'Date', 'Actions']

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {headers.map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map(lead => (
            <tr
              key={lead._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {lead.name}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {lead.email}
              </td>
              <td className="px-4 py-3">
                <Badge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {lead.source}
              </td>
              {isAdmin && (
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {getCreatedByName(lead.createdBy)}
                </td>
              )}
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => onView(lead)}
                    >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1"
                    onClick={() => onEdit(lead)}
                  >
                    Edit
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => onDelete(lead)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeadsTable