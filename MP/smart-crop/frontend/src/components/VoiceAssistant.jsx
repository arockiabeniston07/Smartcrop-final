import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiMic, FiMicOff, FiX, FiSend, FiUser } from 'react-icons/fi'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

// Native Browser Speech APIs
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
const synth = window.speechSynthesis

export default function VoiceAssistant() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  
  const getInitialMessage = () => {
    if (i18n.language === 'ta') return 'இன்று உங்கள் பயிர்களுக்கு நான் எப்படி உதவ முடியும்?'
    if (i18n.language === 'hi') return 'आज मैं आपकी फसलों में आपकी क्या मदद कर सकता हूँ?'
    return 'How can I help you with your crops today?'
  }

  const [messages, setMessages] = useState([
    { role: 'bot', text: getInitialMessage() }
  ])
  const [recognition, setRecognition] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = true
      
      let lang = 'en-US'
      if (i18n.language === 'ta') lang = 'ta-IN'
      else if (i18n.language === 'hi') lang = 'hi-IN'
      rec.lang = lang

      rec.onstart = () => setIsListening(true)
      
      rec.onresult = (event) => {
        const text = Array.from(event.results).map(r => r[0].transcript).join('')
        setTranscript(text)
        if (event.results[0].isFinal) {
          handleSendMessage(text)
        }
      }

      rec.onerror = (event) => {
        console.error('Speech error:', event.error)
        setIsListening(false)
      }

      rec.onend = () => setIsListening(false)

      setRecognition(rec)
    }
  }, [i18n.language])

  const speak = useCallback((text) => {
    if (!synth) return
    synth.cancel() // Stop currently speaking
    const utterance = new SpeechSynthesisUtterance(text)
    
    if (i18n.language === 'ta') {
      utterance.lang = 'ta-IN'
      const tamilVoice = synth.getVoices().find(v => v.lang.includes('ta'))
      if (tamilVoice) utterance.voice = tamilVoice
    } else if (i18n.language === 'hi') {
      utterance.lang = 'hi-IN'
      const hindiVoice = synth.getVoices().find(v => v.lang.includes('hi'))
      if (hindiVoice) utterance.voice = hindiVoice
    } else {
      utterance.lang = 'en-US'
    }

    utterance.rate = 1.0
    utterance.pitch = 1
    synth.speak(utterance)
  }, [i18n.language])

  const handleSendMessage = async (text) => {
    if (!text.trim()) return
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text }])
    setTranscript('')
    setLoading(true)

    try {
      // Step 1: Send text to dedicated voice assistant backend
      let voiceLang = 'en-US'
      if (i18n.language === 'ta') voiceLang = 'ta-IN'
      else if (i18n.language === 'hi') voiceLang = 'hi-IN'

      const res = await axios.post('/api/voice-assistant', { 
        message: text,
        lang: voiceLang
      })
      const botReply = res.data.reply
      
      // Step 2: Navigate based on command if detected
      processCommandsLocally(text.toLowerCase())

      // Step 3: Add bot response and speak
      setMessages(prev => [...prev, { role: 'bot', text: botReply }])
      speak(botReply)
    } catch (err) {
      console.error('Chat error:', err)
      let errorMsg = 'Sorry, I am having trouble connecting right now.'
      if (i18n.language === 'ta') errorMsg = 'மன்னிக்கவும், என்னால் இப்போது இணைக்க முடியவில்லை.'
      else if (i18n.language === 'hi') errorMsg = 'क्षमा करें, मुझे अभी जुड़ने में समस्या हो रही है।'
      
      setMessages(prev => [...prev, { role: 'bot', text: errorMsg }])
      speak(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const processCommandsLocally = (cmd) => {
    let route = null
    
    if (cmd.includes('disease') || cmd.includes('sick') || cmd.includes('scan') || cmd.includes('நோய்') || cmd.includes('बीमारी') || cmd.includes('रोग')) route = '/disease-detection'
    else if (cmd.includes('weather') || cmd.includes('rain') || cmd.includes('வானிலை') || cmd.includes('मौसम') || cmd.includes('बारिश')) route = '/weather'
    else if (cmd.includes('recommend') || cmd.includes('grow') || cmd.includes('பயிர்') || cmd.includes('फसल')) route = '/crop-recommendation'
    else if (cmd.includes('fertilizer') || cmd.includes('npk') || cmd.includes('உரம்') || cmd.includes('खाद') || cmd.includes('उर्वरक')) route = '/fertilizer'
    else if (cmd.includes('market') || cmd.includes('price') || cmd.includes('விலை') || cmd.includes('मंडी') || cmd.includes('भाव')) route = '/market'
    else if (cmd.includes('pest') || cmd.includes('insect') || cmd.includes('பூச்சி') || cmd.includes('कीट')) route = '/pest-detection'
    else if (cmd.includes('map') || cmd.includes('வரைபடம்') || cmd.includes('नक्शा')) route = '/map'
    else if (cmd.includes('community') || cmd.includes('ask') || cmd.includes('கேள்வி') || cmd.includes('सवाल')) route = '/community'

    if (route) {
      setTimeout(() => navigate(route), 2000)
    }
  }

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop()
    } else {
      setTranscript('')
      try {
        recognition?.start()
      } catch (e) {
        console.error("Recognition already started")
      }
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 sm:w-96 glass-card overflow-hidden shadow-2xl flex flex-col border border-white/10 bg-gray-950/90 backdrop-blur-xl h-[450px] rounded-3xl"
          >
            {/* Header */}
            <div className="p-4 bg-primary-500/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-display font-bold text-white text-sm">Smart Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${m.role === 'bot' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-white'}`}>
                      {m.role === 'bot' ? '🤖' : <FiUser />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'bot' ? 'bg-white/5 text-white/90 rounded-tl-none' : 'bg-primary-500 text-white rounded-tr-none'}`}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-white/5 bg-gray-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(transcript)}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  {transcript && (
                    <button 
                      onClick={() => handleSendMessage(transcript)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-400 hover:bg-primary-500/20 rounded-lg transition-colors"
                    >
                      <FiSend />
                    </button>
                  )}
                </div>
                <button
                  onClick={toggleListen}
                  className={`p-3 rounded-xl transition-all relative ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                      : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  }`}
                >
                  {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
                  {isListening && (
                    <>
                      <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 rounded-xl bg-red-500" />
                      <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1, delay:0.5, repeat: Infinity }} className="absolute inset-0 rounded-xl bg-red-500" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-2xl flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
        {isOpen ? <FiX size={26} /> : <FiMic size={26} />}
      </motion.button>
    </div>
  )
}
