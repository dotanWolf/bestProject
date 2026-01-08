const express = require('express')
var router = express.Router()
const controllers = require('../controllers/tokenController')

router.route('/')
    .post(controllers.doesUserExist)

router.route('/:email')
    .get(controllers.doesEmailExist)
    
module.exports = router