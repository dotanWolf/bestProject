const express = require('express')
var router = express.Router()
const searchController = require('../controllers/searchController')
const tokenController = require('../controllers/tokenController')
router.route('/:query')
    .get(tokenController.authenticateToken, searchController.searchFiles) // נותנת את הקבצים/תיקיות שהם תוצאת החיפוש של query,: כלומר, קובץ/תיקייה
// שבשמם או בתוכן שלהם מוכלת המחרוזת query
    
module.exports = router