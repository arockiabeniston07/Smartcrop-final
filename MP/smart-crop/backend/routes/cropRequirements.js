const express = require('express')
const auth = require('../middleware/auth')
const CropRequirement = require('../models/CropRequirement')
const router = express.Router()

// Built-in fallback dataset (used when MongoDB is unavailable)
const FALLBACK_DATA = [
  {
    crop_name: 'Rice', emoji: '🌾',
    soil_types: ['Clay', 'Loamy', 'Alluvial'],
    ph_range: '5.5 – 6.5', temperature_range: '20°C – 35°C',
    rainfall_range: '1000 – 2000 mm', sowing_season: 'Kharif (June – July)',
    suitable_regions: ['West Bengal', 'Punjab', 'Tamil Nadu', 'Andhra Pradesh'],
    fertilizers: ['Urea', 'DAP', 'Potash (MOP)'],
    crop_duration: '90 – 150 days',
    description: 'Rice is a staple crop requiring high water availability and warm temperatures.',
    water_requirement: 'High', yield_per_acre: '2 – 4 tons',
  },
  {
    crop_name: 'Wheat', emoji: '🌾',
    soil_types: ['Loamy', 'Sandy Loam', 'Clay Loam'],
    ph_range: '6.0 – 7.5', temperature_range: '10°C – 25°C',
    rainfall_range: '400 – 900 mm', sowing_season: 'Rabi (November – December)',
    suitable_regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    fertilizers: ['Urea', 'DAP', 'Zinc Sulfate'],
    crop_duration: '100 – 150 days',
    description: 'Wheat is a cool-season grain crop grown in winter.',
    water_requirement: 'Medium', yield_per_acre: '1.5 – 3 tons',
  },
  {
    crop_name: 'Maize', emoji: '🌽',
    soil_types: ['Sandy Loam', 'Loamy', 'Well-drained Clay'],
    ph_range: '5.8 – 7.0', temperature_range: '18°C – 32°C',
    rainfall_range: '600 – 1200 mm', sowing_season: 'Kharif (June – July)',
    suitable_regions: ['Karnataka', 'Andhra Pradesh', 'Maharashtra'],
    fertilizers: ['Urea', 'DAP', 'Potash'],
    crop_duration: '80 – 110 days',
    description: 'Maize is a versatile warm-season crop used for food and fodder.',
    water_requirement: 'Medium', yield_per_acre: '2 – 5 tons',
  },
  {
    crop_name: 'Cotton', emoji: '🌿',
    soil_types: ['Black Cotton Soil', 'Sandy Loam'],
    ph_range: '6.0 – 8.0', temperature_range: '21°C – 35°C',
    rainfall_range: '500 – 1000 mm', sowing_season: 'Kharif (May – June)',
    suitable_regions: ['Gujarat', 'Maharashtra', 'Telangana'],
    fertilizers: ['Urea', 'SSP', 'Potash'],
    crop_duration: '150 – 180 days',
    description: 'Cotton is a commercial fiber crop suited to hot, dry climates.',
    water_requirement: 'Medium-Low', yield_per_acre: '300 – 500 kg (lint)',
  },
  {
    crop_name: 'Sugarcane', emoji: '🎋',
    soil_types: ['Loamy', 'Clay Loam', 'Alluvial'],
    ph_range: '6.0 – 7.5', temperature_range: '21°C – 38°C',
    rainfall_range: '1500 – 2500 mm', sowing_season: 'Spring (Feb – Mar)',
    suitable_regions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    fertilizers: ['Urea', 'SSP', 'Potash', 'FYM'],
    crop_duration: '10 – 18 months',
    description: 'Sugarcane requires tropical climate with abundant water.',
    water_requirement: 'Very High', yield_per_acre: '25 – 40 tons',
  },
  {
    crop_name: 'Tomato', emoji: '🍅',
    soil_types: ['Sandy Loam', 'Loamy', 'Red Sandy'],
    ph_range: '6.0 – 7.0', temperature_range: '18°C – 30°C',
    rainfall_range: '600 – 1200 mm', sowing_season: 'Kharif / Rabi',
    suitable_regions: ['Karnataka', 'Andhra Pradesh', 'Maharashtra'],
    fertilizers: ['NPK 19:19:19', 'Calcium Nitrate', 'Potassium Sulfate'],
    crop_duration: '60 – 90 days',
    description: 'Tomato requires moderate climate and well-drained fertile soil.',
    water_requirement: 'Medium', yield_per_acre: '8 – 15 tons',
  },
  {
    crop_name: 'Potato', emoji: '🥔',
    soil_types: ['Sandy Loam', 'Silt Loam', 'Loamy'],
    ph_range: '5.5 – 6.5', temperature_range: '10°C – 25°C',
    rainfall_range: '400 – 600 mm', sowing_season: 'Rabi (October – November)',
    suitable_regions: ['Uttar Pradesh', 'Punjab', 'West Bengal'],
    fertilizers: ['DAP', 'Potash', 'Urea', 'FYM'],
    crop_duration: '70 – 120 days',
    description: 'Potato grows best in cool climates with loose well-drained soil.',
    water_requirement: 'Medium', yield_per_acre: '8 – 12 tons',
  },
  {
    crop_name: 'Groundnut', emoji: '🥜',
    soil_types: ['Sandy Loam', 'Red Sandy', 'Light Loamy'],
    ph_range: '6.0 – 7.0', temperature_range: '22°C – 30°C',
    rainfall_range: '500 – 1000 mm', sowing_season: 'Kharif (June – July)',
    suitable_regions: ['Gujarat', 'Andhra Pradesh', 'Tamil Nadu'],
    fertilizers: ['SSP', 'Gypsum', 'Potash', 'Boron'],
    crop_duration: '90 – 130 days',
    description: 'Groundnut is a legume oil crop that fixes nitrogen in soil.',
    water_requirement: 'Medium-Low', yield_per_acre: '600 – 1200 kg',
  },
  {
    crop_name: 'Soybean', emoji: '🫘',
    soil_types: ['Loamy', 'Clay Loam', 'Well-drained Black'],
    ph_range: '6.0 – 7.0', temperature_range: '20°C – 32°C',
    rainfall_range: '600 – 1000 mm', sowing_season: 'Kharif (June – July)',
    suitable_regions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
    fertilizers: ['DAP', 'Potash', 'Rhizobium inoculant'],
    crop_duration: '90 – 120 days',
    description: 'Soybean is a valuable protein and oil crop that enriches soil.',
    water_requirement: 'Medium', yield_per_acre: '0.8 – 1.5 tons',
  },
  {
    crop_name: 'Mustard', emoji: '🌻',
    soil_types: ['Sandy Loam', 'Loamy', 'Clay Loam'],
    ph_range: '6.0 – 7.5', temperature_range: '10°C – 25°C',
    rainfall_range: '250 – 500 mm', sowing_season: 'Rabi (October – November)',
    suitable_regions: ['Rajasthan', 'Uttar Pradesh', 'Haryana'],
    fertilizers: ['Urea', 'DAP', 'Sulfur', 'Boron'],
    crop_duration: '90 – 120 days',
    description: 'Mustard is a cool-season oilseed crop that tolerates light frost.',
    water_requirement: 'Low', yield_per_acre: '400 – 800 kg',
  },
  {
    crop_name: 'Chickpea', emoji: '🫘',
    soil_types: ['Sandy Loam', 'Loamy', 'Light Black'],
    ph_range: '6.0 – 8.0', temperature_range: '8°C – 28°C',
    rainfall_range: '300 – 600 mm', sowing_season: 'Rabi (October – November)',
    suitable_regions: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra'],
    fertilizers: ['DAP', 'Potash', 'Rhizobium inoculant'],
    crop_duration: '90 – 120 days',
    description: 'Chickpea is a drought-tolerant legume rich in protein.',
    water_requirement: 'Low', yield_per_acre: '0.5 – 1.2 tons',
  },
  {
    crop_name: 'Onion', emoji: '🧅',
    soil_types: ['Sandy Loam', 'Loamy', 'Alluvial'],
    ph_range: '6.0 – 7.0', temperature_range: '10°C – 30°C',
    rainfall_range: '500 – 800 mm', sowing_season: 'Kharif / Rabi',
    suitable_regions: ['Maharashtra', 'Karnataka', 'Madhya Pradesh'],
    fertilizers: ['Urea', 'DAP', 'Potash', 'Sulfur'],
    crop_duration: '90 – 150 days',
    description: 'Onion is a bulb vegetable crop requiring well-drained fertile soil.',
    water_requirement: 'Medium', yield_per_acre: '8 – 16 tons',
  },
  {
    crop_name: 'Banana', emoji: '🍌',
    soil_types: ['Loamy', 'Alluvial', 'Red Laterite'],
    ph_range: '5.5 – 7.0', temperature_range: '20°C – 35°C',
    rainfall_range: '1500 – 2500 mm', sowing_season: 'Year-round (Tropical)',
    suitable_regions: ['Tamil Nadu', 'Maharashtra', 'Karnataka'],
    fertilizers: ['Urea', 'MOP', 'FYM', 'Magnesium Sulfate'],
    crop_duration: '10 – 14 months',
    description: 'Banana is a tropical fruit crop requiring warm climate and high humidity.',
    water_requirement: 'High', yield_per_acre: '10 – 25 tons',
  },
  {
    crop_name: 'Sunflower', emoji: '🌻',
    soil_types: ['Sandy Loam', 'Loamy', 'Clay Loam'],
    ph_range: '6.0 – 7.5', temperature_range: '18°C – 35°C',
    rainfall_range: '600 – 1000 mm', sowing_season: 'Kharif / Rabi',
    suitable_regions: ['Karnataka', 'Andhra Pradesh', 'Maharashtra'],
    fertilizers: ['Urea', 'DAP', 'Potash', 'Borax'],
    crop_duration: '90 – 120 days',
    description: 'Sunflower is an oilseed crop suited to wide climatic conditions.',
    water_requirement: 'Medium', yield_per_acre: '600 – 1000 kg',
  },
  {
    crop_name: 'Turmeric', emoji: '🌿',
    soil_types: ['Sandy Loam', 'Clay Loam', 'Red Loamy'],
    ph_range: '5.5 – 7.0', temperature_range: '20°C – 35°C',
    rainfall_range: '1000 – 2000 mm', sowing_season: 'Kharif (April – May)',
    suitable_regions: ['Andhra Pradesh', 'Tamil Nadu', 'Odisha'],
    fertilizers: ['FYM', 'Urea', 'SSP', 'Potash'],
    crop_duration: '7 – 9 months',
    description: 'Turmeric is a tropical spice crop requiring warm and humid conditions.',
    water_requirement: 'High', yield_per_acre: '2.5 – 3.5 tons (dry)',
  },
]

// GET /api/crop-requirements — list all crop names
router.get('/', auth, async (req, res) => {
  try {
    let crops
    try {
      crops = await CropRequirement.find({}, 'crop_name emoji').sort({ crop_name: 1 })
    } catch {
      crops = FALLBACK_DATA.map(c => ({ crop_name: c.crop_name, emoji: c.emoji }))
    }
    res.json(crops)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/crop-requirements/:cropName — get requirements for a specific crop
router.get('/:cropName', auth, async (req, res) => {
  try {
    const name = req.params.cropName.trim()
    let crop

    try {
      crop = await CropRequirement.findOne({ crop_name: { $regex: new RegExp(`^${name}$`, 'i') } })
    } catch {}

    if (!crop) {
      // Try fallback dataset
      crop = FALLBACK_DATA.find(c => c.crop_name.toLowerCase() === name.toLowerCase())
    }

    if (!crop) {
      return res.status(404).json({ message: `No data found for crop: ${name}` })
    }

    res.json(crop)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
