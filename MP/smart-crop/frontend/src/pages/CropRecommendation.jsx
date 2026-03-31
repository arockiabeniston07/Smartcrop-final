import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiChevronDown, FiZap, FiCheck, FiDownload } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Loamy', 'Clay', 'Peaty']

const INITIAL = {
  soilType: 'Alluvial', N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '', location: ''
}

function RangeInput({ label, name, value, onChange, min, max, unit, hint }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="label-field mb-0">{label}</label>
        <span className="text-primary-400 font-mono text-sm font-bold">{value || 0} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} name={name} value={value || 0}
        onChange={onChange}
        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-500"
      />
      <div className="flex justify-between text-xs text-white/30 mt-0.5">
        <span>{min} {unit}</span><span className="text-white/20 text-xs">{hint}</span><span>{max} {unit}</span>
      </div>
    </div>
  )
}

export default function CropRecommendation() {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await axios.post('/api/crop/recommend', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || t('crop_rec.error_msg'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <GiWheat className="text-primary-400" />
            <span className="text-sm text-white/70">AI Crop Advisor</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('crop_rec.title')}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('crop_rec.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
              <h2 className="text-white font-display font-bold text-xl mb-2">{t('crop_rec.soil_params')}</h2>

              {/* Soil type dropdown */}
              <div>
                <label className="label-field">{t('crop_rec.soil_type')}</label>
                <div className="relative">
                  <select
                    name="soilType" value={form.soilType} onChange={update}
                    className="input-field appearance-none pr-10"
                  >
                    {SOIL_TYPES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              {/* Range sliders */}
              <RangeInput label={t('crop_rec.nitrogen') || 'Nitrogen (N)'} name="N" value={form.N} onChange={update} min={0} max={140} unit="kg/ha" />
              <RangeInput label={t('crop_rec.phosphorus') || 'Phosphorus (P)'} name="P" value={form.P} onChange={update} min={0} max={145} unit="kg/ha" />
              <RangeInput label={t('crop_rec.potassium') || 'Potassium (K)'} name="K" value={form.K} onChange={update} min={0} max={205} unit="kg/ha" />
              <RangeInput label={t('crop_rec.temperature') || 'Temperature'} name="temperature" value={form.temperature} onChange={update} min={0} max={50} unit="°C" />
              <RangeInput label={t('crop_rec.humidity') || 'Humidity'} name="humidity" value={form.humidity} onChange={update} min={0} max={100} unit="%" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">{t('crop_rec.ph_level')}</label>
                  <input
                    type="number" name="ph" step="0.1" min="0" max="14"
                    className="input-field" placeholder="6.5" value={form.ph} onChange={update} required
                  />
                </div>
                <div>
                  <label className="label-field">{t('crop_rec.rainfall')}</label>
                  <input
                    type="number" name="rainfall" className="input-field" placeholder="200"
                    value={form.rainfall} onChange={update} required
                  />
                </div>
              </div>

              <div>
                <label className="label-field">{t('crop_rec.location')}</label>
                <input
                  type="text" name="location" className="input-field" placeholder="e.g. Nagpur"
                  value={form.location} onChange={update}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 rounded-xl p-3">{error}</p>
              )}

              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary ripple w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><div className="spinner w-5 h-5" /> {t('crop_rec.btn_analyzing')}</>
                ) : (
                  <><FiZap /> {t('crop_rec.btn_recommend')}</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Result panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-12 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <div className="spinner w-10 h-10" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 text-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >🌾</motion.div>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">{t('crop_rec.ai_analyzing')}</p>
                  <p className="text-white/40 text-sm">{t('crop_rec.evaluating')}</p>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-4"
                >
                  <div className="text-5xl mb-2 text-red-500">🌾</div>
                  <h3 className="text-white font-bold text-lg">{t('common.data_unavailable', 'Analysis Interrupted')}</h3>
                  <p className="text-white/40 text-sm mb-4 leading-relaxed">{error}</p>
                  <button 
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-3 flex items-center gap-2 border-none shadow-lg shadow-primary-500/20"
                  >
                    🔄 {t('common.retry', 'Retry Analysis')}
                  </button>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4 print-section"
                >
                  <button 
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-center gap-2 text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-4 py-3 rounded-xl transition-colors text-sm font-semibold print:hidden border border-primary-500/20"
                  >
                    <FiDownload /> Download PDF Report
                  </button>
                  
                  {/* Main result */}
                  <div className="glass-card p-6 bg-gradient-to-br from-primary-900/50 to-primary-950/50 border-primary-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-2xl">
                        {result.emoji || '🌾'}
                      </div>
                      <div>
                        <div className="text-white/50 text-xs font-medium uppercase tracking-widest">{t('crop_rec.top_rec')}</div>
                        <div className="text-white font-display font-black text-2xl">{result.crop}</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-3xl font-display font-black text-primary-400">{result.confidence}%</div>
                        <div className="text-white/40 text-xs">{t('crop_rec.confidence')}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{result.description}</p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                      <div className="text-white/40 text-xs mb-1">{t('crop_rec.best_season')}</div>
                      <div className="text-white font-semibold">{result.season || 'Kharif'}</div>
                    </div>
                    <div className="glass-card p-4">
                      <div className="text-white/40 text-xs mb-1">{t('crop_rec.water_req')}</div>
                      <div className="text-white font-semibold">{result.water || 'Medium'}</div>
                    </div>
                    <div className="glass-card p-4">
                      <div className="text-white/40 text-xs mb-1">{t('crop_rec.yield_pot')}</div>
                      <div className="text-primary-400 font-semibold">{result.yield || '2-4 tons/ha'}</div>
                    </div>
                    <div className="glass-card p-4">
                      <div className="text-white/40 text-xs mb-1">{t('crop_rec.market_demand')}</div>
                      <div className="text-earth-400 font-semibold">{result.demand || 'High'}</div>
                    </div>
                  </div>

                  {/* Alternatives */}
                  {result.alternatives && result.alternatives.length > 0 && (
                    <div className="glass-card p-4">
                      <h4 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">{t('crop_rec.also_consider')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.alternatives.map((alt, i) => (
                          <span key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white/60">
                            <FiCheck className="text-primary-400 text-xs" /> {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-64"
                >
                  <div className="text-6xl opacity-30">🌱</div>
                  <p className="text-white/30 text-sm">{t('crop_rec.fill_params')}<br /><strong className="text-white/50">{t('crop_rec.btn_recommend')}</strong> {t('crop_rec.to_get_suggestions')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
