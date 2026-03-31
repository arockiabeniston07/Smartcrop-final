const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const CropData = require('../models/CropData')
const DiseaseData = require('../models/DiseaseData')

dotenv.config()

const MOCK_CROPS = [
  { name: 'Rice', season: 'Kharif', soilType: 'Alluvial', ph: '5.5-7.0', water: 'High', emoji: '🌾' },
  { name: 'Wheat', season: 'Rabi', soilType: 'Loamy', ph: '6.0-7.5', water: 'Medium', emoji: '🌾' },
  { name: 'Maize', season: 'Kharif', soilType: 'Sandy Loam', ph: '5.8-7.0', water: 'Medium', emoji: '🌽' },
  { name: 'Cotton', season: 'Kharif', soilType: 'Black', ph: '5.8-8.0', water: 'Low', emoji: '🌿' },
  { name: 'Sugarcane', season: 'Year-round', soilType: 'Deep Loam', ph: '6.5-7.5', water: 'High', emoji: '🎋' },
  { name: 'Soybean', season: 'Kharif', soilType: 'Medium Black', ph: '6.0-7.0', water: 'Medium', emoji: '🫘' },
  { name: 'Turmeric', season: 'Rabi', soilType: 'Red Laterite', ph: '5.5-6.5', water: 'Medium', emoji: '🟡' },
]

const MOCK_DISEASES = [
  {
    name: 'Leaf Blight', plant: 'Rice', severity: 'High',
    treatment: 'Mancozeb 2.5g/L', organic: ['Neem spray', 'Turmeric powder'], chemical: ['Mancozeb 75WP']
  },
  {
    name: 'Powdery Mildew', plant: 'Wheat', severity: 'Medium',
    treatment: 'Carbendazim 1g/L', organic: ['Baking soda', 'Milk spray'], chemical: ['Carbendazim']
  },
  {
    name: 'Brown Spot', plant: 'Rice', severity: 'Medium',
    treatment: 'Propiconazole 1ml/L', organic: ['Garlic extract'], chemical: ['Propiconazole']
  },
]

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcrop')
    console.log('✅ Connected to MongoDB')

    await User.deleteMany()
    await CropData.deleteMany()
    await DiseaseData.deleteMany()

    console.log('🧹 Cleared existing data')

    // Create Admin User
    const adminPass = await bcrypt.hash('admin1234', 12)
    const farmerPass = await bcrypt.hash('demo1234', 12)

    await User.create([
      { name: 'Admin User', email: 'admin@demo.com', password: adminPass, location: 'Delhi', role: 'admin' },
      { name: 'Test Farmer', email: 'farmer@demo.com', password: farmerPass, location: 'Pune', role: 'farmer' }
    ])

    await CropData.insertMany(MOCK_CROPS)
    await DiseaseData.insertMany(MOCK_DISEASES)

    console.log('🌱 Data successfully seeded!')
    process.exit()
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

seedData()
