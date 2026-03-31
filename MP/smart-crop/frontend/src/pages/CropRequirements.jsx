import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FiSearch, FiDroplet, FiThermometer, FiSun, FiMap,
  FiCalendar, FiClock, FiTrendingUp, FiChevronDown
} from 'react-icons/fi'
import { GiPlantRoots, GiWateringCan, GiFertilizerBag } from 'react-icons/gi'
import { TbPlant2 } from 'react-icons/tb'
import { MdOutlineGrain } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

const CROP_LIST = [
  { name: 'Rice', emoji: '🌾' },
  { name: 'Wheat', emoji: '🌾' },
  { name: 'Maize', emoji: '🌽' },
  { name: 'Cotton', emoji: '🌿' },
  { name: 'Sugarcane', emoji: '🎋' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Potato', emoji: '🥔' },
  { name: 'Groundnut', emoji: '🥜' },
  { name: 'Soybean', emoji: '🫘' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Mustard', emoji: '🌻' },
  { name: 'Chickpea', emoji: '🫘' },
  { name: 'Sunflower', emoji: '🌻' },
  { name: 'Turmeric', emoji: '🌿' },
]

const WATER_COLORS = {
  Low: 'text-yellow-400 bg-yellow-400/10',
  'Medium-Low': 'text-lime-400 bg-lime-400/10',
  Medium: 'text-blue-400 bg-blue-400/10',
  High: 'text-sky-400 bg-sky-400/10',
  'Very High': 'text-cyan-400 bg-cyan-400/10',
}

function InfoCard({ icon, title, content, delay = 0, accent = 'primary' }) {
  const accentMap = {
    primary: 'from-primary-500/20 to-primary-700/5 border-primary-500/20',
    blue: 'from-blue-500/20 to-blue-700/5 border-blue-500/20',
    earth: 'from-earth-500/20 to-earth-700/5 border-earth-500/20',
    teal: 'from-teal-500/20 to-teal-700/5 border-teal-500/20',
    amber: 'from-amber-500/20 to-amber-700/5 border-amber-500/20',
    purple: 'from-purple-500/20 to-purple-700/5 border-purple-500/20',
    rose: 'from-rose-500/20 to-rose-700/5 border-rose-500/20',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass-card p-5 bg-gradient-to-br ${accentMap[accent]} border shine`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="text-white font-semibold text-sm leading-relaxed">{content}</div>
    </motion.div>
  )
}

export default function CropRequirements() {
  const { t } = useTranslation()
  const [selectedCrop, setSelectedCrop] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cropList, setCropList] = useState(CROP_LIST)

  useEffect(() => {
    // Try to load crop list from backend
    axios.get('/api/crop-requirements')
      .then(res => {
        if (res.data?.length) setCropList(res.data.map(c => ({ name: c.crop_name, emoji: c.emoji || '🌱' })))
      })
      .catch(() => {})
  }, [])

  const filteredCrops = searchQuery
    ? cropList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : cropList

  const handleSearch = async (cropName) => {
    if (!cropName) return
    setLoading(true)
    setError('')
    setData(null)
    setDropdownOpen(false)
    try {
      const res = await axios.get(`/api/crop-requirements/${encodeURIComponent(cropName)}`)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || t('common.error', 'Could not fetch crop requirements. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCrop = (name) => {
    setSelectedCrop(name)
    setSearchQuery(name)
    setDropdownOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const crop = selectedCrop || searchQuery.trim()
    if (crop) handleSearch(crop)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border border-primary-500/20">
            <TbPlant2 className="text-primary-400" />
            <span className="text-primary-400 text-sm font-semibold">{t('requirements.badge', 'Reverse Recommendation')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('requirements.title_prefix', 'Crop')} <span className="gradient-text">{t('requirements.title')}</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            {t('requirements.subtitle')}
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-8 relative"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setSelectedCrop('')
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder={t('requirements.search_placeholder', 'Search or select a crop (e.g., Rice, Wheat…)')}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && filteredCrops.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-gray-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-56 overflow-y-auto"
                  >
                    {filteredCrops.map(crop => (
                      <li key={crop.name}>
                        <button
                          type="button"
                          onClick={() => handleSelectCrop(crop.name)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-white/5 transition-colors ${selectedCrop === crop.name ? 'text-primary-400 bg-primary-500/10' : 'text-white/70'}`}
                        >
                          <span className="text-lg">{crop.emoji}</span>
                          <span>{crop.name}</span>
                        </button>
                      </li>
                    ))}
                    {filteredCrops.length === 0 && (
                      <li className="px-4 py-3 text-white/40 text-sm">{t('common.no_results', 'No crops found')}</li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={loading || (!selectedCrop && !searchQuery.trim())}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed ripple flex items-center gap-2 sm:w-auto w-full justify-center"
            >
              {loading ? (
                <><div className="spinner w-4 h-4" /> {t('common.searching', 'Searching…')}</>
              ) : (
                <><FiSearch /> {t('requirements.btn_find', 'Find Requirements')}</>
              )}
            </motion.button>
          </form>

          {/* Quick crop pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-white/30 text-xs self-center mr-1">{t('requirements.quick_pick', 'Quick pick:')}</span>
            {['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Potato'].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => { handleSelectCrop(n); handleSearch(n) }}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:border-primary-500/40 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-4 mb-6 border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-3"
            >
              <span className="text-xl">⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!data && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-white/30 text-base">{t('requirements.empty_state', 'Select a crop above to see its ideal growing conditions')}</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.crop_name}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.97 }}
            >
              {/* Crop hero banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-6 bg-gradient-to-r from-primary-900/40 to-earth-900/30 border border-primary-500/20 relative overflow-hidden"
              >
                <div className="absolute right-4 top-4 text-8xl opacity-10 select-none">{data.emoji}</div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{data.emoji}</span>
                    <div>
                      <h2 className="font-display font-black text-3xl text-white">{t(`requirements.crops.${data.crop_name.toLowerCase().replace(/ /g, '_')}`, data.crop_name)}</h2>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${WATER_COLORS[data.water_requirement] || 'text-blue-400 bg-blue-400/10'}`}>
                        <GiWateringCan /> {t(`requirements.water.${data.water_requirement.toLowerCase().replace(/ /g, '_')}`, data.water_requirement)} {t('requirements.water_need', 'Water Need')}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed max-w-2xl">{data.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <FiClock className="text-primary-400" />
                      <span className="text-white/80 font-medium">{data.crop_duration}</span> {t('requirements.duration_label', 'duration')}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <FiTrendingUp className="text-primary-400" />
                      <span className="text-white/80 font-medium">{data.yield_per_acre}</span> {t('requirements.yield_label', 'per acre')}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info Cards Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={<GiPlantRoots className="text-earth-400 text-xl" />}
                  title={t('requirements.soil_types_title', 'Suitable Soil Types')}
                  content={
                    <ul className="space-y-1">
                      {data.soil_types?.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-earth-400 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  }
                  delay={0.05}
                  accent="earth"
                />

                <InfoCard
                  icon={<MdOutlineGrain className="text-amber-400 text-xl" />}
                  title={t('requirements.ph_range_title', 'Ideal pH Range')}
                  content={
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-display font-black text-amber-400">{data.ph_range}</span>
                    </div>
                  }
                  delay={0.1}
                  accent="amber"
                />

                <InfoCard
                  icon={<FiThermometer className="text-rose-400 text-xl" />}
                  title={t('requirements.temp_range_title', 'Temperature Range')}
                  content={<span className="text-2xl font-display font-black text-rose-300">{data.temperature_range}</span>}
                  delay={0.15}
                  accent="rose"
                />

                <InfoCard
                  icon={<FiDroplet className="text-sky-400 text-xl" />}
                  title={t('requirements.rainfall_range_title', 'Rainfall Requirement')}
                  content={<span className="text-2xl font-display font-black text-sky-300">{data.rainfall_range}</span>}
                  delay={0.2}
                  accent="blue"
                />

                <InfoCard
                  icon={<FiCalendar className="text-primary-400 text-xl" />}
                  title={t('requirements.sowing_season_title', 'Best Sowing Season')}
                  content={<span className="text-primary-300 font-bold">{data.sowing_season}</span>}
                  delay={0.25}
                  accent="primary"
                />

                <InfoCard
                  icon={<FiMap className="text-teal-400 text-xl" />}
                  title={t('requirements.suitable_regions_title', 'Suitable Regions')}
                  content={
                    <div className="flex flex-wrap gap-1.5">
                      {data.suitable_regions?.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-teal-500/15 text-teal-300 border border-teal-500/20">
                          {r}
                        </span>
                      ))}
                    </div>
                  }
                  delay={0.3}
                  accent="teal"
                />

                <InfoCard
                  icon={<GiFertilizerBag className="text-green-400 text-xl" />}
                  title={t('requirements.fertilizers_title', 'Recommended Fertilizers')}
                  content={
                    <ul className="space-y-1">
                      {data.fertilizers?.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  }
                  delay={0.35}
                  accent="primary"
                />

                <InfoCard
                  icon={<FiClock className="text-purple-400 text-xl" />}
                  title={t('requirements.crop_duration_title', 'Crop Duration')}
                  content={<span className="text-2xl font-display font-black text-purple-300">{data.crop_duration}</span>}
                  delay={0.4}
                  accent="purple"
                />
              </div>

              {/* Tip banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 glass-card p-4 bg-primary-900/20 border border-primary-500/20 flex items-start gap-3"
              >
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <p className="text-white/80 text-sm font-semibold mb-0.5">{t('requirements.pro_tip', 'Pro Tip for')} {t(`requirements.crops.${data.crop_name.toLowerCase().replace(/ /g, '_')}`, data.crop_name)}</p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {t('requirements.pro_tip_desc')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
