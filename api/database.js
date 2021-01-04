const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://User:DB@cluster0.mebur.mongodb.net/PilgrimDB?retryWrites=true&w=majority';


mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));
