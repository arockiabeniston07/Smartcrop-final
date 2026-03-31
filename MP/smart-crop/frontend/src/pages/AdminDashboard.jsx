import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiUsers, FiDatabase, FiTrash2, FiEdit2, FiPlus, FiSearch, FiX, FiCheck } from 'react-icons/fi'
import { GiWheat } from 'react-icons/gi'

const TABS = ['Users', 'Crop Data', 'Disease Data', 'Pests', 'Fertilizers', 'Community', 'Predictions']

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active ? 'bg-primary-500 text-white' : 'text-white/50 hover:text-white glass-card'
      }`}
    >
      {children}
    </button>
  )
}

function Table({ columns, rows, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map(c => (
              <th key={c} className="text-left py-3 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">{c}</th>
            ))}
            <th className="text-right py-3 px-3 text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              {columns.map(c => (
                <td key={c} className="py-3 px-3 text-white/70">
                  {c === 'role' ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row[c] === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary-500/20 text-primary-400'
                    }`}>{row[c]}</span>
                  ) : c === 'status' ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      row[c] === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{row[c]}</span>
                  ) : (
                    <span className="truncate block max-w-[160px]">{String(row[c] ?? '—')}</span>
                  )}
                </td>
              ))}
              <td className="py-3 px-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit?.(row)} className="p-1.5 hover:bg-primary-500/20 rounded-lg text-white/40 hover:text-primary-400 transition-colors">
                    <FiEdit2 size={13} />
                  </button>
                  <button onClick={() => onDelete?.(row._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const MOCK_USERS = [
  { _id: '1', name: 'Rajesh Kumar', email: 'rajesh@farm.com', location: 'Punjab', role: 'farmer', status: 'active' },
  { _id: '2', name: 'Priya Sharma', email: 'priya@farm.com', location: 'Maharashtra', role: 'farmer', status: 'active' },
  { _id: '3', name: 'Admin User', email: 'admin@demo.com', location: 'Delhi', role: 'admin', status: 'active' },
]
const MOCK_CROPS = [
  { _id: '1', name: 'Rice', season: 'Kharif', soilType: 'Alluvial', ph: '5.5-7.0', water: 'High' },
  { _id: '2', name: 'Wheat', season: 'Rabi', soilType: 'Loamy', ph: '6.0-7.5', water: 'Medium' },
  { _id: '3', name: 'Maize', season: 'Kharif', soilType: 'Sandy', ph: '5.8-7.0', water: 'Medium' },
]
const MOCK_DISEASES = [
  { _id: '1', name: 'Leaf Blight', plant: 'Rice', severity: 'High', treatment: 'Mancozeb 2.5g/L', organic: 'Neem spray' },
  { _id: '2', name: 'Powdery Mildew', plant: 'Wheat', severity: 'Medium', treatment: 'Carbendazim 1g/L', organic: 'Baking soda' },
  { _id: '3', name: 'Brown Spot', plant: 'Rice', severity: 'Medium', treatment: 'Propiconazole 1ml/L', organic: 'Garlic extract' },
]
const MOCK_PESTS = [
  { _id: '1', pest_name: 'Aphids', severity: 'High', control_method: 'Neem Oil' },
  { _id: '2', pest_name: 'Whitefly', severity: 'Medium', control_method: 'Imidacloprid' },
]
const MOCK_FERTILIZERS = [
  { _id: '1', crop_type: 'Wheat', n: 120, p: 40, k: 30, recommended_fertilizer: 'Urea (260kg)' },
]
const MOCK_COMMUNITY = [
  { _id: '1', authorName: 'Rajesh', category: 'Question', content: 'Wheat leaves turning yellow?' },
]
const SUMMARY_STATS = [
  { label: 'Total Users', value: 247, icon: <FiUsers />, color: 'text-primary-400 bg-primary-500/20' },
  { label: 'Crop Predictions', value: 1842, icon: <GiWheat />, color: 'text-earth-400 bg-earth-500/20' },
  { label: 'Diseases Detected', value: 529, icon: '🔬', color: 'text-red-400 bg-red-500/20' },
  { label: 'DB Collections', value: 6, icon: <FiDatabase />, color: 'text-blue-400 bg-blue-500/20' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('Users')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(MOCK_USERS)
  const [crops, setCrops] = useState(MOCK_CROPS)
  const [diseases, setDiseases] = useState(MOCK_DISEASES)
  const [pests, setPests] = useState(MOCK_PESTS)
  const [fertilizers, setFertilizers] = useState(MOCK_FERTILIZERS)
  const [community, setCommunity] = useState(MOCK_COMMUNITY)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [newCrop, setNewCrop] = useState({ name: '', season: '', soilType: '', ph: '', water: '' })

  useEffect(() => { fetchData() }, [tab])

  const fetchData = async () => {
    try {
      if (tab === 'Users') {
        const res = await axios.get('/api/admin/users')
        setUsers(res.data)
      } else if (tab === 'Crop Data') {
        const res = await axios.get('/api/admin/crops')
        setCrops(res.data)
      } else if (tab === 'Disease Data') {
        const res = await axios.get('/api/admin/diseases')
        setDiseases(res.data)
      } else if (tab === 'Pests') {
        const res = await axios.get('/api/admin/pests')
        setPests(res.data)
      } else if (tab === 'Fertilizers') {
        const res = await axios.get('/api/admin/fertilizers')
        setFertilizers(res.data)
      } else if (tab === 'Community') {
        const res = await axios.get('/api/admin/community')
        setCommunity(res.data)
      }
    } catch {} // use mock data
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return
    try {
      const endpoint = tab === 'Users' ? 'users' : tab === 'Crop Data' ? 'crops' : 'diseases'
      await axios.delete(`/api/admin/${endpoint}/${id}`)
    } catch {}
    if (tab === 'Users') setUsers(p => p.filter(u => u._id !== id))
    if (tab === 'Crop Data') setCrops(p => p.filter(c => c._id !== id))
    if (tab === 'Disease Data') setDiseases(p => p.filter(d => d._id !== id))
    if (tab === 'Pests') setPests(p => p.filter(d => d._id !== id))
    if (tab === 'Fertilizers') setFertilizers(p => p.filter(d => d._id !== id))
    if (tab === 'Community') setCommunity(p => p.filter(d => d._id !== id))
  }

  const handleAddCrop = async () => {
    if (!newCrop.name) return
    const added = { ...newCrop, _id: Date.now().toString() }
    setCrops(p => [added, ...p])
    setShowModal(false)
    setNewCrop({ name: '', season: '', soilType: '', ph: '', water: '' })
    try { await axios.post('/api/admin/crops', newCrop) } catch {}
  }

  const filtered = (data) => {
    if (!search) return data
    const s = search.toLowerCase()
    return data.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(s)))
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-white/40 text-sm">Manage all farmers, crops, and application data</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add New Crop
            </button>
          </div>
        </motion.div>

        {/* Summary stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {SUMMARY_STATS.map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className="glass-card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-2xl font-display font-black text-white">{s.value.toLocaleString()}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          {/* Tabs + search */}
          <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {TABS.map(t => <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>{t}</TabButton>)}
            </div>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 text-sm py-2"
                placeholder="Search records..."
              />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {tab === 'Users' && (
                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['name', 'email', 'location', 'role', 'status']}
                    rows={filtered(users)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Crop Data' && (
                <motion.div key="crops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['name', 'season', 'soilType', 'ph', 'water']}
                    rows={filtered(crops)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Disease Data' && (
                <motion.div key="diseases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['name', 'plant', 'severity', 'treatment', 'organic']}
                    rows={filtered(diseases)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Pests' && (
                <motion.div key="pests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['pest_name', 'severity', 'control_method']}
                    rows={filtered(pests)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Fertilizers' && (
                <motion.div key="fert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['crop_type', 'n', 'p', 'k', 'recommended_fertilizer']}
                    rows={filtered(fertilizers)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Community' && (
                <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Table
                    columns={['authorName', 'category', 'content']}
                    rows={filtered(community)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              )}
              {tab === 'Predictions' && (
                <motion.div key="preds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-white/40 text-center py-12">
                    <div className="text-4xl mb-3">📊</div>
                    <p>All predictions from {users.length} farmers tracked across 6 MongoDB collections.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Add Crop Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-display font-bold text-xl">Add New Crop</h3>
                  <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                    <FiX />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { k: 'name', ph: 'Crop Name (e.g. Jowar)' },
                    { k: 'season', ph: 'Season (e.g. Kharif)' },
                    { k: 'soilType', ph: 'Soil Type (e.g. Black)' },
                    { k: 'ph', ph: 'pH Range (e.g. 6.0-7.5)' },
                    { k: 'water', ph: 'Water Need (Low/Medium/High)' },
                  ].map(({ k, ph }) => (
                    <input
                      key={k}
                      type="text"
                      className="input-field"
                      placeholder={ph}
                      value={newCrop[k]}
                      onChange={e => setNewCrop({ ...newCrop, [k]: e.target.value })}
                    />
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleAddCrop} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <FiCheck /> Add Crop
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
