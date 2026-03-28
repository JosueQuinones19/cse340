const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build specific vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId; // Sacamos el ID de la URL
  const vehicleData = await invModel.getVehicleByInvId(inv_id); // Buscamos en la BD
  
  if (!vehicleData) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err); // Si no existe, mandamos a la página de error 404
  }

  const gridHTML = await utilities.buildVehicleDetail(vehicleData); // Construimos el HTML
  let nav = await utilities.getNav(); // Traemos el menú de navegación
  const vehicleYear = vehicleData.inv_year;
  const vehicleMake = vehicleData.inv_make;
  const vehicleModel = vehicleData.inv_model;

  res.render("./inventory/detail", {
    title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
    nav,
    gridHTML,
  });
};

/* ***************************
 * Build Intentional Error
 * ************************** */
invCont.buildIntentionalError = async function (req, res, next) {
  let error = new Error("This is an intentional 500 error.");
  error.status = 500;
  throw error; // Lanzamos el error a propósito para que el middleware lo atrape
}

module.exports = invCont