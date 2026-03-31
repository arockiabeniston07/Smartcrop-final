const mongoose = require('mongoose')

const weatherDataSchema = new mongoose.Schema({
  location: String,
  city: String,
  temp: Number,
  feel: Number,
  humidity: Number,
  windspeed: Number,
  pressure: Number,
  visibility: Number,
  uvIndex: Number,
  rainChance: Number,
  description: String,
  icon: String,
  sunrise: String,
  sunset: String,
}, { timestamps: true })

const WeatherData = mongoose.models.WeatherData || mongoose.model('WeatherData', weatherDataSchema)
module.exports = WeatherData
