require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/crop', require('./routes/crop'))
app.use('/api/disease', require('./routes/disease'))
app.use('/api/weather', require('./routes/weather'))
app.use('/api/satellite', require('./routes/satellite'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/crop-requirements', require('./routes/cropRequirements'))
app.use('/api/pest', require('./routes/pest'))
app.use('/api/fertilizer', require('./routes/fertilizer'))
app.use('/api/market', require('./routes/market'))
app.use('/api/community', require('./routes/community'))
app.use('/api/chatbot', require('./routes/chatbot'))
app.use('/api/voice-assistant', require('./routes/voiceAssistant'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Smart Crop Backend running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    console.log('⚠️  Starting server without MongoDB...')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Smart Crop Backend running on port ${PORT} (no DB)`)
    })
  })

module.exports = app
