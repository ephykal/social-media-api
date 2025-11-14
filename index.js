const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const authController = require('./controllers/auth')
const userController = require('./controllers/user')
const app = express()
const port = process.env.PORT

connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', authController)
app.use('/user', userController)

app.listen(port, () => console.log('server is connected successfully'))