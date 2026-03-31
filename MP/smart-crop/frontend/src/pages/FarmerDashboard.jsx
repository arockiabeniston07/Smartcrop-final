import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { FiCloud, FiCpu, FiTrendingUp, FiMapPin, FiActivity, FiMap, FiMessageCircle, FiThermometer, FiDroplet, FiWind, FiEye } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { GiWheat } from 'react-icons/gi'

const MOCK_WEATHER = {
  temp: 28, feel: 26, humidity: 72, windspeed: 12, description: 'Partly Cloudy',
  icon: '⛅', rainChance: 35, city: 'Your Location'
}

const CHART_DATA = [
  { month: 'Oct', predictions: 4 },
  { month: 'Nov', predictions: 7 },
  { month: 'Dec', predictions: 5 },
  { month: 'Jan', predictions: 9 },
  { month: 'Feb', predictions: 11 },
  { month: 'Mar', predictions: 6 },
]
const PIE_DATA = [
  { name: 'Rice', value: 35 },
  { name: 'Wheat', value: 25 },
  { name: 'Maize', value: 20 },
  { name: 'Others', value: 20 },
]
const PIE_COLORS = ['#22c55e', '#d67d31', '#f5e5a8', '#4ade80']

function StatCard({ icon, label, value, sub, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="glass-card-hover p-6 shine"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-display font-black text-white mb-1">{value}</div>
      <div className="text-white/80 font-semibold text-sm">{label}</div>
      {sub && <div className="text-white/40 text-xs mt-0.5">{sub}</div>}
    </motion.div>
  )
}

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const CARDS = [
    { title: t('dashboard.crop_recommendation'), desc: t('dashboard.crop_desc'), icon: <FiCpu className="text-3xl" />, link: '/crop-recommendation', color: 'from-green-500/20 to-primary-600/20', border: 'border-green-500/30' },
    { title: t('dashboard.disease_detection'), desc: t('dashboard.disease_desc'), icon: <FiActivity className="text-3xl" />, link: '/disease-detection', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
    { title: t('dashboard.weather_forecast'), desc: t('dashboard.weather_desc'), icon: <FiCloud className="text-3xl" />, link: '/weather', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { title: t('dashboard.satellite_monitoring'), desc: t('dashboard.satellite_desc'), icon: <FiMap className="text-3xl" />, link: '/satellite', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
    { title: t('dashboard.crop_guide'), desc: t('dashboard.guide_desc'), icon: <span className="text-3xl">🌱</span>, link: '/crop-requirements', color: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/30' }
  ]
  const [data, setData] = useState({ cropPredictions: [], diseasePredictions: [], weather: null })
  const [weather, setWeather] = useState(MOCK_WEATHER)

  useEffect(() => {
    fetchDashboard()
    fetchWeather()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/dashboard')
      setData(res.data)
    } catch {}
  }

  const fetchWeather = async () => {
    try {
      const city = user?.location || 'Delhi'
      const res = await axios.get(`/api/weather/${city}`)
      setWeather(res.data)
    } catch {}
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                {user?.role === 'admin' ? t('dashboard.role_admin') : t('dashboard.role_farmer')}
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight mb-2">
                {t('dashboard.welcome')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-300">{user?.name}</span>
              </h1>
              <p className="text-white/50 text-lg flex items-center gap-2">
                <FiMapPin /> {user?.location || 'India'}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions Grid Header */}
          <div className="mb-8">
            <h2 className="text-white font-display font-bold text-xl mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-primary-400" /> {t('dashboard.active_farm_modules')}
            </h2>
          </div>
        {/* Weather banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8 bg-gradient-to-r from-blue-900/40 to-primary-900/40 border-blue-500/20 overflow-hidden relative"
        >
          <div className="absolute right-4 top-4 text-7xl opacity-20">{weather.icon}</div>
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><FiThermometer />Temperature</p>
              <p className="text-4xl font-display font-black text-white">{weather.temp}°C</p>
              <p className="text-white/40 text-xs">Feels {weather.feel}°C</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><FiDroplet />Humidity</p>
              <p className="text-4xl font-display font-black text-blue-300">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><FiWind />Wind</p>
              <p className="text-4xl font-display font-black text-teal-300">{weather.windspeed}</p>
              <p className="text-white/40 text-xs">km/h</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><FiCloud />Rain Chance</p>
              <p className="text-4xl font-display font-black text-sky-300">{weather.rainChance}%</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-white/60 text-sm">{weather.description} · {user?.location || 'Your Location'}</p>
            <Link to="/weather" className="text-primary-400 text-xs hover:text-primary-300 transition-colors">
              View Full Weather →
            </Link>
          </div>
        </motion.div>

        {/* Quick action stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              icon={<GiWheat className="text-primary-400 text-2xl" />}
              label="Crop Predictions"
              value={data.cropPredictions?.length || 12}
              sub="Total this season"
              color="bg-primary-500/20"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={<FiActivity className="text-earth-400 text-2xl" />}
              label="Diseases Detected"
              value={data.diseasePredictions?.length || 5}
              sub="Identified & treated"
              color="bg-earth-500/20"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={<FiTrendingUp className="text-green-400 text-2xl" />}
              label="Success Rate"
              value="94%"
              sub="Prediction accuracy"
              color="bg-green-500/20"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={<FiEye className="text-blue-400 text-2xl" />}
              label="Satellite Scans"
              value="8"
              sub="Region analyses"
              color="bg-blue-500/20"
            />
          </motion.div>
        </motion.div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Activity chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 md:col-span-2"
          >
            <h3 className="text-white font-display font-bold text-lg mb-4">Prediction Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,15,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }}
                />
                <Area type="monotone" dataKey="predictions" stroke="#22c55e" strokeWidth={2} fill="url(#colorPred)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop pie chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-white font-display font-bold text-lg mb-4">Top Crops</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(10,15,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {PIE_DATA.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-white/50">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {CARDS.map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03, y: -2 }}>
              <Link
                to={item.link}
                className={`glass-card p-5 flex flex-col items-center justify-center gap-3 text-center h-full transition-all duration-300 bg-gradient-to-br ${item.color} border ${item.border} hover:shadow-lg hover:shadow-primary-500/10`}
              >
                {item.icon}
                <span className="text-white font-semibold text-sm">{item.title}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
