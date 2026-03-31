import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiMapPin, FiChevronDown, FiStar, FiInfo } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Loamy', 'Clay']

const MOCK_SUGGESTIONS = [
  {
    rank: 1, crop: 'Rice', emoji: '🌾', suitability: 94, season: 'Kharif (June–Oct)',
    area: 'Entire region', reason: 'High rainfall compatibility and alluvial soil ideal for paddy cultivation.',
    ndvi: 0.72, soilMoisture: 'High', landUse: 'Irrigated',
  },
  {
    rank: 2, crop: 'Sugarcane', emoji: '🎋', suitability: 87, season: 'Year-round',
    area: 'Eastern portion', reason: 'Deep soil moisture and warm temperatures support high sugar yield.',
    ndvi: 0.68, soilMoisture: 'Moderate', landUse: 'Irrigated',
  },
  {
    rank: 3, crop: 'Turmeric', emoji: '🟡', suitability: 81, season: 'Rabi (Nov–Mar)',
    area: 'Upland areas', reason: 'Well-drained red laterite pockets support rhizome development.',
    ndvi: 0.55, soilMoisture: 'Low-Medium', landUse: 'Rain-fed',
  },
  {
    rank: 4, crop: 'Maize', emoji: '🌽', suitability: 76, season: 'Kharif',
    area: 'West side', reason: 'Moderate water requirements match predicted rainfall patterns.',
    ndvi: 0.61, soilMoisture: 'Moderate', landUse: 'Rain-fed',
  },
]

function SuggestionCard({ s, i }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="glass-card overflow-hidden"
    >
      <div
        className="p-5 cursor-pointer flex items-center gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {s.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/30 text-xs font-mono">#{s.rank}</span>
            <span className="text-white font-display font-bold text-lg">{t(`satellite.crops.${s.crop.toLowerCase()}`, s.crop)}</span>
            {s.rank === 1 && (
              <span className="flex items-center gap-1 bg-primary-500/20 text-primary-400 text-xs px-2 py-0.5 rounded-full">
                <FiStar size={10} /> {t('satellite.best_match', 'Best Match')}
              </span>
            )}
          </div>
          <div className="text-white/40 text-sm">{s.season}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-display font-black text-primary-400">{s.suitability}%</div>
          <div className="text-white/30 text-xs">{t('satellite.suitability', 'Suitability')}</div>
        </div>
        <FiChevronDown className={`text-white/30 transition-transform duration-300 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </div>

      <div className="px-5 pb-3">
        <div className="w-full bg-white/5 rounded-full h-1.5">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${s.suitability}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/5">
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                <FiInfo className="inline mr-1.5 text-primary-400" />{t(`satellite.reasons.${s.crop.toLowerCase()}`, s.reason)}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t('satellite.ndvi_index', 'NDVI Index'), value: s.ndvi.toFixed(2), color: 'text-primary-400' },
                  { label: t('satellite.soil_moisture', 'Soil Moisture'), value: t(`satellite.moisture.${s.soilMoisture.toLowerCase().replace(' ', '-')}`, s.soilMoisture), color: 'text-blue-400' },
                  { label: t('satellite.land_use', 'Land Use'), value: t(`satellite.land_use_types.${s.landUse.toLowerCase().replace(' ', '-')}`, s.landUse), color: 'text-earth-400' },
                  { label: t('satellite.best_area', 'Best Area'), value: t(`satellite.areas.${s.area.toLowerCase().replace(/ /g, '_')}`, s.area), color: 'text-teal-400' },
                ].map((m) => (
                  <div key={m.label} className="bg-white/5 rounded-xl p-3">
                    <div className="text-white/30 text-xs mb-1">{m.label}</div>
                    <div className={`font-semibold text-sm ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SatelliteSuggestion() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ location: '', soilType: 'Alluvial' })
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuggestions(null)
    try {
      const res = await axios.post('/api/satellite/suggest', form)
      setSuggestions(res.data.suggestions)
    } catch {
      setSuggestions(MOCK_SUGGESTIONS)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <span>🛰️</span>
            <span className="text-sm text-white/70">{t('satellite.badge', 'Satellite Agriculture Intelligence')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('satellite.title_prefix', 'Satellite')} <span className="gradient-text">{t('satellite.title')}</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('satellite.subtitle')}
          </p>
        </motion.div>

        {/* Map visualization placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-0 mb-8 overflow-hidden relative h-52 sm:h-72 bg-gradient-to-br from-primary-950 to-gray-950"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Stylized satellite map */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="zone1" cx="30%" cy="60%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="zone2" cx="60%" cy="40%">
                    <stop offset="0%" stopColor="#d67d31" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#d67d31" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="zone3" cx="80%" cy="70%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="800" height="300" fill="#0a2010" />
                <ellipse cx="240" cy="180" rx="200" ry="120" fill="url(#zone1)" />
                <ellipse cx="480" cy="120" rx="160" ry="100" fill="url(#zone2)" />
                <ellipse cx="640" cy="210" rx="120" ry="80" fill="url(#zone3)" />
                {/* Grid lines */}
                {[0,1,2,3,4,5,6,7,8].map(i => (
                  <line key={`h${i}`} x1="0" y1={i*40} x2="800" y2={i*40} stroke="#1a3020" strokeWidth="0.5" />
                ))}
                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(i => (
                  <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="300" stroke="#1a3020" strokeWidth="0.5" />
                ))}
              </svg>
            </div>
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-2 animate-bounce-slow">🛰️</div>
              <p className="text-white/50 text-sm">{t('satellite.map_view', 'Satellite NDVI composite view')}</p>
              <p className="text-white/30 text-xs mt-1">{t('satellite.map_desc', 'Enter location below for regional analysis')}</p>
            </div>
          </div>
          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex gap-3 text-xs text-white/50">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary-500 opacity-70" />{t('satellite.high_ndvi', 'High NDVI')}</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-earth-500 opacity-70" />{t('satellite.med_ndvi', 'Med NDVI')}</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-primary-400 opacity-50" />{t('satellite.low_ndvi', 'Low NDVI')}</div>
          </div>
        </motion.div>

        {/* Query form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="input-field pl-10"
                placeholder={t('satellite.location_placeholder', 'Enter your location (e.g. Vidarbha, Maharashtra)')}
                required
              />
            </div>
            <select
              value={form.soilType}
              onChange={e => setForm({ ...form, soilType: e.target.value })}
              className="input-field sm:w-40 appearance-none"
            >
              {SOIL_TYPES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
            </select>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-8 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><div className="spinner w-4 h-4" /> {t('satellite.scanning', 'Scanning...')}</> : <>🛰️ {t('satellite.btn_analyze', 'Analyze Region')}</>}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-white/50 animate-pulse font-medium">{t('satellite.analyzing_data', 'Retrieving multi-spectral satellite imagery...')}</p>
            </motion.div>
          ) : suggestions && suggestions.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-display font-bold text-xl">
                  {t('satellite.results_title', 'Satellite Analysis Results')}
                </h2>
                <span className="text-white/30 text-sm">{suggestions.length} {t('satellite.crops_identified', 'crops identified')}</span>
              </div>
              {suggestions.map((s, i) => <SuggestionCard key={i} s={s} i={i} />)}
            </motion.div>
          ) : suggestions && suggestions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center border-white/5"
            >
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-white font-bold text-lg mb-2">{t('satellite.no_data', 'No satellite data available')}</h3>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                We couldn't find specific crop suitability data for this location. Try a different region.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
