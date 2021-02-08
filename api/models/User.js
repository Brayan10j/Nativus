const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  codReferal: String,
  registrationCode: String,
  licenses: Array,
  rol: String,
  type: String,
  photo: String,
  balance: Number,
  crypto: Number,
  cryptoGen: Number,
  permissions: Array,
  referals: Array,
  favorites: Array,
  isAdmin: Boolean,
  isSuperUser: Boolean,
  dateCreated: String,
  active: Boolean,
  verify: Boolean
});

module.exports = mongoose.model('User', UserSchema);

