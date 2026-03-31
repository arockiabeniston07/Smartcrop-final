import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiMapPin, FiAlertCircle } from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Farmer', Icon: FiUser },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', Icon: FiMail },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', Icon: FiLock },
    { key: 'location', label: 'Location / City', type: 'text', placeholder: 'e.g. Pune, Maharashtra', Icon: FiMapPin },
  ]

  return (
    <div className="min-h-screen page-container flex items-center justify-center px-4 pt-16 pb-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-earth-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-earth-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
            <FaLeaf className="text-3xl text-white" />
          </div>
          <h1 className="font-display font-black text-3xl text-white mb-2">Join Smart Crop</h1>
          <p className="text-white/50">Create your free farmer account</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-red-400 text-sm"
            >
              <FiAlertCircle /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, type, placeholder, Icon }) => (
              <div key={key}>
                <label className="label-field">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={type}
                    className="input-field pl-10"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={update(key)}
                    required
                  />
                </div>
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary ripple w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="spinner w-5 h-5" /> Creating Account...</>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
