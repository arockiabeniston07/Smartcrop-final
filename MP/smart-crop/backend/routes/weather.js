const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')
const router = express.Router()

const ICON_MAP = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
}

// GET /api/weather/:city
router.get('/:city', auth, async (req, res) => {
  const { city } = req.params
  try {
    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
      return res.json(getMockWeather(city))
    }

    const geoRes = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    )
    if (!geoRes.data.length) return res.json(getMockWeather(city))
    const { lat, lon } = geoRes.data[0]

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
    const d = weatherRes.data
    const uvRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    ).catch(() => ({ data: { value: 5 } }))

    res.json({
      city: d.name, temp: Math.round(d.main.temp), feel: Math.round(d.main.feels_like),
      humidity: d.main.humidity, windspeed: Math.round(d.wind.speed * 3.6),
      pressure: d.main.pressure, visibility: Math.round((d.visibility || 10000) / 1000),
      uvIndex: Math.round(uvRes.data.value),
      rainChance: d.clouds?.all || 0,
      description: d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1),
      icon: ICON_MAP[d.weather[0].icon] || '🌤️',
      sunrise: new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(d.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    })
  } catch (err) {
    res.json(getMockWeather(city))
  }
})

function getMockWeather(city) {
  return {
    city, temp: 28 + Math.floor(Math.random() * 8), feel: 26 + Math.floor(Math.random() * 6),
    humidity: 60 + Math.floor(Math.random() * 30), windspeed: 8 + Math.floor(Math.random() * 15),
    pressure: 1008 + Math.floor(Math.random() * 10), visibility: 8 + Math.floor(Math.random() * 4),
    uvIndex: 4 + Math.floor(Math.random() * 5), rainChance: Math.floor(Math.random() * 60),
    description: 'Partly Cloudy', icon: '⛅',
    sunrise: '06:15', sunset: '18:45',
  }
}

module.exports = router
