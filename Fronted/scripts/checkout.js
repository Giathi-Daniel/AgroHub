//fetch div element from DOM
const productList = document.getElementById('product_list');
const totalOrder = document.getElementById('total-order');

getCartItem()

//function to get products
async function getCartItem () {
  const response = await fetch('/agrohub/api/req/buyer/cart/items');

  const result = await response.json()

  const cart = result.cart
  const count = result.itemCount
  let totalPrice = 0.0

  if (count === 0){
    summarizeCart(cart)
    return cart_items.innerHTML = `<div class="text-center text-gray-600">Your cart is empty.</div>`
  }

  //cart is not empty
  isEmpty = false;


  //clear products from display
  productList.innerHTML = ''
  totalOrder.innerHTML = ''

  //loop to display cart items
  cart.forEach(item => {
    const product = `

      <div class="flex justify-between pb-4 border-b">
        <div class="flex items-center space-x-2">
          <img
            src= ${item.image_data}
            alt="Product"
            class="object-cover w-16 h-16 rounded-lg"
          />
          <p class="text-lg">${item.product_name}</p>
        </div>
        <p class="text-lg">$${parseFloat(item.price) * item.quantity}</p>
      </div>
  
      <br>
    `
    totalPrice += parseFloat(item.price) * item.quantity;
    totalOrder.innerHTML = `$${totalPrice}`
    productList.innerHTML += product;
    // cart_items.style.flexDirection = 'column'

  })
}
