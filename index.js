const connectToMongo = require('./db')


connectToMongo()
const express = require('express')
require('dotenv').config()
const port = process.env.PORT;
var cors = require('cors')
var app = express()
 

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/logins', require('./routes/logins'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})