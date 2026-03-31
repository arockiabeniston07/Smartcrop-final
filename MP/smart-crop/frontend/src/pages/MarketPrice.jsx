import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { FiTrendingUp, FiTrendingDown, FiMapPin, FiSearch } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function MarketPrice() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const MOCK_MARKET_DATA = {
    commodities: [
      {
        id: 'c1', name: 'Wheat', emoji: '🌾', current_price: 2450, unit: 'per Quintal', change: 2.5, trend: 'up',
        nearby_mandis: [
          { name: 'Karnal Mandi', price: 2465, distance: '12 km' },
          { name: 'Panipat Mandi', price: 2430, distance: '28 km' }
        ],
        history: Array.from({ length: 6 }, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], price: 2100 + Math.random() * 400 }))
      },
      {
        id: 'c2', name: 'Rice', emoji: '🌾', current_price: 3200, unit: 'per Quintal', change: -1.2, trend: 'down',
        nearby_mandis: [
          { name: 'Amritsar Mandi', price: 3150, distance: '15 km' },
          { name: 'Ludhiana Mandi', price: 3220, distance: '32 km' }
        ],
        history: Array.from({ length: 6 }, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i], price: 3400 - Math.random() * 300 }))
      }
    ]
  }

  const [selectedCrop, setSelectedCrop] = useState(null)

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/market')
      if (res.data && res.data.commodities) {
        setData(res.data)
        setSelectedCrop(res.data.commodities[0])
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err) {
      console.warn("Market API failed or returned invalid data, using fallback mock data", err)
      setData(MOCK_MARKET_DATA)
      setSelectedCrop(MOCK_MARKET_DATA.commodities[0])
    } finally {
      setLoading(false)
    }
  }

  const filteredCrops = data?.commodities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div className="min-h-screen page-container flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12 border-t-purple-500" />
        <p className="text-white/60 font-semibold">{t('common.loading', 'Loading Live APIs...')}</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen page-container flex items-center justify-center pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-md border-red-500/20"
      >
        <div className="text-5xl mb-4">📈</div>
        <h2 className="text-white font-display font-bold text-xl mb-2">{t('market.error_title', 'Market data currently unavailable')}</h2>
        <p className="text-white/40 text-sm mb-6">{error}</p>
        <button 
          onClick={() => { setError(''); setLoading(true); fetchMarketData(); }}
          className="btn-primary w-full py-3 bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20"
        >
          🔄 {t('common.retry', 'Retry Live Connection')}
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border-purple-500/20">
            <FiTrendingUp className="text-purple-400 text-lg" />
            <span className="text-sm text-purple-400/80 font-semibold">{t('market.badge', 'AgriMarket Live')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('market.title_prefix', 'Real-Time')} <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{t('market.title')}</span>
          </h1>
          <p className="text-white/50 max-w-xl">
            {t('market.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Commodities List */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-4 space-y-4">
            
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder={t('market.search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11 bg-white/5 border-purple-500/10 focus:border-purple-500/50"
              />
            </div>

            <div className="grid gap-3">
              {filteredCrops?.map(crop => (
                <motion.div
                  key={crop.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCrop(crop)}
                  className={`glass-card p-4 cursor-pointer transition-all duration-300 border ${
                    selectedCrop?.id === crop.id ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{crop.emoji}</span>
                      <span className="text-white font-semibold">{crop.name}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${crop.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {crop.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                      {crop.change}%
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-white/40 text-xs">{t('market.avg', 'avg')} {crop.unit}</div>
                    <div className="text-xl font-display font-black text-white">₹{crop.current_price}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Detailed Analytics */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedCrop && (
                <motion.div key={selectedCrop.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* Chart Card */}
                  <div className="glass-card p-6 border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-transparent">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-2xl font-display font-black text-white flex items-center gap-2">
                          <span>{selectedCrop.emoji}</span> {selectedCrop.name} {t('market.price_trends')}
                        </h2>
                        <p className="text-white/40 text-sm mt-1">{t('market.historic')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-display font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          ₹{selectedCrop.current_price}
                        </div>
                        <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1 ${
                          selectedCrop.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {selectedCrop.trend === 'up' ? '↑' : '↓'} {selectedCrop.change}% {t('market.this_week', 'this week')}
                        </div>
                      </div>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedCrop.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="month" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis domain={['auto', 'auto']} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                            formatter={(value) => [`₹${value}`, 'Price']}
                          />
                          <Area type="monotone" dataKey="price" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 6, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Nearby Mandis */}
                  <div className="glass-card p-6 border-white/5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FiMapPin className="text-purple-400" /> {t('market.nearby')}
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCrop.nearby_mandis.map((mandi, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                          <div className="text-white/80 font-semibold mb-1 truncate">{mandi.name}</div>
                          <div className="flex justify-between items-end">
                            <span className="text-white/40 text-xs">{mandi.distance} {t('market.away', 'away')}</span>
                            <span className="text-purple-400 font-bold text-lg">₹{mandi.price}</span>
                          </div>
                          
                          {/* Price diff indicator */}
                          {mandi.price > selectedCrop.current_price ? (
                            <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                              <FiTrendingUp size={10} /> +₹{mandi.price - selectedCrop.current_price} {t('market.higher', 'higher')}
                            </div>
                          ) : (
                            <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                              <FiTrendingDown size={10} /> -₹{selectedCrop.current_price - mandi.price} {t('market.lower', 'lower')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
