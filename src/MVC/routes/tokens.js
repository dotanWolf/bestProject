const express = require('express')
var router = express.Router()
const controllers = require('../controllers/tokens')

router.route('/')
    .post(controllers.doesUserExist)

    
module.exports = router