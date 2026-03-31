import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiRefreshCw, FiMapPin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const MOCK_FORECAST = [
  { day: 'Today', icon: '⛅', high: 32, low: 22, rain: 20, desc: 'Partly Cloudy' },
  { day: 'Fri', icon: '🌧️', high: 27, low: 19, rain: 75, desc: 'Heavy Rain' },
  { day: 'Sat', icon: '🌦️', high: 29, low: 21, rain: 40, desc: 'Light Rain' },
  { day: 'Sun', icon: '☀️', high: 34, low: 24, rain: 5, desc: 'Sunny' },
  { day: 'Mon', icon: '⛅', high: 31, low: 22, rain: 15, desc: 'Partly Cloudy' },
  { day: 'Tue', icon: '☀️', high: 35, low: 25, rain: 5, desc: 'Clear' },
  { day: 'Wed', icon: '🌤️', high: 33, low: 23, rain: 10, desc: 'Mostly Sunny' },
]

function WeatherMetric({ icon, label, value, unit, color = 'text-white' }) {
  return (
    <div className="glass-card p-5 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-2xl font-display font-black ${color}`}>{value}<span className="text-sm font-normal text-white/40 ml-1">{unit}</span></div>
      <div className="text-white/40 text-xs mt-0.5">{label}</div>
    </div>
  )
}

export default function WeatherPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState(user?.location || 'Delhi')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSimulated, setIsSimulated] = useState(false)

  useEffect(() => { fetchWeather() }, [city])

  const fetchWeather = async () => {
    setLoading(true)
    setError('')
    setIsSimulated(false)
    try {
      const res = await axios.get(`/api/weather/${city}`)
      setWeather(res.data)
    } catch {
      // Use mock data if API fails
      setIsSimulated(true)
      setWeather({
        city, temp: 30, feel: 28, humidity: 68, windspeed: 14,
        pressure: 1012, visibility: 10, uvIndex: 7,
        rainChance: 30, description: 'Partly Cloudy', icon: '⛅',
        sunrise: '06:15', sunset: '18:45'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) { setCity(input.trim()); setInput('') }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('weather.title_p_1', 'Weather')} <span className="gradient-text">{t('weather.title_p_2', 'Intelligence')}</span>
          </h1>
          <p className="text-white/50">{t('weather.subtitle')}</p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                className="input-field pl-10" placeholder={t('weather.search_city')}
              />
            </div>
            <button type="submit" className="btn-primary px-5 flex items-center gap-2">
              {t('common.search', 'Search')}
            </button>
            <button type="button" onClick={fetchWeather} className="glass-card p-3 text-white/60 hover:text-white transition-colors">
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </form>
        </motion.div>

        {weather && (
          <>
            <AnimatePresence>
              {isSimulated && (
                <motion.div 
                  initial={{ opacity: 0, h: 0 }}
                  animate={{ opacity: 1, h: 'auto' }}
                  className="max-w-lg mx-auto mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold">
                    <FiAlertTriangle className="flex-shrink-0" />
                    <span>{t('weather.simulated_notice', 'Showing simulated data due to connection issues')}</span>
                  </div>
                  <button onClick={fetchWeather} className="text-[10px] uppercase font-bold text-amber-500 hover:underline">
                    {t('common.retry', 'Retry')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Current weather hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 mb-6 bg-gradient-to-br from-blue-900/40 to-primary-900/30 border-blue-500/20 relative overflow-hidden"
            >
              <div className="absolute right-4 top-4 text-[8rem] opacity-10 select-none">{weather.icon}</div>
              <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white/50 text-sm flex items-center gap-1.5 mb-2">
                      <FiMapPin size={12} /> {weather.city || city}
                    </p>
                    <div className="text-8xl font-display font-black text-white leading-none">{weather.temp}°</div>
                    <div className="text-white/60 mt-2 text-lg">{t(`weather.${weather.description.toLowerCase().replace(/ /g, '_')}`, weather.description)}</div>
                    <div className="text-white/30 text-sm mt-1">{t('weather.feels_like')} {weather.feel}°C</div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="glass-card px-4 py-2 flex items-center gap-2">
                      <span>🌅</span><span className="text-white/60">{t('weather.sunrise')} {weather.sunrise}</span>
                    </div>
                    <div className="glass-card px-4 py-2 flex items-center gap-2">
                      <span>🌇</span><span className="text-white/60">{t('weather.sunset')} {weather.sunset}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metrics grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
            >
              <WeatherMetric icon="💧" label={t('weather.humidity')} value={weather.humidity} unit="%" color="text-blue-300" />
              <WeatherMetric icon="💨" label={t('weather.wind')} value={weather.windspeed} unit="km/h" color="text-teal-300" />
              <WeatherMetric icon="🌧️" label={t('weather.rain_chance', 'Rain Chance')} value={weather.rainChance} unit="%" color="text-sky-300" />
              <WeatherMetric icon="👁️" label={t('weather.visibility')} value={weather.visibility} unit="km" color="text-purple-300" />
              <WeatherMetric icon="🌡️" label={t('weather.pressure')} value={weather.pressure} unit="hPa" color="text-orange-300" />
              <WeatherMetric icon="☀️" label={t('weather.uv_index')} value={weather.uvIndex} unit="" color="text-yellow-300" />
              <WeatherMetric icon="🌡️" label={t('weather.feels_like')} value={weather.feel} unit="°C" color="text-red-300" />
              <WeatherMetric icon="🌿" label={t('weather.ideal_for', 'Ideal For')} value={t('weather.rice', 'Rice')} unit="" color="text-primary-300" />
            </motion.div>

            {/* 7-day forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-white font-display font-bold text-lg mb-5">{t('weather.forecast')}</h3>
              <div className="grid grid-cols-7 gap-2">
                {MOCK_FORECAST.map((d, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="glass-card p-3 text-center transition-all duration-200"
                  >
                    <div className="text-white/40 text-xs mb-2 font-medium">{d.day}</div>
                    <div className="text-2xl mb-2">{d.icon}</div>
                    <div className="text-white text-xs font-bold">{d.high}°</div>
                    <div className="text-white/30 text-xs">{d.low}°</div>
                    <div className="text-sky-400 text-xs mt-1">{d.rain}%</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Farming advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 mt-6 bg-gradient-to-br from-primary-900/30 to-transparent border-primary-500/20"
            >
              <h3 className="text-white font-display font-bold text-lg mb-4">🌾 {t('weather.farm_advisory')}</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-primary-400 font-semibold mb-1">{t('weather.ideal_activities', 'Ideal Activities')}</div>
                  <div className="text-white/60">{t('weather.soil_prep', 'Soil preparation, fertilizer application. Avoid irrigation if rain expected.')}</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-semibold mb-1">{t('weather.risk_title', 'Disease Risk')}</div>
                  <div className="text-white/60">{t('weather.fungal_risk', 'Moderate fungal risk due to humidity. Monitor rice, wheat for early blight.')}</div>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold mb-1">{t('weather.irrigation', 'Water Management')}</div>
                  <div className="text-white/60">{t('weather.water_save', 'Save water today — rain expected Friday. Reduce drip irrigation by 30%.')}</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
