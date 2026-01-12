const express = require('express')
var router = express.Router()
const controllers = require('../controllers/tokenController')

router.route('/')
    .post(controllers.createJWT)

router.route('/:email')
    .get(controllers.doesEmailExist)
    
module.exports = router