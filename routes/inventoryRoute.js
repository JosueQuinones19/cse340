// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation") // Movido arriba por orden

// ******************************************
//  Inventory Management Routes 
// ******************************************

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to deliver add classification view GET
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process adding a classification POST
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// ******************************************
//  Existing Delivery Routes
// ******************************************

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a specific vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to trigger an intentional error
router.get("/trigger-error", utilities.handleErrors(invController.buildIntentionalError));

// GET para ver el formulario
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// POST to process adding a new inventory item
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Route to handle the update request with validation
router.post(
  "/update/",
  invValidate.newInventoryRules(), // This must exist in inventory-validation.js
  invValidate.checkUpdateData,    // The function we just created above
  utilities.handleErrors(invController.updateInventory)
)

// Route to return inventory by classification identifier as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to deliver the edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

module.exports = router;