import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { FiMenu, FiX, FiLogOut, FiChevronDown, FiGlobe } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'

const NAV_LINKS = [
  { to: '/dashboard', labelKey: 'nav.dashboard' },
  { to: '/crop-recommendation', labelKey: 'nav.crop_ai' },
  { to: '/crop-requirements', labelKey: 'nav.crop_guide' },
  { to: '/disease-detection', labelKey: 'nav.disease' },
  { to: '/pest-detection', labelKey: 'nav.pest' },
  { to: '/fertilizer', labelKey: 'nav.fertilizer' },
  { to: '/market', labelKey: 'nav.market' },
  { to: '/map', labelKey: 'nav.map' },
  { to: '/community', labelKey: 'nav.community' },
  { to: '/weather', labelKey: 'nav.weather' },
  { to: '/satellite', labelKey: 'nav.satellite' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleLangChange = (lang) => {
    setLanguage(lang)
    setLangOpen(false)
  }

  const LANG_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ta', label: 'தமிழ்' },
  ]

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo – left aligned */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <GiWheat className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl gradient-text whitespace-nowrap">{t('brand_name')}</span>
          </Link>

          {/* Desktop Menu – center */}
          <div className="hidden lg:flex items-center gap-x-6 mx-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[12.5px] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  location.pathname === link.to
                    ? 'text-primary-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-[12.5px] font-semibold tracking-wider uppercase transition-colors ${
                  location.pathname === '/admin' ? 'text-primary-400' : 'text-white/60 hover:text-white'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Right side – profile/auth + language */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold focus:outline-none px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FiGlobe size={15} />
                <span>{language.toUpperCase()}</span>
                <FiChevronDown size={13} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-full mt-2 right-0 w-36 glass-card py-1 border border-white/10 rounded-xl overflow-hidden z-[60] shadow-xl"
                >
                  {LANG_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => handleLangChange(opt.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors ${
                        language === opt.code ? 'text-primary-400 bg-primary-500/10' : 'text-white/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-[12.5px] font-semibold tracking-wide uppercase text-white/60 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
              >
                <FiLogOut size={15} /> {t('nav.logout')}
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2 ripple">{t('nav.get_started')}</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-950/95 border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  {NAV_LINKS.map(l => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block nav-link py-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(l.labelKey)}
                    </Link>
                  ))}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block nav-link py-2" onClick={() => setMobileOpen(false)}>{t('nav.admin')}</Link>
                  )}
                  <button onClick={handleLogout} className="block text-red-400 py-2 text-sm">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block btn-secondary text-center mb-2" onClick={() => setMobileOpen(false)}>{t('nav.login')}</Link>
                  <Link to="/register" className="block btn-primary text-center pb-2 border-b border-white/5" onClick={() => setMobileOpen(false)}>{t('nav.get_started')}</Link>
                </>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="pt-2 flex justify-center gap-3">
                <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${language === 'en' ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>EN</button>
                <button onClick={() => setLanguage('hi')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${language === 'hi' ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>हिं</button>
                <button onClick={() => setLanguage('ta')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${language === 'ta' ? 'bg-primary-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>த</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
