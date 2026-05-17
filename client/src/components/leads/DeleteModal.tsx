import Button from '../ui/Button'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
  leadName: string
}

const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading, leadName }: DeleteModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 mx-auto">
          <span className="text-red-600 dark:text-red-400 text-xl">⚠</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          Delete Lead
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-700 dark:text-gray-300">"{leadName}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth isLoading={isLoading} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal