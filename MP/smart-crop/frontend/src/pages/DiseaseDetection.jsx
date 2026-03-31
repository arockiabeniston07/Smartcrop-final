import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FiUpload, FiCamera, FiX, FiAlertTriangle, FiDownload } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const TREATMENTS = {
  organic: ['Neem oil spray (1% solution)', 'Turmeric powder dusting', 'Garlic extract spray', 'Baking soda solution'],
  chemical: ['Mancozeb 75WP (2.5 g/L)', 'Copper Oxychloride (3 g/L)', 'Carbendazim 50WP (1 g/L)', 'Propiconazole EC (1 ml/L)']
}

export default function DiseaseDetection() {
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
      setError(t('disease.camera_error', 'Camera access denied. Please upload an image instead.'))
    }
  }

  const snapPhoto = () => {
    if (!cameraRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = cameraRef.current.videoWidth
    canvas.height = cameraRef.current.videoHeight
    canvas.getContext('2d').drawImage(cameraRef.current, 0, 0)
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" })
      handleFile(file)
      
      // Stop camera
      const stream = cameraRef.current.srcObject
      const tracks = stream?.getTracks()
      tracks?.forEach(track => track.stop())
      cameraRef.current.style.display = 'none'
      setCameraActive(false)
    }, 'image/jpeg')
  }

  const handleSubmit = async () => {
    if (!image) return setError(t('disease.upload_error', 'Please upload or capture a leaf image first.'))
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', image)
      const res = await axios.post('/api/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || t('disease.detect_error', 'Detection failed. Ensure AI service is running at http://localhost:5001 (cd ai-model && python app.py)'))
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
    if (conf > 50) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
            <FiCamera className="text-earth-400" />
            <span className="text-sm text-white/70">{t('disease.badge')}</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('disease.title')}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            {t('disease.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload + Camera panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            {/* Drop zone */}
            <div
              className={`glass-card p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${dragOver ? 'border-primary-500 bg-primary-500/10' : 'border-white/10'}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Leaf" className="w-full h-64 object-cover rounded-xl" />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearImage() }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-3 py-1 text-xs text-white">
                    {image?.name}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >🍃</motion.div>
                  <p className="text-white font-semibold mb-1">{t('disease.drag_drop')}</p>
                  <p className="text-white/40 text-sm">{t('disease.or_click')}</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {/* Camera button */}
            <div className="grid grid-cols-2 gap-3">
              {cameraActive ? (
                <button
                  onClick={snapPhoto}
                  className="btn-primary flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 border-none snap-pulse"
                >
                  <FiCamera /> {t('disease.btn_snap')}
                </button>
              ) : (
                <button
                  onClick={captureFromCamera}
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                >
                  <FiCamera /> {t('disease.btn_camera')}
                </button>
              )}
              <button
                onClick={() => fileRef.current.click()}
                className="btn-secondary flex items-center justify-center gap-2 py-3"
              >
                <FiUpload /> {t('disease.btn_upload')}
              </button>
            </div>

            {/* Hidden video for camera */}
            <video ref={cameraRef} autoPlay playsInline className="w-full rounded-xl hidden" style={{ display: 'none' }} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm"
              >
                <FiAlertTriangle /> {error}
              </motion.div>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={!image || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary ripple w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="spinner w-5 h-5" /> {t('disease.btn_detecting')}</>
              ) : <><span className="text-xl">🔬</span> {t('disease.btn_detect')}</>}
            </motion.button>
          </motion.div>

          {/* Result panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 text-center flex flex-col items-center justify-center h-full gap-4"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-earth-500/20 flex items-center justify-center">
                      <div className="spinner w-12 h-12" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🔬</div>
                  </div>
                  <p className="text-white font-semibold text-lg">{t('disease.ai_processing')}</p>
                  <p className="text-white/40 text-sm">{t('disease.analyzing')}</p>
                  <div className="flex gap-2 mt-2">
                    {['Preprocessing', 'Inference', 'Mapping'].map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.5 }}
                        className="text-xs bg-white/5 rounded-full px-3 py-1 text-white/40"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="space-y-4 print-section"
                >
                  <button 
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-center gap-2 text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-4 py-3 rounded-xl transition-colors text-sm font-semibold print:hidden border border-primary-500/20"
                  >
                    <FiDownload /> {t('disease.download_report')}
                  </button>

                  {/* Disease result card */}
                  <div className="glass-card p-6 bg-gradient-to-br from-earth-900/40 to-red-950/20 border-red-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-white/40 text-xs uppercase tracking-widest mb-1">{t('disease.detected_disease')}</div>
                        <div className="text-white font-display font-black text-2xl">{result.disease}</div>
                        <div className="text-white/50 text-sm mt-1">{result.plantType || 'Unknown Plant'}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-display font-black ${severityColor(result.confidence)}`}>
                          {result.confidence}%
                        </div>
                        <div className="text-white/30 text-xs">{t('disease.confidence')}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                      <motion.div
                        className={`h-2 rounded-full ${result.confidence > 80 ? 'bg-red-500' : result.confidence > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                       <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                        result.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                        result.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        <FiAlertTriangle size={10} /> {result.severity || 'High'} {t('disease.severity')}
                      </div>
                      {result.cause && (
                        <div className="bg-white/5 text-white/60 text-xs px-3 py-1 rounded-full border border-white/10">
                           {t('disease.cause')}: {result.cause}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prevention & Diagnosis */}
                  {result.prevention && (
                    <div className="glass-card p-5 border-blue-500/10">
                      <h4 className="text-blue-400 font-semibold mb-2 text-sm flex items-center gap-2">🛡️ {t('disease.prevention_title', 'Prevention Strategy')}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{result.prevention}</p>
                    </div>
                  )}

                  {/* Treatment */}
                  <div className="glass-card p-5">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">💊 {t('disease.treatment_summary')}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{result.treatment || 'Apply appropriate fungicide and ensure good drainage. Remove infected plant parts.'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organic */}
                    <div className="glass-card p-5 border-green-500/20 bg-green-500/5">
                      <h4 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">🌿 {t('disease.organic_solutions')}</h4>
                      <ul className="space-y-1.5">
                        {(Array.isArray(result.organic) ? result.organic : TREATMENTS.organic.slice(0, 2)).map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-green-400 mt-0.5">✓</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Chemical */}
                    <div className="glass-card p-5 border-blue-500/20 bg-blue-500/5">
                      <h4 className="text-blue-400 font-semibold text-sm mb-3 flex items-center gap-2">🧪 {t('disease.chemical_treatment')}</h4>
                      <ul className="space-y-1.5">
                        {(Array.isArray(result.chemical) ? result.chemical : TREATMENTS.chemical.slice(0, 2)).map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-blue-400 mt-0.5">→</span> {t}
                          </li>
                        ))}
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
                  <h3 className="text-white font-bold text-lg">{t('common.data_unavailable', 'Data Unavailable')}</h3>
                  <p className="text-white/40 text-sm mb-4">{error}</p>
                  <button 
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-2.5 flex items-center gap-2"
                  >
                    🔄 {t('common.retry', 'Retry Analysis')}
                  </button>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-64"
                >
                  <div className="text-6xl opacity-30">🍃</div>
                  <p className="text-white/30 text-sm">{t('disease.upload_instruction')}<br /><strong className="text-white/50">{t('disease.btn_detect')}</strong> {t('disease.to_analyze')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
