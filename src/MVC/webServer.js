require('dotenv').config();
const express = require('express')
var app = express()
const files = require('./routes/files');
const users = require('./routes/users');
const tokens = require('./routes/tokens');
const search = require('./routes/search');
const cors = require('cors');

app.use(cors({
  exposedHeaders: ['Location'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json())
app.use('/api/files', files)
app.use('/api/users', users)
app.use('/api/tokens', tokens)
app.use('/api/search', search)

app.listen(8080)


