const favModel = require('../models/favorite-model')
const utilities = require('../utilities/')

const favController = {}

/* ****************************************
* Deliver the user's favorites view
* *************************************** */
favController.buildFavoritesDisplay = async function (req, res, next) {
  try {
    // 1. Get the logged-in user's ID
    const account_id = res.locals.accountData.account_id
    
    // 2. Get their saved vehicles from the database using our new model
    const favData = await favModel.getFavoritesByAccountId(account_id)
    
    // 3. Build the navigation bar 
    let nav = await utilities.getNav()
    
    // 4. Render the view
    res.render("favorites/favorites-view", {
      title: "My Favorite Vehicles",
      nav,
      errors: null,
      favData,
    })
  } catch (error) {
    // ERROR HANDLING
    req.flash("notice", "Sorry, there was an error loading your favorites.")
    res.redirect("/account/")
  }
}

/* ****************************************
* Process adding a new favorite
* *************************************** */
favController.addFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const inv_id = req.params.invId // pass the vehicle ID in the URL

    // DATA VALIDATION: Check if they already favorited it
    const exists = await favModel.checkExistingFavorite(account_id, inv_id)
    
    if (exists > 0) {
      req.flash("notice", "This vehicle is already in your favorites.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    // Add it to the database
    const addResult = await favModel.addFavorite(account_id, inv_id)

    if (addResult) {
      req.flash("notice", "Vehicle successfully added to your favorites!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, adding to favorites failed.")
      res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.")
    res.redirect(`/inv/detail/${req.params.invId}`)
  }
}

/* ****************************************
* Process deleting a favorite
* *************************************** */
favController.deleteFavorite = async function (req, res, next) {
  try {
    const favorite_id = req.params.favoriteId
    
    const deleteResult = await favModel.deleteFavorite(favorite_id)

    if (deleteResult) {
      req.flash("notice", "Vehicle removed from your favorites.")
      res.redirect("/favorites/") // Redirect back to their dashboard
    } else {
      req.flash("notice", "Sorry, the removal failed.")
      res.redirect("/favorites/")
    }
  } catch (error) {
    req.flash("notice", "An unexpected error occurred.")
    res.redirect("/favorites/")
  }
}

module.exports = favController