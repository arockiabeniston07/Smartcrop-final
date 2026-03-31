const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

// POST /api/satellite/suggest
router.post('/suggest', auth, async (req, res) => {
  try {
    const { location, soilType } = req.body
    // Satellite data - in production integrate with NASA NDVI API / Sentinel Hub
    const suggestions = generateSatelliteSuggestions(location, soilType)
    res.json({ location, soilType, suggestions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

function generateSatelliteSuggestions(location = '', soilType = 'Alluvial') {
  const loc = location.toLowerCase()
  const allSuggestions = [
    {
      rank: 1, crop: 'Rice', emoji: '🌾', suitability: 94 + Math.floor(Math.random() * 5),
      season: 'Kharif (June–Oct)', area: 'Entire region',
      reason: 'High NDVI signature and alluvial soil moisture levels indicate excellent paddy suitability.',
      ndvi: 0.72, soilMoisture: 'High', landUse: 'Irrigated',
    },
    {
      rank: 2, crop: 'Sugarcane', emoji: '🎋', suitability: 85 + Math.floor(Math.random() * 6),
      season: 'Year-round', area: 'Eastern portion',
      reason: 'Deep soil moisture and warm temperatures support high sugar yield per hectare.',
      ndvi: 0.68, soilMoisture: 'Moderate', landUse: 'Irrigated',
    },
    {
      rank: 3, crop: 'Turmeric', emoji: '🟡', suitability: 78 + Math.floor(Math.random() * 8),
      season: 'Rabi (Nov–Mar)', area: 'Upland areas',
      reason: 'Well-drained patches with red laterite pockets support strong rhizome development.',
      ndvi: 0.55, soilMoisture: 'Low-Medium', landUse: 'Rain-fed',
    },
    {
      rank: 4, crop: 'Maize', emoji: '🌽', suitability: 74 + Math.floor(Math.random() * 8),
      season: 'Kharif', area: 'West side',
      reason: 'Moderate water requirements match predicted rainfall and temperature patterns.',
      ndvi: 0.61, soilMoisture: 'Moderate', landUse: 'Rain-fed',
    },
    {
      rank: 5, crop: 'Soybean', emoji: '🫘', suitability: 70 + Math.floor(Math.random() * 8),
      season: 'Kharif', area: 'Central portion',
      reason: 'Black cotton soil with moderate drainage ideal for soybean protein development.',
      ndvi: 0.58, soilMoisture: 'Medium', landUse: 'Rain-fed',
    },
  ]

  // Customize by location keywords
  if (loc.includes('punjab') || loc.includes('haryana')) {
    allSuggestions[0].crop = 'Wheat'
    allSuggestions[0].emoji = '🌾'
    allSuggestions[0].reason = 'Punjab belt satellite data shows optimal wheat suitability with high soil fertility.'
  } else if (loc.includes('kerala') || loc.includes('goa')) {
    allSuggestions[0].crop = 'Coconut'
    allSuggestions[0].emoji = '🥥'
    allSuggestions[0].reason = 'Coastal NDVI data shows high palm vegetation suitability with excellent drainage.'
  }

  return allSuggestions
}

module.exports = router
