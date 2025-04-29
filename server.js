const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const camps = require('./routes/camps')
const activities = require('./routes/activities')
const auth = require('./routes/auth')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

app.use(express.json())

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Uploading files
app.use(fileupload())

//Cookie parser
app.use(cookieParser())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount routes
app.use('/api/v1/camps', camps)
app.use('/api/v1/activities', activities)
app.use('/api/v1/auth', auth)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})
