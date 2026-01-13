const express = require("express");
var router = express.Router();
const fileController = require("../controllers/fileController");
const tokenController = require("../controllers/tokenController");

router
  .route("/permissions")
  .get(
    tokenController.authenticateToken,
    fileController.getFilesWithPermissions
  );
router
  .route("/folders")
  .get(
    tokenController.authenticateToken,
    fileController.getFolders
  );
router
  .route("/permissions/folders/:parentId")
  .get(
    tokenController.authenticateToken,
    fileController.getFilesWithPermissionsbyParentId
  );
router
  .route("/trash")
  .get(tokenController.authenticateToken, fileController.getTrashEntries);
router
  .route("/starred")
  .get(tokenController.authenticateToken, fileController.getStarredEntries);
router
  .route("/recent")
  .get(tokenController.authenticateToken, fileController.getRecentEntries);

router
  .route("/")
  .get(tokenController.authenticateToken, fileController.getRootEntries) // תחזיר את רשימת כל הקבצים והתיקיות של המשתמש ברמה העליונה ביותר
  .post(tokenController.authenticateToken, fileController.createEntry); // תיצור קובץ/תיקייה חדש/ה

router
  .route("/:id")
  .get(tokenController.authenticateToken, fileController.getEntry) // נותנת את הפרטים של הקובץ/תיקייה שהמזהה שלו זה id
  .patch(tokenController.authenticateToken, fileController.updateEntry) // עורכת קובץ/תיקייה קיים id
  .delete(tokenController.authenticateToken, fileController.deleteEntry); // מוחקת קובץ/תיקייה קיים id:

router
  .route("/:id/permissions")
  .get(tokenController.authenticateToken, fileController.getPermissions) // נותנת את ההרשאות של הקובץ/תיקייה שהמזהה שלו זה id
  .post(tokenController.authenticateToken, fileController.createPermissions); // יוצרת הרשאות עבור הקובץ/תיקייה שהמזהה שלו הוא id

router
  .route("/:id/permissions/:pId")
  .patch(fileController.updatePermisssion) // מעדכנת את ההרשאות של pId
  .delete(fileController.deletePermission); // מוחקת את ההרשאות של pId

router
  .route("/folders/:parentId")
  .get(tokenController.authenticateToken, fileController.getFolderEntries);

module.exports = router;
