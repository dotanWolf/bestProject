const express = require('express')
var router = express.Router()
const fileController = require('../controllers/fileController')
const tokenController = require('../controllers/tokenController')

router.route('/trash')
    .get(fileController.getTrashEntries);
router.route('/starred')
    .get(fileController.getStarredEntries);

router.route('/')
    .get(tokenController.authenticateToken, fileController.getRootEntries) // תחזיר את רשימת כל הקבצים והתיקיות של המשתמש ברמה העליונה ביותר
    .post(tokenController.authenticateToken, fileController.createEntry) // תיצור קובץ/תיקייה חדש/ה

router.route('/:id')
    .get(fileController.getEntry) // נותנת את הפרטים של הקובץ/תיקייה שהמזהה שלו זה id
    .patch(fileController.updateEntry) // עורכת קובץ/תיקייה קיים id
    .delete(fileController.deleteEntry) // מוחקת קובץ/תיקייה קיים id:

router.route('/:id/permissions')
    .get(fileController.getPermissions) // נותנת את ההרשאות של הקובץ/תיקייה שהמזהה שלו זה id
    .post(fileController.createPermissions) // יוצרת הרשאות עבור הקובץ/תיקייה שהמזהה שלו הוא id

router.route('/:id/permissions/:pId')
    .patch(fileController.updatePermisssion) // מעדכנת את ההרשאות של pId
    .delete(fileController.deletePermission) // מוחקת את ההרשאות של pId

router.route('/folders/:parentId')
    .get(tokenController.authenticateToken, fileController.getFolderEntries)
module.exports = router