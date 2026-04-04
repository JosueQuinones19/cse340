const { body, validationResult } = require("express-validator")
const utilities = require("./index") // Importamos las utilidades de forma limpia
const validate = {}

/* **********************************
 * Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name (no spaces or special characters)."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body // Extraemos el dato del cuerpo de la petición
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav() // Usamos la constante utilities definida arriba
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name, // Enviamos el dato de vuelta a la vista para la "stickiness"
    })
    return
  }
  next()
}

module.exports = validate