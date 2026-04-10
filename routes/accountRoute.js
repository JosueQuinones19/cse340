// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const validate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data (MODIFICADO AQUÍ)
router.post(
  "/register",
  regValidate.registrationRules(), // 1. Validación de datos
  regValidate.checkRegData,        // 2. Verificación de errores de validación
  utilities.handleErrors(accountController.registerAccount) // 3. Guarda en la DB
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Add these with your other routes in accountRoute.js

// Route to deliver the update account view
router.get(
  "/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Route to handle the account update form submission
router.post(
  "/update", 
  utilities.checkLogin,
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to handle the password change form submission
router.post(
  "/update-password", 
  utilities.checkLogin,
  validate.updatePasswordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route to handle the logout process
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router;