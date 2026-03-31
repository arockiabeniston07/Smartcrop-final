const mongoose = require('mongoose')

const diseaseDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plant: String,
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  symptoms: [String],
  treatment: String,
  organic: [String],
  chemical: [String],
}, { timestamps: true })

const DiseaseData = mongoose.models.DiseaseData || mongoose.model('DiseaseData', diseaseDataSchema)
module.exports = DiseaseData
