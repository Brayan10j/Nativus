const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  tittle: String,
  description: String,
  category: String,
  image: String,
  author: String,
  price: Number,
  date: String,
  files: Array,
});

module.exports = mongoose.model('Post', PostSchema);
