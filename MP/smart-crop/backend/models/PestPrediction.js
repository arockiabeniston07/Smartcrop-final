const mongoose = require('mongoose')

const PestPredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pest_name: { type: String, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  plantType: { type: String },
  control_method: { type: String },
  organic: [{ type: String }],
  chemical: [{ type: String }],
  image_url: { type: String },
}, { timestamps: true })

const PestPrediction = mongoose.models.PestPrediction || mongoose.model('PestPrediction', PestPredictionSchema)
module.exports = PestPrediction
