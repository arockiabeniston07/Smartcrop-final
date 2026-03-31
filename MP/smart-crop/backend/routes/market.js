const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

// GET /api/market
router.get('/', auth, async (req, res) => {
  try {
    // Generate realistic mock market data based on current date
    const today = new Date()
    
    // Generate 6 months of historical data points for the graph
    const months = []
    for(let i=5; i>=0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        months.push(d.toLocaleString('default', { month: 'short' }))
    }

    const marketData = {
      summary: {
        total_mandis: 2450,
        active_crops: 18,
        trend: 'bullish'
      },
      commodities: [
        {
          id: 'c1',
          name: 'Wheat',
          emoji: '🌾',
          current_price: 2450,
          unit: 'per Quintal',
          change: 2.5,
          trend: 'up',
          nearby_mandis: [
            { name: 'Karnal Mandi', price: 2465, distance: '12 km' },
            { name: 'Panipat Mandi', price: 2430, distance: '28 km' },
            { name: 'Kurukshetra', price: 2480, distance: '45 km' }
          ],
          history: months.map((m, i) => ({ month: m, price: 2100 + (Math.random() * 400) + (i * 30) }))
        },
        {
          id: 'c2',
          name: 'Rice (Paddy)',
          emoji: '🌾',
          current_price: 3200,
          unit: 'per Quintal',
          change: -1.2,
          trend: 'down',
          nearby_mandis: [
            { name: 'Amritsar Mandi', price: 3150, distance: '15 km' },
            { name: 'Ludhiana Mandi', price: 3220, distance: '32 km' }
          ],
          history: months.map((m, i) => ({ month: m, price: 3400 - (Math.random() * 300) - (i * 20) }))
        },
        {
          id: 'c3',
          name: 'Cotton',
          emoji: '🌿',
          current_price: 7100,
          unit: 'per Quintal',
          change: 5.4,
          trend: 'up',
          nearby_mandis: [
            { name: 'Bathinda Mandi', price: 7150, distance: '8 km' },
            { name: 'Sirsa Mandi', price: 7050, distance: '40 km' }
          ],
          history: months.map((m, i) => ({ month: m, price: 6200 + (Math.random() * 800) + (i * 150) }))
        },
        {
          id: 'c4',
          name: 'Mustard',
          emoji: '🌻',
          current_price: 5400,
          unit: 'per Quintal',
          change: 0.8,
          trend: 'up',
          nearby_mandis: [
            { name: 'Alwar Mandi', price: 5420, distance: '22 km' },
            { name: 'Bharatpur', price: 5380, distance: '55 km' }
          ],
          history: months.map((m, i) => ({ month: m, price: 5000 + (Math.random() * 500) + (i * 40) }))
        },
        {
          id: 'c5',
          name: 'Soybean',
          emoji: '🫘',
          current_price: 4800,
          unit: 'per Quintal',
          change: -2.1,
          trend: 'down',
          nearby_mandis: [
            { name: 'Indore Mandi', price: 4750, distance: '18 km' },
            { name: 'Ujjain Mandi', price: 4820, distance: '35 km' }
          ],
          history: months.map((m, i) => ({ month: m, price: 5200 - (Math.random() * 400) - (i * 50) }))
        }
      ]
    }

    res.json(marketData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/market/:crop
router.get('/:crop', auth, async (req, res) => {
  // Can be extended to fetch specific crop data
  res.json({ message: `Market data for ${req.params.crop}` })
})

module.exports = router
