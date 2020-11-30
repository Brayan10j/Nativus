const mongoose = require('mongoose');
const { Schema } = mongoose;

const SignalSchema = new Schema({
  name: String,
  price: String,
  timeFrame: String,
  data: String,
  date: String,
});

module.exports = mongoose.model('Signal', SignalSchema);
