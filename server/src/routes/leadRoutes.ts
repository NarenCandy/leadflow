import { Router } from 'express'
import { param } from 'express-validator'
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeadsCSV
} from '../controllers/leadController'
import { protect } from '../middleware/auth'
import { leadValidation, validate } from '../middleware/validate'

const router = Router()

router.use(protect)

// CSV export
router.get('/export/csv', exportLeadsCSV)

router.route('/')
  .get(getLeads)
  .post(leadValidation, validate, createLead)


const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID')
]

router.route('/:id')
  .get(mongoIdValidation, validate, getLead)
  .put(mongoIdValidation, leadValidation, validate, updateLead)
  .delete(mongoIdValidation, validate, deleteLead)

export default router