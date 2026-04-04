// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

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
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;