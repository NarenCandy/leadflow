import { Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import AppError from '../utils/AppError'
import { AuthRequest, LeadQueryParams } from '../types/index'
import { LeadStatus, LeadSource } from '../types/index'
import { convertLeadsToCSV } from '../utils/csvExport'

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      notes,
      createdBy: req.user!._id
    })

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: { lead }
    })
  } catch (error) {
    next(error)
  }
}


export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest'
    } = req.query as LeadQueryParams


    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    // ── Build the filter object dynamically ──
    const filter: Record<string, unknown> = {}

    // Role-based filtering — sales users only see their own leads
    if (req.user!.role === 'sales') {
      filter.createdBy = req.user!._id
    }

    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      filter.status = status
    }

    if (source && Object.values(LeadSource).includes(source as LeadSource)) {
      filter.source = source
    }

    // Text search — searches both name and email fields
    // regex
    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ]
    }

    
    const sortOrder = sort === 'oldest' ? 1 : -1
    const sortObj: Record<string, 1 | -1> = { createdAt: sortOrder }


    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email role'),
      Lead.countDocuments(filter)
    ])

    const pages = Math.ceil(total / limitNum)

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      data: {
        leads,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email role')

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }

    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!._id.toString()
    ) {
      throw new AppError('You do not have permission to view this lead', 403)
    }

    res.status(200).json({
      success: true,
      message: 'Lead fetched successfully',
      data: { lead }
    })
  } catch (error) {
    next(error)
  }
}

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }

    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!._id.toString()
    ) {
      throw new AppError('You do not have permission to update this lead', 403)
    }

    const { name, email, status, source, notes } = req.body

    if (name !== undefined) lead.name = name
    if (email !== undefined) lead.email = email
    if (status !== undefined) lead.status = status
    if (source !== undefined) lead.source = source
    if (notes !== undefined) lead.notes = notes

    await lead.save()

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: { lead }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }

    // Only admins can delete — sales users cannot
    if (req.user!.role === 'sales') {
      throw new AppError('Only admins can delete leads', 403)
    }

    await lead.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: null
    })
  } catch (error) {
    next(error)
  }
}



//  EXPORT LEADS AS CSV 
export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams

    const filter: Record<string, unknown> = {}

    if (req.user!.role === 'sales') {
      filter.createdBy = req.user!._id
    }

    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      filter.status = status
    }

    if (source && Object.values(LeadSource).includes(source as LeadSource)) {
      filter.source = source
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ]
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 })
    const csv = convertLeadsToCSV(leads)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    res.status(200).send(csv)
  } catch (error) {
    next(error)
  }
}