import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  let statusCode = 500
  let message = 'Internal Server Error'

  // If it is our custom AppError, use its values
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }


  if ((err as NodeJS.ErrnoException).code === '11000') {
    statusCode = 400
    message = 'A record with that value already exists'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = err.message
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token. Please log in again'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired. Please log in again'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export default errorHandler