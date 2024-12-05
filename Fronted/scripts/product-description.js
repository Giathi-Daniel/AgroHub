var swiper = new Swiper(".swiper-container", {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

//get id  from URL
const pathname = window.location.pathname;

// Extract the id using split or regular expressions
const product_id = pathname.split("/").pop(); // This gets the last part of the URL

//fetch fields from DOM
const mainImage = document.getElementById("mainImage");
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const image4 = document.getElementById("image4");
const product_name = document.getElementById("product_name");
const price = document.getElementById("price");
const description = document.getElementById("description");
const addToCartBtn = document.getElementById("add-to-cart");

//clear fields
mainImage.src = "";
// image1.src = '';
// image2.src = '';
// image3.src = '';
// image4.src = '';
product_name.textContent = "";
price.textContent = "";
description.textContent = "";

//product object
let po;

getProductDetails();

//add to cart button

addToCartBtn.addEventListener("click", () => {
  addToCart(po);
});

//add to cart function
async function addToCart(productObject) {
  try {
    const response = await fetch("/agrohub/api/req/buyer/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productObject),
    });

    const result = await response.json();

    if (result.success) {
      alert("Product added to cart successfully!");
      console.log(result)
    } else {
      alert("Failed to add product to cart.");
    }
  } catch (error) {
    console.error(error);
  }
}

//fetch product details from server
async function getProductDetails() {
  try {
    const response = await fetch(`/agrohub/api/req/buyer/product/id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: product_id }),
    });

    const result = await response.json();

    //convert image base64 to blob
    const [metadata] = result.product.image_data.split(",");

    const byteCharacters = atob(metadata); // Decode the base64 string to binary data
    const byteArrays = [];

    // Convert binary string to byte array
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      const byte = byteCharacters.charCodeAt(offset);
      byteArrays.push(byte);
    }

    // Create a blob object from the byte array
    const imageBlob = new Blob([new Uint8Array(byteArrays)], {
      type: result.product.image_type,
    });

    // Convert the blob to an image URL
    const image_data = URL.createObjectURL(imageBlob);

    //pass url to the image element src
    mainImage.src = image_data;

    //pass product name
    product_name.textContent = result.product.product_name;

    //pass price
    price.textContent = `$${result.product.price}`;

    //pass description
    description.textContent = result.product.description;

    //pass product data to product object
    po = {
      product_id: result.product_id,
      product_name: result.product_name,
      price: result.price,
      discount: result.discount,
      image_data: image_data
    };
  } catch (error) {
    console.error(error);
  }
}
