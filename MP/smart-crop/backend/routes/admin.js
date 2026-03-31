const express = require('express')
const admin = require('../middleware/admin')
const User = require('../models/User')
const CropData = require('../models/CropData')
const DiseaseData = require('../models/DiseaseData')
const PestPrediction = require('../models/PestPrediction')
const FertilizerRecommendation = require('../models/FertilizerRecommendation')
const CommunityPost = require('../models/CommunityPost')
const router = express.Router()

// GET /api/admin/users
router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/users/:id
router.delete('/users/:id', admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/admin/crops
router.get('/crops', admin, async (req, res) => {
  try {
    const crops = await CropData.find().sort({ name: 1 })
    res.json(crops)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/admin/crops
router.post('/crops', admin, async (req, res) => {
  try {
    const crop = await CropData.create(req.body)
    res.status(201).json(crop)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/crops/:id
router.delete('/crops/:id', admin, async (req, res) => {
  try {
    await CropData.findByIdAndDelete(req.params.id)
    res.json({ message: 'Crop deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/admin/diseases
router.get('/diseases', admin, async (req, res) => {
  try {
    const diseases = await DiseaseData.find().sort({ name: 1 })
    res.json(diseases)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/admin/diseases
router.post('/diseases', admin, async (req, res) => {
  try {
    const disease = await DiseaseData.create(req.body)
    res.status(201).json(disease)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/diseases/:id
router.delete('/diseases/:id', admin, async (req, res) => {
  try {
    await DiseaseData.findByIdAndDelete(req.params.id)
    res.json({ message: 'Disease deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/admin/pests
router.get('/pests', admin, async (req, res) => {
  try {
    const pests = await PestPrediction.find().sort({ createdAt: -1 })
    res.json(pests)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/pests/:id
router.delete('/pests/:id', admin, async (req, res) => {
  try {
    await PestPrediction.findByIdAndDelete(req.params.id)
    res.json({ message: 'Pest record deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/admin/fertilizers
router.get('/fertilizers', admin, async (req, res) => {
  try {
    const fertilizers = await FertilizerRecommendation.find().sort({ createdAt: -1 })
    res.json(fertilizers)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/fertilizers/:id
router.delete('/fertilizers/:id', admin, async (req, res) => {
  try {
    await FertilizerRecommendation.findByIdAndDelete(req.params.id)
    res.json({ message: 'Fertilizer record deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/admin/community
router.get('/community', admin, async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/admin/community/:id
router.delete('/community/:id', admin, async (req, res) => {
  try {
    await CommunityPost.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
