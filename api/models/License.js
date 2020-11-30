const mongoose = require('mongoose');
const { Schema } = mongoose;

const LicenseSchema = new Schema({
  name: String,
  price: Number,
  duration: String,
  permission: Array,
});

module.exports = mongoose.model('License', LicenseSchema);
