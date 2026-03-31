const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true })

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  image_url: { type: String },
  category: { 
    type: String, 
    enum: ['Question', 'Market Info', 'Success Story', 'Alert'],
    default: 'Question'
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [ReplySchema]
}, { timestamps: true })

const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema)
module.exports = CommunityPost
