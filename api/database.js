const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Cycron:CycronDB@cluster0.fetta.mongodb.net/PilgrimTesting?retryWrites=true&w=majority';


mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));
