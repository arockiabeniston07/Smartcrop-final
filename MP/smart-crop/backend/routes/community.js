const express = require('express')
const multer = require('multer')
const path = require('path')
const auth = require('../middleware/auth')
const CommunityPost = require('../models/CommunityPost')
const router = express.Router()

// Multer storage
const storage = multer.diskStorage({
  destination: 'uploads/community/',
  filename: (req, file, cb) => {
    cb(null, `post-${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({ storage })

// Generate a random post if db is empty for demonstration purposes
const generateMockPosts = async () => {
  const count = await CommunityPost.countDocuments()
  if (count === 0) {
    try {
      // Create a dummy user ID for mock posts since we require it
      const systemId = '000000000000000000000000'
      await CommunityPost.insertMany([
        {
          userId: systemId,
          authorName: 'Ramesh Singh',
          content: 'My wheat crop leaves are turning yellow rapidly after the recent rains. What should I do? Is it a fungal infection or nitrogen deficiency?',
          category: 'Question',
          likes: [],
          replies: [
             { userId: systemId, authorName: 'Dr. Sharma (Agronomist)', content: 'It sounds like early blight due to excess moisture. Apply Mancozeb and improve drainage immediately.' }
          ]
        },
        {
          userId: systemId,
          authorName: 'Suresh Patil',
          content: 'Sold my Soybean harvest today at Indore Mandi for ₹4900. Prices are slightly up from last week!',
          category: 'Market Info',
          likes: [systemId, systemId],
          replies: []
        },
        {
          userId: systemId,
          authorName: 'Anita Devi',
          content: 'Using vermicompost continuously for 3 years has completely transformed my soil health. Look at this cotton yield!',
          category: 'Success Story',
          likes: [systemId, systemId, systemId],
          replies: []
        }
      ])
    } catch(err) { console.log("Failed to seed mock posts", err.message) }
  }
}

// GET /api/community
router.get('/', auth, async (req, res) => {
  try {
    await generateMockPosts()
    const posts = await CommunityPost.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/community
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, category } = req.body
    
    // In actual production, you'd pull this from the user DB, assuming auth attaches req.user
    const authorName = req.user.name || 'Farmer' 

    let image_url = null
    if (req.file) {
      image_url = `/uploads/community/${req.file.filename}`
    }

    const post = await CommunityPost.create({
      userId: req.user.id,
      authorName,
      content,
      category,
      image_url
    })

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/community/:id/like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const index = post.likes.indexOf(req.user.id)
    if (index === -1) {
      post.likes.push(req.user.id)
    } else {
      post.likes.splice(index, 1)
    }

    await post.save()
    res.json({ likes: post.likes.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/community/:id/reply
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body
    const post = await CommunityPost.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    post.replies.push({
      userId: req.user.id,
      authorName: req.user.name || 'Farmer',
      content
    })

    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
