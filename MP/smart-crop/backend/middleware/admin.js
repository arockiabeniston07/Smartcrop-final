const User = require('../models/User')
const auth = require('./auth')

module.exports = [
  auth,
  async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' })
    }
    next()
  }
]
