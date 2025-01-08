require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PORT } = require('./config/constants.js');
const connectDB = require('./config/db');
const routers = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use('/api', routers);


// Connect to Database
connectDB();




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});