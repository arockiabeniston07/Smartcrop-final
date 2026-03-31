const mongoose = require('mongoose')

const FertilizerRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inputs: {
    cropType: String,
    soilType: String,
    N: Number,
    P: Number,
    K: Number
  },
  result: {
    fertilizers: [{ type: String }],
    primary_recommendation: { type: String },
    quantity_per_acre: { type: String },
    application_instructions: { type: String },
    organic_alternatives: [{ type: String }]
  }
}, { timestamps: true })

const FertilizerRecommendation = mongoose.models.FertilizerRecommendation || mongoose.model('FertilizerRecommendation', FertilizerRecommendationSchema)
module.exports = FertilizerRecommendation
