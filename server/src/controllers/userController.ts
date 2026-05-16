import { Response, NextFunction } from 'express'
import User from '../models/User'
import AppError from '../utils/AppError'
import { AuthRequest } from '../types/index'

export const getAllUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password')

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: { users }
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.body

    // Prevent admin from changing their own role accidentally
    if (req.params.id === req.user!._id.toString()) {
      throw new AppError('You cannot change your own role', 400)
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.params.id === req.user!._id.toString()) {
      throw new AppError('You cannot delete your own account', 400)
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null
    })
  } catch (error) {
    next(error)
  }
}