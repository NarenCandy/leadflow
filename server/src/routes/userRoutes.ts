import { Router } from 'express'
import { param, body } from 'express-validator'
import {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser
} from '../controllers/userController'
import { protect, restrictTo } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { UserRole } from '../types/index'

const router = Router()

router.use(protect)
router.use(restrictTo(UserRole.ADMIN))

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
]

router.get('/', getAllUsers)

router.route('/:id')
  .get(mongoIdValidation, validate, getUser)
  .delete(mongoIdValidation, validate, deleteUser)

router.patch(
  '/:id/role',
  [
    ...mongoIdValidation,
    body('role')
      .isIn(Object.values(UserRole))
      .withMessage('Role must be admin or sales')
  ],
  validate,
  updateUserRole
)

export default router