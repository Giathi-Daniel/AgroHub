//fetch DOM element
const cart_items = document.getElementById('cart_items');
const checkOutBtn = document.getElementById('checkOutBtn');

//clear items from display
cart_items.innerHTML = ''

//get cart items from server
getCartItem();

//checkout cart
checkOutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkout();
})


//function to get cart items from server
async function getCartItem () {
  const response = await fetch('/agrohub/api/req/buyer/cart/items');

  const result = await response.json()

  const cart = result.cart
  const count = result.itemCount
console.log(cart)
  if (count === 0){
    return cart_items.innerHTML = `<div class="text-center text-gray-600">Your cart is empty.</div>`
  }
  //summarize cart
  summarizeCart(cart)

  //clear div area
  cart_items.innerHTML = ''

  //loop to display cart items
  cart.forEach(item => {
    const product = `
      <div class="flex items-center space-x-4">
        <img
          src= ${item.image_data}
          alt="Product Image"
          class="object-cover w-16 h-16 rounded-lg"
        />
        <div>
          <h3 class="font-semibold text-gray-800">
            ${item.product_name}
          </h3>
          <p class="text-gray-600">Price: ${item.price}</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <button
            class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200"
            id="${item.product_id}-rm"
          >
            -
          </button>
          <input
            id="${item.product_id}-qty"
            type="number"
            value="${item.quantity}"
            min="1"
            class="w-12 text-center border rounded"
          />
          <button
            id="${item.product_id}-add"
            class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200"
          >
            +
          </button>
        </div>

        <button id="${item.product_id}-remove" class="text-sm text-red-600 hover:underline">
          Remove
        </button>
      </div>
    </div>
    <br>
    `

    cart_items.innerHTML += product;
    
    //update cart when button is clicked
    document.getElementById(`${item.product_id}-add`).addEventListener('click', () => {
      // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) + 1)

      let addQty = document.getElementById(`${item.product_id}-qty`).value; 
      addQty = parseInt(addQty)
      addQty += 1
      updateCart (item.product_id, addQty) //update the cart and display quatity
    })

    document.getElementById(`${item.product_id}-rm`).addEventListener('click', () => {
      // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) - 1)
      let minusQty = document.getElementById(`${item.product_id}-qty`).value; 
      minusQty = parseInt(minusQty)
      minusQty -= 1
      updateCart (item.product_id, minusQty) //update the cart and display quatity
    })

    document.getElementById(`${item.product_id}-remove`).addEventListener('click', () => {
      removeCartItem(item.product_id)
    })

    //update quantity when input is changed manualy
    document.getElementById(`${item.product_id}-qty`).addEventListener('change', () => {
      // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value))
    })


  })
}

//function to update cart on server
async function updateCart (productId, quantity) {
  const response = await fetch(`/agrohub/api/req/buyer/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({product_id: productId, quantity: quantity})
  })

  const result = await response.json()

  if (result.success) {
    getCartItem() //reload the page 
  } else {
    alert('Failed to update cart')
  }
}

//function to remove cart item on server
async function removeCartItem (productId) {
  const response = await fetch(`/agrohub/api/req/buyer/cart/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({product_id: productId})
  })

  const result = await response.json()

  if (result.success) {
    getCartItem()
  } else {
    alert('Failed to remove item from cart')
  }
}

//summarize cart
function summarizeCart (cart) {
  const subtotal = document.getElementById('subtotal');
  const itemNum = document.getElementById('count');
  const total_price = document.getElementById('total_price');

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity
  })

  subtotal.innerHTML = `$${parseFloat(totalPrice)}`;
  itemNum.innerHTML = `${cart.length}`
  total_price.innerHTML = `$${parseFloat(totalPrice)}`

  // return `Total items: ${count}, Total price: $${totalPrice.toFixed(2)}`
}

// document.getElementById('summary').innerHTML = summarizeCart()

//function to checkout
async function checkout () {
  const response = await fetch(`/agrohub/api/req/buyer/cart/checkout`)

  const result = await response.json()

  if (result.success) {
    alert('Successfully checked out')
    cart_items.innerHTML = `<h3 class="text-3xl font-bold text-gray-900">Cart is empty.</h3>`
    count = 0
  } else {
    alert('Failed to checkout')
  }
}