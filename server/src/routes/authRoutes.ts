import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController'
import { registerValidation, loginValidation, validate } from '../middleware/validate'
import { protect } from '../middleware/auth'

const router = Router()

// Public routes
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)

// Protected route
router.get('/me', protect, getMe)

export default router