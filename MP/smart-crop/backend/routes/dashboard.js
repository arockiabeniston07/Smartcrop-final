const express = require('express')
const auth = require('../middleware/auth')
const CropPrediction = require('../models/CropPrediction')
const DiseasePrediction = require('../models/DiseasePrediction')
const router = express.Router()

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const [cropPredictions, diseasePredictions] = await Promise.all([
      CropPrediction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10),
      DiseasePrediction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10),
    ])
    res.json({ cropPredictions, diseasePredictions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
