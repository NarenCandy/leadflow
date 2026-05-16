import mongoose, { Document, Schema } from 'mongoose'
import { LeadStatus, LeadSource } from '../types/index'


export interface ILead extends Document {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  notes?: string          
  assignedTo?: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required']
    },
    notes: {
      type: String,
      trim: true
      // no required — this field is optional
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User'
      // optional — a lead may not be assigned yet
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)


LeadSchema.index({ status: 1 })
LeadSchema.index({ source: 1 })
LeadSchema.index({ name: 'text', email: 'text' }) // enables text search

const Lead = mongoose.model<ILead>('Lead', LeadSchema)

export default Lead