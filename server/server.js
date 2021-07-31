const express = require('express')
const router = require('./src/routers')
require('dotenv').config()
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

const port = 5001

app.listen(port, () => {
    console.log(`Your server running on port ${port}`)
})