import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { LeadStatus, LeadSource } from '../types/index'


export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    })
    return
  }
  next()
}


export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'sales']).withMessage('Role must be admin or sales')
]


export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
]


export const leadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Lead email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(Object.values(LeadSource)).withMessage('Invalid source value'),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage('Invalid status value'),

  body('notes')
    .optional()
    .trim()
]