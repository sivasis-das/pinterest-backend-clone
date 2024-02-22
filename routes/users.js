const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dp: {
    type: String, // Assuming the profile picture is stored as a URL
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
