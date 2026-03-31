const mongoose = require('mongoose')

const cropDataSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  season: String,
  soilType: String,
  ph: String,
  water: String,
  description: String,
  emoji: String,
  npkRanges: { N: String, P: String, K: String },
}, { timestamps: true })

const CropData = mongoose.models.CropData || mongoose.model('CropData', cropDataSchema)
module.exports = CropData
