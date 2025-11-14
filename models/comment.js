const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  commentText: { type: String, required: true, min: 4 }, likes: { type: [String], default: [] }, userId: { type: String, required: true }, postId: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)