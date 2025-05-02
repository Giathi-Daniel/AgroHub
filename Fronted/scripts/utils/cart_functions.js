//function to get cart items from server
export async function getCartItem() {
  const response = await fetch("/agrohub/api/req/buyer/cart/items");

  const result = await response.json();

  //if user is not logged in redirect
  if (result.status == 401) {
    window.location.href = "/agrohub/pub/login";
  }

  let cart;
  // check if cart is new
  if (result.cart.cart_items === "No product yet") {
    cart = [];
  } else {
    cart = result.cart;
  }

  return cart;
}

//function to update cart on server
export async function updateCart(productId, quantity) {
  const cart = await getCartItem();

  let itemFound = false;
  let itemIndex;

  if (cart.length > 0) {
    cart.forEach((item) => {
      if (item.product_id == productId) {
        itemIndex = cart.indexOf(item);
        itemFound = true;
      }
    });
  }

  //if item is in cart update quantity
  if (itemFound) {
    cart[itemIndex].quantity = quantity;
  } else {
    return;
  }

  const message = await sendCartToDB(cart);

  console.log(message);

  // const response = await fetch(`/agrohub/api/req/buyer/cart/update`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({cart})
  // })

  // const result = await response.json()

  // if (result.success) {
  //   getCartItem() //reload the page
  // } else {
  //   alert('Failed to update cart')
  // }
}

// function to remove item from cart
export async function removeCartItem(productId) {
  const cart = await getCartItem();

  cart.forEach((product) => {
    if (product.product_id == productId) {
      const productIndex = cart.indexOf(product);
      cart.splice(productIndex, 1);
    }
  });

  const message = await sendCartToDB(cart);

  console.log(message);
}

// function to save cart to database
export async function sendCartToDB(cart) {
  let message = "";
  try {
    const response = await fetch("/agrohub/api/req/buyer/cart/add", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    const result = await response.json();

    if (result.success) {
      message = "Cart updated successfully!";
      // console.log(result)
    } else {
      message = "Failed to update cart.";
    }

    //if user is not logged in redirect
    if (result.status == 401) {
      window.location.href = "/agrohub/pub/login";
    }

    // return message
    return message;
  } catch (error) {
    console.error(error);
    message = "Error sending cart to Database";
    return message;
  }
}
