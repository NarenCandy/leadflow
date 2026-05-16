import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/authRoutes'
import errorHandler from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'LeadFlow API is running' })
})

// Global error handle
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app