const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = "" //
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build the HTML for a specific vehicle detail view
 * **************************************** */
Util.buildVehicleDetail = async function (vehicle) {
  let detailHTML = "";
  if (vehicle) {
    let formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(vehicle.inv_price);

  
    let formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    
    detailHTML += '<div class="vehicle-detail-container">';
    detailHTML += `<div class="vehicle-image-box">`;
    detailHTML += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`;
    detailHTML += `</div>`;
    
    detailHTML += `<div class="vehicle-info-box">`;
    detailHTML += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
    detailHTML += `<p class="vehicle-price"><strong>Price:</strong> ${formattedPrice}</p>`;
    detailHTML += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
    detailHTML += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
    detailHTML += `<p><strong>Mileage:</strong> ${formattedMileage} miles</p>`;
    detailHTML += `</div>`;
    detailHTML += '</div>';
  } else {
    detailHTML += '<p class="notice">Sorry, no vehicle could be found.</p>';
  }
  return detailHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util