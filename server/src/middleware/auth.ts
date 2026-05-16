import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import AppError from '../utils/AppError'
import { AuthRequest, UserRole } from '../types/index'

interface JwtPayload {
  id: string
  role: string
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized. No token provided', 401)
    }

    const token = authHeader.split(' ')[1]

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) throw new AppError('JWT secret not configured', 500)

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload

    const user = await User.findById(decoded.id)
    if (!user) throw new AppError('User no longer exists', 401)

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}