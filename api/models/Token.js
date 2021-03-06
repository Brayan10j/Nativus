const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
  code: String,
  value: Number,
  active: Boolean,
  type: String
});

module.exports = mongoose.model("Token", TokenSchema);
