import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiUpload, FiCamera, FiX, FiAlertTriangle, FiTarget, FiDownload } from 'react-icons/fi'
import { TbBug } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

export default function PestDetection() {
  const { t } = useTranslation()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()
  const cameraRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const captureFromCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      cameraRef.current.srcObject = stream
      cameraRef.current.style.display = 'block'
      setCameraActive(true)
      setPreview(null)
      setImage(null)
    } catch {
      setError(t('pest.camera_error', 'Camera access denied. Please upload an image instead.'))
    }
  }

  const snapPhoto = () => {
    if (!cameraRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = cameraRef.current.videoWidth
    canvas.height = cameraRef.current.videoHeight
    canvas.getContext('2d').drawImage(cameraRef.current, 0, 0)
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "pest_capture.jpg", { type: "image/jpeg" })
      handleFile(file)
      
      const stream = cameraRef.current.srcObject
      const tracks = stream?.getTracks()
      tracks?.forEach(track => track.stop())
      cameraRef.current.style.display = 'none'
      setCameraActive(false)
    }, 'image/jpeg')
  }

  const handleSubmit = async () => {
    if (!image) return setError(t('pest.upload_error', 'Please upload or capture an image of the pest/leaf first.'))
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', image)
      const res = await axios.post('/api/pest/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || t('pest.detect_error', 'Detection failed. Ensure AI service is running at http://localhost:5001 (cd ai-model && python app.py)'))
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError('')
    if (cameraActive) {
      const stream = cameraRef.current.srcObject
      const tracks = stream?.getTracks()
      tracks?.forEach(track => track.stop())
      cameraRef.current.style.display = 'none'
      setCameraActive(false)
    }
  }

  const severityColor = (conf) => {
    if (conf > 80) return 'text-red-400'
    if (conf > 50) return 'text-amber-400'
    return 'text-green-400'
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border-amber-500/20">
            <TbBug className="text-amber-400 text-lg" />
            <span className="text-sm text-amber-400/80 font-semibold">{t('pest.badge')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('pest.title')}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('pest.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload + Camera panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            
            {/* Drop zone */}
            <div
              className={`glass-card p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${dragOver ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Pest" className="w-full h-64 object-cover rounded-xl border border-white/10" />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearImage() }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 hover:border-red-500 transition-all z-10"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-4 opacity-70 flex justify-center"
                  >
                    <FiTarget className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                  </motion.div>
                  <p className="text-white font-semibold mb-1">{t('pest.drag_drop')}</p>
                  <p className="text-white/40 text-sm">{t('pest.or_click')}</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              {cameraActive ? (
                <button onClick={snapPhoto} className="btn-primary flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 border-none text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <FiCamera /> {t('pest.btn_snap')}
                </button>
              ) : (
                <button onClick={captureFromCamera} className="btn-secondary flex items-center justify-center gap-2 py-3 hover:border-amber-500/50">
                  <FiCamera /> {t('pest.btn_camera')}
                </button>
              )}
              <button onClick={() => fileRef.current.click()} className="btn-secondary flex items-center justify-center gap-2 py-3 hover:border-amber-500/50">
                <FiUpload /> {t('pest.btn_upload')}
              </button>
            </div>

            <video ref={cameraRef} autoPlay playsInline className="w-full rounded-xl hidden border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]" style={{ display: 'none' }} />

            {error && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                <FiAlertTriangle /> {error}
              </motion.div>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={!image || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary ripple w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: image && !loading ? 'linear-gradient(to right, #d97706, #ea580c)' : undefined }}
            >
              {loading ? <><div className="spinner w-5 h-5" /> {t('pest.btn_detecting')}</> : <><TbBug /> {t('pest.btn_detect')}</>}
            </motion.button>
          </motion.div>

          {/* Result panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 text-center flex flex-col items-center justify-center h-full gap-4 min-h-64 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <div className="spinner w-12 h-12 border-t-amber-500" />
                    </div>
                  </div>
                  <p className="text-white font-semibold text-lg text-amber-400">{t('pest.ai_processing')}</p>
                  <p className="text-white/40 text-sm">{t('pest.analyzing')}</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 print-section">
                  <button 
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-center gap-2 text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-3 rounded-xl transition-colors text-sm font-semibold print:hidden border border-amber-500/20 mb-2"
                  >
                    <FiDownload /> {t('pest.download_report')}
                  </button>

                  {/* Hero Result */}
                  <div className="glass-card p-6 bg-gradient-to-br from-gray-900 to-amber-950/20 border-amber-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none print:hidden">
                      <TbBug className="text-9xl text-amber-500" />
                    </div>
                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div>
                        <div className="text-amber-500/80 text-xs uppercase tracking-widest mb-1 font-semibold flex items-center gap-1">
                          <TbBug /> {t('pest.detected_threat')}
                        </div>
                        <div className="text-white font-display font-black text-3xl mb-1">{result.pest_name}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                           <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/20`}>
                            <FiAlertTriangle /> {result.severity} {t('pest.severity_threat')}
                          </div>
                          {result.plantType && (
                            <div className="bg-white/5 text-white/60 text-xs px-2.5 py-1 rounded-full border border-white/10 uppercase font-bold tracking-tight">
                               {result.plantType}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-display font-black ${severityColor(result.confidence)}`}>
                          {result.confidence}%
                        </div>
                        <div className="text-white/30 text-xs">{t('pest.confidence')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Prevention */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.description && (
                      <div className="glass-card p-5 border-white/5">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">📝 {t('pest.description_title', 'Expert Description')}</h4>
                        <p className="text-white/60 text-xs leading-relaxed">{result.description}</p>
                      </div>
                    )}
                    {result.prevention && (
                      <div className="glass-card p-5 border-amber-500/10">
                        <h4 className="text-amber-400 font-semibold mb-2 text-sm flex items-center gap-2 text-sm text-amber-400">🛡️ {t('pest.prevention_title', 'Prevention Strategy')}</h4>
                        <p className="text-white/60 text-xs leading-relaxed">{result.prevention}</p>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="glass-card p-5 border-white/5">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">🚜 {t('pest.control_strategy')}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{result.control_method}</p>
                  </div>

                  {/* Solutions Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="glass-card p-5 border-green-500/30 bg-green-500/5">
                      <h4 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">🌿 {t('pest.biological_organic')}</h4>
                      <ul className="space-y-2">
                        {Array.isArray(result.organic) ? result.organic.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-green-500 mt-0.5">•</span> <span>{t}</span>
                          </li>
                        )) : <li className="text-white/40 text-xs italic">Loading organic solutions...</li>}
                      </ul>
                    </div>
                    
                    <div className="glass-card p-5 border-orange-500/30 bg-orange-500/5">
                      <h4 className="text-orange-400 font-semibold text-sm mb-3 flex items-center gap-2">🧪 {t('pest.synthetic_chemical')}</h4>
                      <ul className="space-y-2">
                        {Array.isArray(result.chemical) ? result.chemical.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="text-orange-500 mt-0.5 text-xs">▲</span> <span>{t}</span>
                          </li>
                        )) : <li className="text-white/40 text-xs italic">Loading chemical treatments...</li>}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full"
                >
                  <div className="text-5xl mb-2 text-red-500">❌</div>
                  <h3 className="text-white font-bold text-lg">{t('common.data_unavailable', 'Analysis Failed')}</h3>
                  <p className="text-white/40 text-sm mb-4">{error}</p>
                  <button 
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-2.5 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 border-none"
                  >
                    🔄 {t('common.retry', 'Retry Detection')}
                  </button>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-64 border-white/5">
                  <div className="text-6xl opacity-30 text-white flex justify-center w-full"><TbBug /></div>
                  <p className="text-white/30 text-sm leading-relaxed max-w-[200px] mx-auto">{t('pest.upload_instruction')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        
        </div>
      </div>
    </div>
  )
}
