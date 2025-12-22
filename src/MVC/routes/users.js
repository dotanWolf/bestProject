const express = require('express')
var router = express.Router()
const controllers = require('../controllers/users')


router.route('/')
    .post(controllers.createNewUser) // הטופס של מסך התחברות שולח ב body את המידע של
// המשתמש כ jso

router.route('/:id')
    .get(controllers.getUser) // ותנת את הפרטים של המשתמש עם המזהה id:( שם, תמונה וכו׳(
// - עליכם להבין בעצמכם אילו שדות אמורים להיות ל user
    
module.exports = router