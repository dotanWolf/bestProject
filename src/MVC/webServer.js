const express = require('express')
var app = express()
const files = require('./routes/files');
const users = require('./routes/users');
const tokens = require('./routes/tokens');
const search = require('./routes/search');

app.use(express.json())
app.use('/api/files', files)
app.use('/api/users', users)
app.use('/api/tokens', tokens)
app.use('/api/search', search)

app.listen(8080)


