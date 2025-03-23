const express = require('express');
const dotenv = require('dotenv');
const camps = require('./routes/camps');
const morgan = require("morgan")

dotenv.config({ path: './config/config.env' });

const app = express();

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Mount routes
app.use('/api/v1/camps', camps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))