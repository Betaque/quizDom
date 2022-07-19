'use strict'
const express = require('express')
const app = express()
const path = require('path')
var cors = require('cors')
require('dotenv').config()
const userRoute = require('./Routes/Users')
const quizzesRoute = require('./Routes/Quizzes')
// const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./Routes/User')

// Hosting Frontend
// Create a production build of the frontend and paste the files in the public folder
app.use(express.static(path.join(__dirname, '/public/')))

// Middleware

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}))
app.use(bodyParser.json({ limit: '20mb' }))

app.use('/api/users', userRoutes)
app.use('/API/users', userRoute)
app.use('/API/quizzes', quizzesRoute)

app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/public/index.html'))
})
// Listening to APIs
app.listen(process.env.REACT_APP_HOST || 8000, () =>
	console.log('Listening on Port 8000')
)
