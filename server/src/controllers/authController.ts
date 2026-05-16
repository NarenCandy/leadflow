import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import AppError from '../utils/AppError'
import { UserRole, AuthRequest } from '../types/index'

const generateToken = (id: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'
  if (!jwtSecret) throw new AppError('JWT secret not configured', 500)
  return jwt.sign({ id, role }, jwtSecret, { expiresIn: jwtExpiresIn } as jwt.SignOptions)
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError('An account with this email already exists', 400)
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || UserRole.SALES
    })

    const token = generateToken(user._id.toString(), user.role)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token }
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = generateToken(user._id.toString(), user.role)

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: { user, token }
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { user: req.user }
    })
  } catch (error) {
    next(error)
  }
}