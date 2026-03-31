import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCamera, FiCloud, FiStar, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi'
import { GiWheat, GiPlantRoots, GiEarthAmerica } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'

const FEATURES = [
  {
    icon: <GiWheat className="text-3xl text-primary-400" />,
    title: 'Crop Recommendation',
    description: 'AI-powered crop suggestions based on your soil composition, pH, nutrients, and local climate data.',
    color: 'from-primary-500/20 to-primary-700/10',
    border: 'border-primary-500/20',
  },
  {
    icon: <FiCamera className="text-3xl text-earth-400" />,
    title: 'Disease Detection',
    description: 'Upload or capture leaf images to instantly detect diseases with 95%+ accuracy CNN model.',
    color: 'from-earth-500/20 to-earth-700/10',
    border: 'border-earth-500/20',
  },
  {
    icon: <FiCloud className="text-3xl text-blue-400" />,
    title: 'Live Weather',
    description: 'Real-time weather forecasts including temperature, humidity, and rainfall probability for your region.',
    color: 'from-blue-500/20 to-blue-700/10',
    border: 'border-blue-500/20',
  },
  {
    icon: <GiEarthAmerica className="text-3xl text-teal-400" />,
    title: 'Satellite Insights',
    description: 'Satellite-based crop suitability analysis for your specific geographic location and soil conditions.',
    color: 'from-teal-500/20 to-teal-700/10',
    border: 'border-teal-500/20',
  },
  {
    icon: <FiShield className="text-3xl text-purple-400" />,
    title: 'Treatment Plans',
    description: 'Detailed organic and chemical treatment suggestions for identified crop diseases.',
    color: 'from-purple-500/20 to-purple-700/10',
    border: 'border-purple-500/20',
  },
  {
    icon: <FiTrendingUp className="text-3xl text-yellow-400" />,
    title: 'Yield Analytics',
    description: 'Track your crop history, disease records, and get personalized improvement recommendations.',
    color: 'from-yellow-500/20 to-yellow-700/10',
    border: 'border-yellow-500/20',
  },
]

