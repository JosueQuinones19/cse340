const pool = require('../database/')

/* ***************************
 * Add a vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Get all favorites for a specific account
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    // I am using a JOIN here so I don't just get the ID numbers back; 
    // we get the actual vehicle details (make, model, image, etc.) to display on the screen!
    const sql = `
      SELECT f.favorite_id, f.account_id, f.inv_id, 
             i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail 
      FROM favorites f 
      JOIN inventory i ON f.inv_id = i.inv_id 
      WHERE f.account_id = $1`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Delete a favorite
 * ************************** */
async function deleteFavorite(favorite_id) {
  try {
    const sql = 'DELETE FROM favorites WHERE favorite_id = $1'
    const data = await pool.query(sql, [favorite_id])
    return data
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Check if a favorite already exists (Data Validation!)
 * ************************** */
async function checkExistingFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2"
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount // Returns 1 if it exists, 0 if it doesn't
  } catch (error) {
    return error.message
  }
}

module.exports = { 
  addFavorite, 
  getFavoritesByAccountId, 
  deleteFavorite, 
  checkExistingFavorite 
}