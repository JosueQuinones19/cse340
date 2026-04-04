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
  
  // CAMBIO AQUÍ: Verificamos si hay datos antes de leer el nombre
  let className 
  if (data.length > 0) {
    className = data[0].classification_name + " vehicles"
  } else {
    className = "No vehicles found"
  }

  res.render("./inventory/classification", {
    title: className,
    nav,
    grid,
  })
}

/* ***************************
 * Build specific vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId; //
  const vehicleData = await invModel.getVehicleByInvId(inv_id); 
  
  if (!vehicleData) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err); 
  }

  const gridHTML = await utilities.buildVehicleDetail(vehicleData); 
  let nav = await utilities.getNav(); 
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
  throw error; 
}
/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 * Deliver Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)

  if (result) {
    let nav = await utilities.getNav() // Esto regenera el nav con la nueva categoría
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}
/* ***************************
 * Deliver Add Inventory View (GET)
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Process Add Inventory (POST)
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const result = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, adding the vehicle failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationSelect,
      errors: null,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
  }
}

module.exports = invCont