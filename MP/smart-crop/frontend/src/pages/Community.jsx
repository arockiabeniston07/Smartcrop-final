import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiMessageSquare, FiHeart, FiShare2, FiImage, FiMoreVertical, FiMessageCircle, FiTrendingUp, FiAlertCircle, FiX } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'

const CATEGORY_COLORS = {
  'Question': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Market Info': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Success Story': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Alert': 'text-red-400 bg-red-500/10 border-red-500/20'
}

export default function Community() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Question')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  // State for handling replies
  const [replyContent, setReplyContent] = useState({})

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community')
      setPosts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('category', category)
      if (image) formData.append('image', image)

      const res = await axios.post('/api/community', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setPosts([res.data, ...posts])
      setContent('')
      setImage(null)
      setPreview(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/community/${postId}/like`)
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, likes: new Array(res.data.likes).fill(1) } : p
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleReply = async (postId) => {
    const text = replyContent[postId]
    if (!text?.trim()) return
    
    try {
      const res = await axios.post(`/api/community/${postId}/reply`, { content: text })
      setPosts(posts.map(p => p._id === postId ? res.data : p))
      setReplyContent({ ...replyContent, [postId]: '' }) // Clear input
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border-blue-500/20">
            <FiMessageCircle className="text-blue-400 text-lg" />
            <span className="text-sm text-blue-400/80 font-semibold">Farmer Network</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
            {t('community.brand_prefix', 'Smart Crop')} <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{t('community.title')}</span>
          </h1>
          <p className="text-white/50 max-w-xl">
            {t('community.subtitle')}
          </p>
        </motion.div>

        {/* Create Post Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card mb-8 overflow-hidden bg-gray-900/50">
          <form onSubmit={handleCreatePost}>
            <div className="p-4 border-b border-white/5 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-green-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="w-full">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={t('community.placeholder', 'Ask a question or share an update...')}
                  className="w-full bg-transparent border-none text-white focus:ring-0 resize-none h-20 placeholder:text-white/30"
                  required
                />
                
                {preview && (
                  <div className="relative mt-2 w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImage(null); setPreview(null) }} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:text-red-400">
                      <FiX size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white/50 hover:text-primary-400 cursor-pointer transition-colors text-sm font-medium">
                  <FiImage /> {t('community.add_photo', 'Add Photo')}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="bg-gray-950 border border-white/10 text-white/70 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary-500"
                >
                  <option value="Question">❓ {t('community.cat_question', 'Question')}</option>
                  <option value="Market Info">📈 {t('community.cat_market', 'Market Info')}</option>
                  <option value="Success Story">🌟 {t('community.cat_success', 'Success Story')}</option>
                  <option value="Alert">⚠️ {t('community.cat_alert', 'Alert')}</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim() || submitting}
                className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
              >
                {submitting ? t('community.posting', 'Posting...') : t('community.share_post', 'Share Post')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Feed */}
        {loading ? (
          <div className="py-20 flex justify-center"><div className="spinner border-t-blue-500 w-10 h-10" /></div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {posts.map(post => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border-white/5 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Post Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 font-bold">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {post.authorName} <span className="text-white/30 text-xs text-normal">· {formatDistanceToNow(new Date(post.createdAt))} {t('community.ago', 'ago')}</span>
                          </div>
                          <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mt-1 ${CATEGORY_COLORS[post.category]}`}>
                            {t(`community.cat_${post.category.toLowerCase().replace(/ /g, '_')}`, post.category)}
                          </div>
                        </div>
                      </div>
                      <button className="text-white/30 hover:text-white"><FiMoreVertical /></button>
                    </div>

                    {/* Post Content */}
                    <p className="text-white/90 text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.image_url && (
                      <div className="rounded-xl overflow-hidden mb-4 border border-white/5 max-h-96 bg-black/40 flex justify-center">
                        <img src={post.image_url} alt="Post media" className="max-h-96 object-contain" />
                      </div>
                    )}

                    {/* Social Actions */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-white/50 text-sm">
                      <div className="flex gap-6">
                        <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                          <FiHeart className={post.likes.includes(user?._id) ? "fill-red-400 text-red-400" : ""} /> {post.likes.length}
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                          <FiMessageSquare /> {post.replies?.length || 0}
                        </button>
                      </div>
                      <button className="hover:text-white transition-colors"><FiShare2 /></button>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <div className="bg-white/[0.02] p-5 border-t border-white/5">
                    {post.replies?.length > 0 && (
                      <div className="space-y-4 mb-4">
                        {post.replies.map((reply, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-xs text-white/50">
                              {reply.authorName.charAt(0)}
                            </div>
                            <div className="bg-gray-900/60 rounded-2xl rounded-tl-none px-4 py-3 border border-white/5 w-full">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-sm font-semibold text-white/90">{reply.authorName}</span>
                                <span className="text-[10px] text-white/30 ">{formatDistanceToNow(new Date(reply.createdAt || Date.now()))}</span>
                              </div>
                              <p className="text-sm text-white/70">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Write Reply */}
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex-shrink-0 flex items-center justify-center text-primary-400 text-xs font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={replyContent[post._id] || ''}
                          onChange={e => setReplyContent({ ...replyContent, [post._id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && handleReply(post._id)}
                          placeholder={t('community.reply_placeholder', 'Write a reply...')}
                          className="w-full bg-gray-950 border border-white/10 rounded-full pl-4 pr-20 py-2 text-sm text-white focus:border-primary-500 focus:outline-none placeholder:text-white/30"
                        />
                        <button 
                          onClick={() => handleReply(post._id)}
                          className="absolute right-1 top-1 text-xs bg-primary-500 text-white px-3 py-1.5 rounded-full font-medium"
                        >
                          {t('community.reply', 'Reply')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {posts.length === 0 && !loading && (
              <div className="text-center py-12 text-white/40 glass-card">
                {t('community.no_posts', 'No posts yet. Be the first to start the conversation!')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
