import { ILead } from '../models/Lead'

export const convertLeadsToCSV = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At']

  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.notes || '',
    new Date(lead.createdAt).toLocaleDateString()
  ])

  const csvLines = [
    headers.join(','),
    ...rows.map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    )
  ]

  return csvLines.join('\n')
}