// import cart functions from cart_functions.js
import { getCartItem, updateCart, removeCartItem } from "./utils/cart_functions.js";

//fetch DOM element
const cart_items = document.getElementById('cart_items');
const checkOutBtn = document.getElementById('checkOutBtn');

//clear items from display
cart_items.innerHTML = ''

//if cart empty
let isEmpty = true;

//render cart items to page
renderCart();

//checkout cart
checkOutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // console.log(isEmpty)
  //navigate to check out page
  if (isEmpty) {
    alert('Your cart is empty, please add items first.')
    return;
  }

  window.location.href = '/agrohub/api/req/buyer/checkout'
  // checkout();
})

// function to render cartItem
async function renderCart() {
  // get cart items
  const cart = await getCartItem ()

  // check if cart is empty
  if (cart.length === 0){
    summarizeCart(cart)
    return cart_items.innerHTML = `<div class="text-center text-gray-600">Your cart is empty.</div>`
  }

  //cart is not empty
  isEmpty = false;

  //summarize cart
  summarizeCart(cart)

  //clear div area
  cart_items.innerHTML = ''

  //loop to display cart items
  cart.forEach(item => {
    const product = `
      <div>
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
              class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200
              js-minus-cart-item
              "
              id="${item.product_id}-rm"
            >
              -
            </button>
            <input
              id="${item.product_id}-qty"
              type="number"
              value="${item.quantity}"
              min="1"
              class="w-12 text-center border rounded
              js-qty-cart-item
              "
            />
            <button
              id="${item.product_id}-add"
              class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200
              js-add-cart-item
              "
            >
              +
            </button>
          </div>

          <button id="${item.product_id}-remove" class="text-sm text-red-600 hover:underline
          js-rm-cart-item
          ">
            Remove
          </button>
        </div>
      </div>
    </div>  
    <br>
    `

    cart_items.innerHTML += product;
    cart_items.style.flexDirection = 'column';

  })

  //update cart when minus qty button is clicked
  document.querySelectorAll('.js-minus-cart-item')
    .forEach(minusBtn => {
      let productId = minusBtn.id.slice(0, minusBtn.id.search('-'));

      minusBtn.addEventListener('click', async () => {
        // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) + 1)

        let minusQty = document.getElementById(`${productId}-qty`).value; 
        minusQty = parseInt(minusQty)
        minusQty -= 1
        await updateCart (productId, minusQty) //update the cart and display quatity
        await renderCart()
      })
    })

  //update cart when qty input field is changed
  document.querySelectorAll('.js-qty-cart-item')
    .forEach(qtyInput => {
      let productId = qtyInput.id.slice(0, qtyInput.id.search('-'));

      qtyInput.addEventListener('change', async () => {
        // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) + 1)

        await updateCart (productId, parseInt(document.getElementById(`${productId}-qty`).value)) //update the cart and display quatity
        await renderCart()
      })
    })

  //update cart when add qty button is clicked
  document.querySelectorAll('.js-add-cart-item')
    .forEach(addBtn => {
      let productId = addBtn.id.slice(0, addBtn.id.search('-'));

      addBtn.addEventListener('click', async () => {
        // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) + 1)

        let addQty = document.getElementById(`${productId}-qty`).value; 
        addQty = parseInt(addQty)
        addQty += 1
        await updateCart (productId, addQty) //update the cart and display quatity
        await renderCart()
      })
    })

  //update cart when remove button is clicked
  document.querySelectorAll('.js-rm-cart-item')
    .forEach(removeBtn => {
      let productId = removeBtn.id.slice(0, removeBtn.id.search('-'));

      removeBtn.addEventListener('click', async () => {
        // updateCart(item.product_id, parseInt(document.getElementById(`${item.product_id}-qty`).value) + 1)

        await removeCartItem(productId)
        await renderCart()
      })
    })

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