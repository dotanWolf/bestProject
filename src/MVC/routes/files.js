const express = require('express')
var router = express.Router()
const controllers = require('../controllers/fileController')

router.route('/trash')
    .get(controllers.getTrashEntries);
router.route('/starred')
    .get(controllers.getStarredEntries);

router.route('/')
    .get(controllers.getAllEntries) // תחזיר את רשימת כל הקבצים והתיקיות של המשתמש ברמה העליונה ביותר
    .post(controllers.createEntry) // תיצור קובץ/תיקייה חדש/ה

router.route('/:id')
    .get(controllers.getEntry) // נותנת את הפרטים של הקובץ/תיקייה שהמזהה שלו זה id
    .patch(controllers.updateEntry) // עורכת קובץ/תיקייה קיים id
    .delete(controllers.deleteEntry) // מוחקת קובץ/תיקייה קיים id:

router.route('/:id/permissions')
    .get(controllers.getPermissions) // נותנת את ההרשאות של הקובץ/תיקייה שהמזהה שלו זה id
    .post(controllers.createPermissions) // יוצרת הרשאות עבור הקובץ/תיקייה שהמזהה שלו הוא id

router.route('/:id/permissions/:pId')
    .patch(controllers.updatePermisssion) // מעדכנת את ההרשאות של pId
    .delete(controllers.deletePermission) // מוחקת את ההרשאות של pId
    
module.exports = router