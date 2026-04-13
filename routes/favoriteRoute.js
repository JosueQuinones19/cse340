const express = require("express")
const router = new express.Router()
const favController = require("../controllers/favoriteController")
const utilities = require("../utilities/")
// express-validator: Data Validation
const { param } = require("express-validator") 

// 1. Route to display the favorites dashboard (Protected by checkLogin)
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(favController.buildFavoritesDisplay)
)

// 2. Route to add a favorite (Protected + Validated)
router.get("/add/:invId", 
  utilities.checkLogin,
  // SERVER-SIDE DATA VALIDATION: Ensure the invId in the URL is a strict integer
  param("invId").isInt().withMessage("Invalid vehicle ID."),
  utilities.handleErrors(favController.addFavorite)
)

// 3. Route to delete a favorite (Protected + Validated)
router.get("/delete/:favoriteId", 
  utilities.checkLogin,
  // SERVER-SIDE DATA VALIDATION: Ensure the favoriteId is a strict integer
  param("favoriteId").isInt().withMessage("Invalid favorite ID."),
  utilities.handleErrors(favController.deleteFavorite)
)

module.exports = router