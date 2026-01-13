const express = require('express')
var router = express.Router()
const userController = require('../controllers/userController')
const tokenController = require('../controllers/tokenController')

router.route('/')
    .post(userController.createNewUser) // הטופס של מסך התחברות שולח ב body את המידע של
// המשתמש כ jso

router.route('/:id')
    .get(tokenController.authenticateToken, userController.getUser);// ותנת את הפרטים של המשתמש עם המזהה id:( שם, תמונה וכו׳(
// - עליכם להבין בעצמכם אילו שדות אמורים להיות ל user
router.route('/email/:email')
    .get(userController.getUserByEmail)
    
module.exports = router