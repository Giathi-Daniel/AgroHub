//fetch text elements from DOM
const profile_picture = document.getElementById('profile_picture');
const farmer_name = document.getElementById('farmer_name');
const farmer_email = document.getElementById('farmer_email');
const farm_name = document.getElementById('farm_name');
const farmer_status = document.getElementById('status');
const phone_number = document.getElementById('phone_number');
const address = document.getElementById('address');
const date_joined = document.getElementById('date_joined');
const product_count = document.getElementById('product_count');
const products_container = document.getElementById('products_container')

//clear text element
farmer_name.textContent = '';
farmer_email.textContent = '';
farm_name.textContent = '';
farmer_status.textContent = '';
phone_number.textContent = '';
address.textContent = '';
date_joined.textContent = '';
// product_count.textContent = '';



getProfile()

//fetch farmer details from server
async function getProfile (){
  try {
    const response = await fetch('/agrohub/api/farmer/profile/info');

    const result = await response.json();

    farmer_name.textContent = `${result.farmer.first_name} ${result.farmer.last_name}`;
    farmer_email.textContent = `${result.farmer.email}`;
    farm_name.textContent = `${result.farmer.farm_name}`;
    farmer_status.textContent = `${result.farmer.status === "Active"? "Approved" : "Not Approved"}`;
    phone_number.textContent = `${result.farmer.phone_number}`;
    address.textContent = `${result.farmer.address}`;
    date_joined.textContent = 'Not Available';
  } catch (error){
    console.log(error)
  }
}

//fetch farmer products
async function getProducts (){
  try {
    //clear container
    products_container.innerHTML = '';

    const response = await fetch('/agrohub/api/req/farmer/products');

    const result = await response.json();

    console.log(result) //continue from here after upload product page

    //======= IF STATEMENT TO CHECK FOR NO PRODUCT =======

    //======= LOOP GOES HERE ==========

    const imageBlob = result.product.image_data; // Adjust this line based on actual data structure

    // Convert the blob to an image URL
    const image_url = URL.createObjectURL(imageBlob);


    const product = `
      <img
        src=${image_url}
        alt="Product"
        class="w-20 h-20 rounded-lg object-cover mr-4"
      />
      <div>
        <p class="font-semibold text-gray-700">${result.product.name}</p>
        <p class="text-sm text-gray-600">Price: ${result.product.price}</p>
        <p class="text-sm text-gray-600">Status: ${result.product.status}</p>
      </div>
    `
    
    products_container.innerHTML += product;

  } catch (error){
    console.log(error)
  }
}