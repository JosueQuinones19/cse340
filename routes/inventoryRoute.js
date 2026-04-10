// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation") 

// ******************************************
//  Inventory Management Routes (Protected)
// ******************************************

// Route to build inventory management view
router.get(
  "/", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.buildManagement)
);

// Route to deliver add classification view GET
router.get(
  "/add-classification", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process adding a classification POST
router.post(
  "/add-classification",
  utilities.checkAccountType, // <-- Added Protection
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// GET para ver el formulario (Add Inventory)
router.get(
  "/add-inventory", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.buildAddInventory)
);

// POST to process adding a new inventory item
router.post(
  "/add-inventory", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.addInventory)
);

// Route to deliver the edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.editInventoryView)
)

// Route to handle the update request with validation
router.post(
  "/update/",
  utilities.checkAccountType, // <-- Added Protection
  invValidate.newInventoryRules(), 
  invValidate.checkUpdateData,    
  utilities.handleErrors(invController.updateInventory)
)

// Deliver the Delete Confirmation View
router.get(
  "/delete/:inv_id", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.buildDeleteConfirmationView)
)

// Process the Delete Request
router.post(
  "/delete", 
  utilities.checkAccountType, // <-- Added Protection
  utilities.handleErrors(invController.deleteItem)
)


// ******************************************
//  Public Delivery Routes (NOT Protected)
// ******************************************

// Route to build inventory by classification view
router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build a specific vehicle detail view
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildByInvId)
);

// Route to return inventory by classification identifier as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to trigger an intentional error
router.get(
  "/trigger-error", 
  utilities.handleErrors(invController.buildIntentionalError)
);

module.exports = router;