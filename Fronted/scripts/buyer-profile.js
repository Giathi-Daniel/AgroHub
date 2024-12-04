//fetch text elements from DOM
const profile_picture = document.getElementById('profile_picture');
const buyer_name = document.getElementById('name');
const email = document.getElementById('email');
const phone_number = document.getElementById('phone_number');
const address = document.getElementById('address');
const joined_at = document.getElementById('joined_at');
const order_count = document.getElementById('order_count');
const recent_order = document.getElementById('recent_order')

//clear text element
buyer_name.textContent = '';
email.textContent = '';
phone_number.textContent = '';
address.textContent = '';
joined_at.textContent = '';



getProfile()

//fetch farmer details from server
async function getProfile (){
  try {
    const response = await fetch('/agrohub/api/buyer/profile/info');

    const result = await response.json();

    buyer_name.textContent = `${result.buyer.first_name} ${result.buyer.last_name}`;
    email.textContent = `${result.buyer.email}`;
    farmer_status.textContent = `${result.farmer.status === "Active"? "Approved" : "Not Approved"}`;
    phone_number.textContent = `${result.farmer.phone_number}`;
    address.textContent = `${result.farmer.address}`;
    date_joined.textContent = 'Not Available';
  } catch (error){
    console.log(error)
  }
}

//fetch farmer products
async function getOrderHistory (){
  try {
    //clear container
    recent_order.innerHTML = '';

    const response = await fetch('/agrohub/api/req/buyer/shipments');

    const result = await response.json();

    console.log(result) //continue from here after upload product page

    //======= IF STATEMENT TO CHECK FOR NO HISTORY =======

    //======= LOOP GOES HERE ==========


    const order = `
      <li class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-700">${result.shipments.product_name}</p>
                <p class="text-sm text-gray-600">Date: ${result.shipments.created_at}</p>
              </div>
              ${result.shipments.shipping_status === 'Delivered'? `<p class="text-green-600 font-semibold">Delivered</p>` : `<p class="text-orange-500 font-semibold">Pending</p>`
              }
            </li>
    `
    
    profile_picture.innerHTML += product;

  } catch (error){
    console.log(error)
  }
}