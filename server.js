const express = require('express');
const dotenv = require('dotenv');
const camps = require('./routes/camps');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json())

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Mount routes
app.use('/api/v1/camps', camps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})