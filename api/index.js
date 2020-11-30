const express = require('express')

// Create express instance
const app = express()

//MIDDLEWARES
app.use(express.json());
// Require API routes


// Import API Routes
app.use('/api',require('./routes/brain'));


// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
