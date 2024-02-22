const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});



module.exports = mongoose.model('Post', postSchema);
