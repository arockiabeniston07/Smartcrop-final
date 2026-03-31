const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')
const FertilizerRecommendation = require('../models/FertilizerRecommendation')
const router = express.Router()

// POST /api/fertilizer/recommend
router.post('/recommend', auth, async (req, res) => {
  try {
    const { cropType, soilType, N, P, K } = req.body

    let result
    try {
      // Try calling Flask ML
      const flaskRes = await axios.post(`${process.env.FLASK_URL}/predict/fertilizer`, {
        cropType, soilType, N: Number(N), P: Number(P), K: Number(K)
      }, { timeout: 10000 })
      result = flaskRes.data
    } catch {
      // Fallback rule-based recommendation
      result = getMockFertilizer(cropType, N, P, K)
    }

    // Save to DB
    try {
      await FertilizerRecommendation.create({
        userId: req.user.id,
        inputs: { cropType, soilType, N, P, K },
        result
      })
    } catch {}

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/fertilizer/history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await FertilizerRecommendation.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

function getMockFertilizer(crop, n, p, k) {
  let main = 'Urea (46-0-0)'
  let qty = '50 kg/acre'
  let ins = 'Apply in 3 splits: Basel, 30 DAS, and 60 DAS.'
  let org = ['Vermicompost (2 tons/acre)', 'Green Manure (Sesbania)']

  if (n < 40) {
    main = 'Urea & DAP Combination'
    qty = 'Urea 45kg, DAP 50kg/acre'
    ins = 'High Nitrogen deficiency. Apply full DAP as basal, Urea in 2 splits.'
  } else if (p < 30) {
    main = 'Single Super Phosphate (SSP)'
    qty = '100 kg/acre'
    ins = 'Phosphorus is low. Apply SSP as basal dose before sowing.'
    org.push('Bone Meal mapping')
  } else if (k < 30) {
    main = 'Muriate of Potash (MOP)'
    qty = '30 kg/acre'
    ins = 'Potassium deficit. Apply at flowering stage for better grain/fruit filling.'
    org.push('Wood Ash (50kg/acre)')
  }

  return {
    primary_recommendation: main,
    fertilizers: [main, 'Zinc Sulfate (5kg/acre)'],
    quantity_per_acre: qty,
    application_instructions: ins,
    organic_alternatives: org
  }
}

module.exports = router
