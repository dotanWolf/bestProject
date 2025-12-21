const express = require('express')
var app = express()
const files = require('./routes/server');

app.use(express.json())
app.use('/api/files', files)
app.use('/api/users', users)
app.use('/api/tokens', tokens)
app.use('/api/search', search)


    
app.listen(8080)


