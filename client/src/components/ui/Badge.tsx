import { LeadStatus } from '../../types/index'

interface BadgeProps {
  status: LeadStatus
}

const statusStyles: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

const Badge = ({ status }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

export default Badge