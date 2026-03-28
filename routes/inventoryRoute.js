// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build a specific vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
// Route to trigger an intentional error
router.get("/trigger-error", utilities.handleErrors(invController.buildIntentionalError));

module.exports = router;