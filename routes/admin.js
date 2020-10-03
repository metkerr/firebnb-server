const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router.get("/login", adminController.viewLogin);
router.post("/login", adminController.login);

router.use(auth);
router.get("/logout", adminController.logout);
router.get("/dashboard", adminController.viewDashboard);

//------CATEGORY------
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.updateCategory);
router.delete("/category/:id", adminController.deleteCategory);

//------BANK------
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

//------ITEM------
router.get("/item", adminController.viewItem);
router.get("/item/:id", adminController.showEditItem);
router.get("/item/show-image/:id", adminController.showItemImage);
router.post("/item", uploadMultiple, adminController.addItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id", adminController.deleteItem);

//endpoint detail item
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);
//feature
router.post("/item/add/feature", upload, adminController.addFeature);
router.put("/item/update/feature", upload, adminController.editFeature);
router.delete("/item/delete/feature/:id", adminController.deleteFeature);
//activity
router.post("/item/add/activity", upload, adminController.addActivty);
router.put("/item/update/activity", upload, adminController.editActivity);
router.delete("/item/delete/activity/:id", adminController.deleteActivity);

//------BOOKING------
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.viewDetailBooking);
router.post("/booking/:id/accept", adminController.bookingConfirmation);
router.post("/booking/:id/reject", adminController.bookingRejection);

module.exports = router;
