const mongoose = require('mongoose')

const cropPredSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputs: {
    soilType: String, N: Number, P: Number, K: Number,
    temperature: Number, humidity: Number, ph: Number,
    rainfall: Number, location: String,
  },
  result: {
    crop: String, confidence: Number, description: String,
    season: String, water: String, yield: String, demand: String,
    alternatives: [String], emoji: String,
  },
}, { timestamps: true })

const CropPrediction = mongoose.models.CropPrediction || mongoose.model('CropPrediction', cropPredSchema)
module.exports = CropPrediction
