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
  photo: String,
  balance: Number,
  cycrons: Number,
  cycronsGen: Number,
  permissions: Array,
  referals: Array,
  isAdmin: Boolean,
  isSuperUser: Boolean,
  dateCreated: String,
});

module.exports = mongoose.model('User', UserSchema);
