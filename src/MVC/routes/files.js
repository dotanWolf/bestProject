const express = require('express')
var router = express.Router()
const controllers = require('../controllers/files')

router.route('/')
    .get(controllers.getAllFiles) // תחזיר את רשימת כל הקבצים והתיקיות של המשתמש ברמה העליונה ביותר
    .post(controllers.createFileOrDirectory) // תיצור קובץ/תיקייה חדש/ה

router.route('/:id')
    .get(controllers.getFileContent) // נותנת את הפרטים של הקובץ/תיקייה שהמזהה שלו זה id
    .patch(controllers.updateFileContent) // עורכת קובץ/תיקייה קיים id
    .delete(controllers.deleteFile) // מוחקת קובץ/תיקייה קיים id:

router.route('/:id/permissions')
    .get(controllers.getFilePermissions) // נותנת את ההרשאות של הקובץ/תיקייה שהמזהה שלו זה id
    .post(controllers.updateFilePermissions) // יוצרת הרשאות עבור הקובץ/תיקייה שהמזהה שלו הוא id

router.route('/:id/permissions/:pId')
    .patch(controllers.updatePermisssion) // מעדכנת את ההרשאות של pId
    .delete(controllers.deletePermission) // מוחקת את ההרשאות של pId
    
module.exports = router