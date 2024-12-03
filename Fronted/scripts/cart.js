//fetch DOM element
const cart_items = document.getElementById('cart_items')

//declare cart variable
let cart;
let count;

//get cart items from server
getCartItem();


//function to get cart items from server
async function getCartItem () {
  const response = await fetch('/agrohub/api/req/buyer/cart/items');

  const result = await response.json()

  cart = result.cart
  count = result.itemCount

  if (cart.length === 0 || count === 0){
    return cart_items.innerHTML = `<h3 class="text-3xl font-bold text-gray-900">Cart is empty.</h3>`
  }
  //continue from here
  cart.forEach(item => {
    const product = `
      <div class="flex items-center space-x-4">
        <img
          src="https://cdn.pixabay.com/photo/2019/07/03/20/56/tomatoes-4315442_640.png"
          alt="Product Image"
          class="object-cover w-16 h-16 rounded-lg"
        />
        <div>
          <h3 class="font-semibold text-gray-800">
            Organic Fresh Tomatoes
          </h3>
          <p class="text-gray-600">Price: $19.99 / kg</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <button
            class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200"
          >
            -
          </button>
          <input
            type="number"
            value="1"
            min="1"
            class="w-12 text-center border rounded"
          />
          <button
            class="px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-200"
          >
            +
          </button>
        </div>

        <button class="text-sm text-red-600 hover:underline">
          Remove
        </button>
      </div>
    </div>`
  })
}