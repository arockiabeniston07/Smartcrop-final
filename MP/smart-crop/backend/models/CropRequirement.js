const mongoose = require('mongoose')

const CropRequirementSchema = new mongoose.Schema({
  crop_name: { type: String, required: true, unique: true, trim: true },
  emoji: { type: String, default: '🌱' },
  soil_types: [{ type: String }],
  ph_range: { type: String },
  temperature_range: { type: String },
  rainfall_range: { type: String },
  sowing_season: { type: String },
  suitable_regions: [{ type: String }],
  fertilizers: [{ type: String }],
  crop_duration: { type: String },
  description: { type: String },
  water_requirement: { type: String },
  yield_per_acre: { type: String },
}, { timestamps: true })

const CropRequirement = mongoose.models.CropRequirement || mongoose.model('CropRequirement', CropRequirementSchema)
module.exports = CropRequirement