const STATS = [
  { value: '22+', label: 'Crop Varieties' },
  { value: '38+', label: 'Disease Types' },
  { value: '95%', label: 'AI Accuracy' },
  { value: '10K+', label: 'Farmers Helped' },
]

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle bg-primary-500/20"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const { t } = useTranslation()
  const featuresRef = useRef(null)

  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
        <ParticleField />
        
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-earth-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <FiZap className="text-primary-400" />
            <span className="text-sm text-white/70 font-medium">{t('landing.badge', 'AI-Powered Agriculture Platform')}</span>
            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{t('common.new', 'New')}</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight mb-6"
          >
            {t('landing.hero_1', 'Farm Smarter')}
            <br />
            <span className="gradient-text">{t('landing.hero_2', 'With AI')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('landing.hero_subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="btn-primary ripple text-base px-8 py-4 flex items-center gap-2 group">
              {t('landing.get_started', 'Get Started Free')}
              <motion.span
                className="group-hover:translate-x-1 transition-transform"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FiArrowRight />
              </motion.span>
            </Link>
            <Link to="/disease-detection" className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
              <FiCamera /> {t('landing.detect_disease', 'Detect Disease')}
            </Link>
            <button
              onClick={scrollToFeatures}
              className="text-white/50 hover:text-white/80 transition-colors text-sm underline underline-offset-4"
            >
              {t('landing.learn_more', 'Learn more ↓')}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4 text-center"
              >
                <div className="text-3xl font-display font-black gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-white/40 font-medium">{t(`landing.stat_${i}_label`, s.label)}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating crop icons */}
        <motion.div
          className="absolute left-8 top-1/3 hidden xl:block"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div className="glass-card p-4 rounded-2xl">
            <GiWheat className="text-5xl text-primary-400" />
            <p className="text-xs text-white/50 mt-1 text-center">{t('landing.floating_wheat', 'Wheat')}</p>
          </div>
        </motion.div>
        <motion.div
          className="absolute right-8 top-1/3 hidden xl:block"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <div className="glass-card p-4 rounded-2xl">
            <GiPlantRoots className="text-5xl text-earth-400" />
            <p className="text-xs text-white/50 mt-1 text-center">{t('landing.floating_roots', 'Roots')}</p>
          </div>
        </motion.div>
        <motion.div
          className="absolute right-16 bottom-1/3 hidden xl:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <div className="glass-card p-4 rounded-2xl">
            <FiCamera className="text-4xl text-earth-300" />
            <p className="text-xs text-white/50 mt-1 text-center">{t('landing.floating_scan', 'Scan')}</p>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section ref={featuresRef} className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">{t('landing.features_label', 'Features')}</span>
            <h2 className="section-title mt-3 mb-4">{t('landing.features_title', 'Everything a Farmer Needs')}</h2>
            <p className="section-subtitle mx-auto">
              {t('landing.features_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`glass-card-hover p-6 bg-gradient-to-br ${f.color} border ${f.border} shine`}
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{t(`landing.feature_${i}_title`, f.title)}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{t(`landing.feature_${i}_desc`, f.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-primary-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">{t('landing.about_label', 'About Smart Crop')}</span>
              <h2 className="section-title mt-3 mb-6">
                {t('landing.about_title_1', 'Transforming Agriculture')}<br />
                <span className="gradient-text">{t('landing.about_title_2', 'with Data & AI')}</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                {t('landing.about_description_1', 'Smart Crop combines the power of machine learning, satellite data, and real-time weather APIs to give every farmer — regardless of their resources — the same intelligence previously only available to large agribusiness corporations.')}
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                {t('landing.about_description_2', 'Our Random Forest model analyzes 7 soil and climate parameters to recommend the best crop for your land, while our CNN model detects 38+ plant diseases from a single leaf photo.')}
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 ripple">
                <FiStar /> {t('landing.about_cta', 'Join Smart Crop Today')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Random Forest', sub: 'Crop Recommendation', icon: '🌾', pct: 94 },
                { label: 'CNN Model', sub: 'Disease Detection', icon: '🔬', pct: 95 },
                { label: 'Weather API', sub: 'Real-time Data', icon: '🌦️', pct: 99 },
                { label: 'Satellite AI', sub: 'Crop Suitability', icon: '🛰️', pct: 91 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-5 text-center"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-display font-black gradient-text mb-1">{item.pct}%</div>
                  <div className="text-white font-semibold text-sm">{t(`landing.about_stat_${i}_label`, item.label)}</div>
                  <div className="text-white/40 text-xs">{t(`landing.about_stat_${i}_sub`, item.sub)}</div>
                  <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 animated-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
              {t('landing.cta_title', 'Ready to Transform Your Farm?')}
            </h2>
            <p className="text-white/60 text-lg mb-10">
              {t('landing.cta_subtitle', 'Join thousands of farmers already using Smart Crop to maximize yields and minimize losses.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-10 py-4 ripple">
                {t('landing.cta_start_free', 'Start For Free')}
              </Link>
              <Link to="/crop-recommendation" className="btn-secondary text-lg px-10 py-4">
                {t('landing.cta_try_ai', 'Try Crop AI')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">🌿</span>
            </div>
            <span className="font-display font-bold text-white/80">{t('common.app_name', 'Smart Crop')}</span>
          </div>
          <p className="text-white/30 text-sm">{t('common.copyright', '© 2026 Smart Crop. Empowering farmers with AI.')}</p>
          <div className="flex gap-4 text-white/30 text-sm">
            <a href="#" className="hover:text-white/60 transition-colors">{t('common.privacy', 'Privacy')}</a>
            <a href="#" className="hover:text-white/60 transition-colors">{t('common.terms', 'Terms')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
