import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiRefreshCw, FiDroplet, FiTrendingUp } from 'react-icons/fi'
import { GiFertilizerBag, GiSprout } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'

const SOIL_TYPES = ['Sandy', 'Loamy', 'Black', 'Red', 'Clay']

export default function FertilizerRecommendation() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    cropType: '', soilType: 'Loamy', N: '', P: '', K: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await axios.post('/api/fertilizer/recommend', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || t('fertilizer.error_msg', 'Failed to get recommendation'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border-emerald-500/20">
            <GiFertilizerBag className="text-emerald-400 text-lg" />
            <span className="text-sm text-emerald-400/80 font-semibold">{t('fertilizer.badge')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('fertilizer.title')}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('fertilizer.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="glass-card p-6 border-emerald-500/10">
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase mb-1.5 block">{t('fertilizer.target_crop')}</label>
                  <input type="text" name="cropType" value={form.cropType} onChange={handleChange} required placeholder={t('fertilizer.crop_placeholder') || "e.g. Rice, Wheat, Cotton"} className="input-field" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase mb-1.5 block">{t('fertilizer.soil_type')}</label>
                  <select name="soilType" value={form.soilType} onChange={handleChange} className="input-field appearance-none">
                    {SOIL_TYPES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div className="col-span-3 text-white/40 text-xs text-center border-b border-white/5 pb-2 mb-1">{t('fertilizer.soil_test_results')}</div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase mb-1.5 flex items-center gap-1"><span className="text-blue-400 font-black">N</span> {t('fertilizer.nitrogen')}</label>
                    <input type="number" name="N" value={form.N} onChange={handleChange} required min="0" max="200" className="input-field text-center" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase mb-1.5 flex items-center gap-1"><span className="text-orange-400 font-black">P</span> {t('fertilizer.phosphorus')}</label>
                    <input type="number" name="P" value={form.P} onChange={handleChange} required min="0" max="200" className="input-field text-center" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase mb-1.5 flex items-center gap-1"><span className="text-red-400 font-black">K</span> {t('fertilizer.potassium')}</label>
                    <input type="number" name="K" value={form.K} onChange={handleChange} required min="0" max="200" className="input-field text-center" />
                  </div>
                </div>
              </div>

              {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50">
                {loading ? <><FiRefreshCw className="animate-spin" /> {t('fertilizer.btn_processing')}</> : <><GiFertilizerBag /> {t('fertilizer.btn_find')}</>}
              </motion.button>
            </form>
          </motion.div>

          {/* Result Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  {/* Hero Result */}
                  <div className="glass-card p-6 lg:p-8 bg-gradient-to-br from-emerald-950/40 to-green-900/20 border-emerald-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <GiSprout className="text-9xl text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-emerald-400/80 text-xs uppercase tracking-widest mb-1 font-semibold flex items-center gap-1">{t('fertilizer.primary_rec')}</div>
                      <h2 className="text-white font-display font-black text-3xl sm:text-4xl mb-4 text-emerald-400">{result.primary_recommendation}</h2>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm mt-6">
                        <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-500/20">
                          <FiTrendingUp /> <span className="font-bold">{result.quantity_per_acre}</span>
                        </div>
                        <div className="bg-white/5 text-white/60 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                          <GiSprout /> {t('fertilizer.for_crop')} {form.cropType || 'Crop'} 
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Instructions */}
                    <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
                      <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2"><FiDroplet /> {t('fertilizer.application_guide')}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{result.application_instructions}</p>
                    </div>

                    {/* Organic Alternatives */}
                    <div className="glass-card p-6 border-green-500/20 bg-green-500/5">
                      <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2"><GiSprout /> {t('fertilizer.organic_alternatives')}</h3>
                      <ul className="space-y-2">
                        {result.organic_alternatives?.map((org, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-green-400 mt-0.5">•</span> {org}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-4 min-h-[400px]"
                >
                  <div className="text-5xl mb-2 text-red-500">🌱</div>
                  <h3 className="text-white font-bold text-lg">{t('common.data_unavailable', 'Calculation Failed')}</h3>
                  <p className="text-white/40 text-sm mb-4 leading-relaxed">{error}</p>
                  <button 
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-3 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-500/20"
                  >
                    🔄 {t('common.retry', 'Retry Calculation')}
                  </button>
                </motion.div>
              ) : (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px] border-white/5">
                  <div className="text-6xl opacity-20 text-white mb-4"><GiFertilizerBag /></div>
                  <h3 className="text-white/60 font-semibold mb-2">{t('fertilizer.awaiting_data')}</h3>
                  <p className="text-white/30 text-sm max-w-xs mx-auto">{t('fertilizer.enter_results')}</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
