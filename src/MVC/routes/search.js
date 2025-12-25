const express = require('express')
var router = express.Router()
const controllers = require('../controllers/searchController')

router.route('/:query')
    .get(controllers.searchFiles) // נותנת את הקבצים/תיקיות שהם תוצאת החיפוש של query,: כלומר, קובץ/תיקייה
// שבשמם או בתוכן שלהם מוכלת המחרוזת query
    
module.exports = router