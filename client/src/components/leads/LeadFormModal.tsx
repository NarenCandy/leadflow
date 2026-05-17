import { useState, useEffect  } from 'react'
import type {FormEvent} from 'react'
import type {Lead, LeadFormData} from '../../types/index'
import {  LeadStatus, LeadSource } from '../../types/index'
import { createLeadApi, updateLeadApi } from '../../api/leads'
import Button from '../ui/Button'
import Input from '../ui/Input'
import toast from 'react-hot-toast'

interface LeadFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lead?: Lead | null  // if provided = edit mode, if null = create mode
}

interface FormErrors {
  name?: string
  email?: string
  source?: string
}

const LeadFormModal = ({ isOpen, onClose, onSuccess, lead }: LeadFormModalProps) => {
  const isEditMode = !!lead

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE,
    notes: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // When editing, populate the form with existing lead data
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        notes: ''
      })
    }
    setErrors({})
  }, [lead, isOpen])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.source) newErrors.source = 'Source is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      if (isEditMode && lead) {
        await updateLeadApi(lead._id, formData)
        toast.success('Lead updated successfully')
      } else {
        await createLeadApi(formData)
        toast.success('Lead created successfully')
      }
      onSuccess()
      onClose()
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      toast.error(message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      {/* Modal — stop click from bubbling to backdrop */}
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
          />

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as LeadStatus }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(LeadStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Source
            </label>
            <select
              value={formData.source}
              onChange={e => setFormData(prev => ({ ...prev, source: e.target.value as LeadSource }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(LeadSource).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              {isEditMode ? 'Save Changes' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const getErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = error.response.data as { message?: string }
    return data.message || ''
  }
  return ''
}

export default LeadFormModal