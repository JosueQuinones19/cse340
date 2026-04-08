'use strict' 
 
 // 1. Find the dropdown menu in the HTML
 let classificationList = document.querySelector("#classificationList")

 // 2. Wait for the user to pick a different option
 classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  console.log(`classification_id is: ${classification_id}`) 
  
  // 3. Build the URL to ask the server for data
  let classIdURL = "/inv/getInventory/"+classification_id 

  // 4. The AJAX Fetch request
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); // This turns the raw data into a JS Object
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); // You will see the list of cars in your browser console
   buildInventoryList(data); // This calls the function to build the table
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })

 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 
 // 1. Set up the table header labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 
 // 2. Set up the table body 
 dataTable += '<tbody>'; 
 
 // 3. Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.inv_id + ", " + element.inv_model); 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  // These links will be used in future activities for editing and deleting
  dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 
 dataTable += '</tbody>'; 
 
 // 4. Inject the finished HTML string into the empty table in the view
 inventoryDisplay.innerHTML = dataTable; 
}