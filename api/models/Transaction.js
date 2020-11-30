const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  user: String,
  description: String,
  credits: String,
  date: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
