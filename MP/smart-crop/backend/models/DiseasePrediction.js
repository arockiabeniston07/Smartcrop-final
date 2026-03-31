const mongoose = require('mongoose')

const diseasePredSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  result: {
    disease: String, plantType: String, confidence: Number,
    severity: String, treatment: String,
    organic: [String], chemical: [String],
  },
}, { timestamps: true })

const DiseasePrediction = mongoose.models.DiseasePrediction || mongoose.model('DiseasePrediction', diseasePredSchema)
module.exports = DiseasePrediction
