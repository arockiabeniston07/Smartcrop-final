import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FiMapPin, FiLayers, FiInfo } from 'react-icons/fi'
import { GiFarmTractor } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const customMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to dynamically fly map to new coordinates
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.5 })
  }, [center, map])
  return null
}

export default function FarmMap() {
  const { t } = useTranslation()
  const [position, setPosition] = useState([20.5937, 78.9629]) // Default Center (India)
  const [zoom, setZoom] = useState(5)
  const [layer, setLayer] = useState('soil')

  // Mock Suitability Zones based on position
  const zones = [
    { pos: [28.6139, 77.2090], name: 'North India Zone', crop: 'Wheat, Mustard', color: '#eab308' },
    { pos: [19.0760, 72.8777], name: 'Western Zone', crop: 'Cotton, Sugarcane', color: '#14b8a6' },
    { pos: [13.0827, 80.2707], name: 'Southern Zone', crop: 'Rice, Spices', color: '#ef4444' },
    { pos: [22.5726, 88.3639], name: 'Eastern Zone', crop: 'Rice, Jute', color: '#3b82f6' }
  ]

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
          setZoom(10)
        },
        () => alert(t('map.denied', 'Location access denied. Using default map.'))
      )
    }
  }

  return (
    <div className="min-h-screen page-container pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 border-teal-500/20">
              <GiFarmTractor className="text-teal-400 text-lg" />
              <span className="text-sm text-teal-400/80 font-semibold">{t('map.badge', 'Geo-Spatial Analysis')}</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-2">
              {t('map.title_prefix', 'Farm')} <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">{t('map.title')}</span>
            </h1>
            <p className="text-white/50 max-w-xl">
              {t('map.subtitle')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={detectLocation}
              className="btn-secondary flex items-center gap-2 px-5"
            >
              <FiMapPin /> {t('map.my_location', 'My Farm Location')}
            </button>
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
              className="input-field border-teal-500/30 w-40 cursor-pointer text-sm"
            >
              <option value="soil" className="bg-gray-900">{t('map.layer_soil', 'Soil Type Layer')}</option>
              <option value="ndvi" className="bg-gray-900">{t('map.layer_ndvi', 'NDVI Vegetation')}</option>
              <option value="water" className="bg-gray-900">{t('map.layer_water', 'Water Resources')}</option>
            </select>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-2 border-teal-500/20 overflow-hidden shadow-2xl relative h-[600px] z-10 w-full rounded-2xl">
          
          {/* Overlay info box */}
          <div className="absolute top-6 right-6 z-[400] glass-card p-4 min-w-64 border-teal-500/30 bg-gray-950/80 backdrop-blur-md hidden sm:block">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <FiLayers className="text-teal-400" /> {t('map.active_layer', 'Active Layer:')} {layer.toUpperCase()}
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> {t('map.suit_high', 'High Suitability')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div> {t('map.suit_mod', 'Moderate')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> {t('map.suit_mar', 'Marginal')}
              </div>
            </div>
          </div>

          <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} className="w-full h-full rounded-xl z-0 bg-gray-900">
            <MapUpdater center={position} />
            
            {/* Dark mode styled map tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <Marker position={position} icon={customMarker}>
              <Popup className="custom-popup">
                <div className="text-gray-900 p-1">
                  <div className="font-bold text-teal-600 mb-1">{t('map.selected_loc', 'Selected Location')}</div>
                  <div className="text-xs">{t('map.lat', 'Lat')}: {position[0].toFixed(4)}</div>
                  <div className="text-xs">{t('map.lng', 'Lng')}: {position[1].toFixed(4)}</div>
                </div>
              </Popup>
            </Marker>

            {/* Suitability Zones */}
            {zones.map((z, i) => (
              <Circle
                key={i}
                center={z.pos}
                pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: 0.2 }}
                radius={layer === 'ndvi' ? 150000 : 80000}
              >
                <Popup>
                  <div className="text-gray-900 p-1">
                    <div className="font-bold mb-1" style={{ color: z.color }}>{t(`map.zones.${z.name.toLowerCase().replace(/ /g, '_')}`, z.name)}</div>
                    <div className="text-xs italic mb-2">{t('map.ideal_for', 'Ideal for')}: {z.crop}</div>
                    <button className="text-[10px] bg-gray-100 px-2 py-1 rounded w-full border border-gray-300">{t('common.view_details', 'View Details')}</button>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </motion.div>

        {/* Legend / Info Cards below map */}
        <div className="grid sm:grid-cols-3 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 border-white/5">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-2"><FiInfo className="text-teal-400" /> {t('map.insights_title', 'Map Insights')}</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              {t('map.insights_desc', 'Click on the colored circles to view the crop suitability data for different regional zones in India.')}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 border-white/5">
             <h4 className="text-teal-400 font-semibold mb-2">{t('map.geo_title', 'Geo-Targeting')}</h4>
             <p className="text-white/50 text-sm leading-relaxed">
               {t('map.geo_desc', 'Use "My Farm Location" to jump the map to your current GPS coordinates. Ensure location permissions are granted.')}
             </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 border-white/5">
             <h4 className="text-white font-semibold mb-2">{t('map.layer_title', 'Layer Data')}</h4>
             <p className="text-white/50 text-sm leading-relaxed">
               {t('map.layer_desc', 'Switching layers will re-render the overlay polygon data across the entire country map interface.')}
             </p>
          </motion.div>
        </div>

      </div>
      
      {/* Add custom CSS to style Leaflet Popups for dark mode compatibility implicitly */}
      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: #f8fafc;
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  )
}
