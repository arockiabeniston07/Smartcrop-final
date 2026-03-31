const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')
const CropPrediction = require('../models/CropPrediction')
const router = express.Router()

// POST /api/crop/recommend
router.post('/recommend', auth, async (req, res) => {
  try {
    const { soilType, N, P, K, temperature, humidity, ph, rainfall, location } = req.body

    let result
    try {
      // Call Flask ML service
      const flaskRes = await axios.post(`${process.env.FLASK_URL}/predict/crop`, {
        N: Number(N), P: Number(P), K: Number(K),
        temperature: Number(temperature), humidity: Number(humidity),
        ph: Number(ph), rainfall: Number(rainfall), soilType
      }, { timeout: 10000 })
      result = flaskRes.data
    } catch {
      // Fallback: rule-based mock prediction
      result = getMockCropRecommendation({ N, P, K, temperature, humidity, ph, rainfall })
    }

    // Save to DB
    try {
      await CropPrediction.create({
        userId: req.user.id,
        inputs: { soilType, N, P, K, temperature, humidity, ph, rainfall, location },
        result
      })
    } catch {}

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/crop/history
router.get('/history', auth, async (req, res) => {
  try {
    const preds = await CropPrediction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20)
    res.json(preds)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

function getMockCropRecommendation({ N, P, K, temperature, humidity, ph, rainfall }) {
  const n = Number(N), temp = Number(temperature), rain = Number(rainfall), h = Number(humidity)
  let crop = 'Rice', emoji = '🌾', season = 'Kharif (June–Oct)', description, water, demand

  if (rain > 200 && h > 80) {
    crop = 'Rice'; emoji = '🌾'; season = 'Kharif'; water = 'High'; demand = 'Very High'
    description = 'Rice thrives in your high-rainfall, humid conditions. Ideal for paddy cultivation.'
  } else if (temp < 20 && rain < 150) {
    crop = 'Wheat'; emoji = '🌾'; season = 'Rabi (Nov–Mar)'; water = 'Medium'; demand = 'High'
    description = 'Wheat is perfect for cool-season growing with moderate water needs.'
  } else if (n > 80 && temp > 25) {
    crop = 'Maize'; emoji = '🌽'; season = 'Kharif'; water = 'Medium'; demand = 'High'
    description = 'Maize benefits from your high nitrogen soil and warm temperatures.'
  } else if (temp > 28 && rain < 100) {
    crop = 'Cotton'; emoji = '🌿'; season = 'Kharif'; water = 'Low'; demand = 'High'
    description = 'Cotton is well-suited to your warm, drier climate conditions.'
  } else {
    crop = 'Chickpea'; emoji = '🫘'; season = 'Rabi'; water = 'Low'; demand = 'Medium'
    description = 'Chickpea is a drought-tolerant legume ideal for these soil and climate conditions.'
  }

  return {
    crop, emoji, confidence: Math.floor(Math.random() * 10 + 88),
    description, season, water: water || 'Medium', demand: demand || 'High',
    yield: '2-4 tons/ha', alternatives: ['Soybean', 'Sunflower', 'Groundnut']
  }
}

module.exports = router
