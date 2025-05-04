// HERO SECTION SLIDER
const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    effect: "fade",
    autoplay: {
        delay: 5000,
    },
});

// PRODUCTS SECTION SLIDER 
var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        400: {
        slidesPerView: 2,
        spaceBetween: 3,
        },
        768: {
        slidesPerView: 3,
        spaceBetween: 4,
        },
        1024: {
        slidesPerView: 4,
        spaceBetween: 4,
        },
        1200: {
        slidesPerView: 5,
        spaceBetween: 6,
        },
    },
});

//fetch product container from DOM
const productContainer = document.getElementById('product-container');
const productContainer2 = document.getElementById('product-container2');

productContainer.innerHTML = '';
productContainer2.innerHTML = '';

getProducts ()

//get products from server
async function getProducts (){
    try {
        const response = await fetch('/agrohub/api/req/buyer/products');
        
        const result = await response.json();
        
        result.products.forEach(product => {
            
            // split base64 character to extract strings
            // const [metadata, base64Data] = product.image_data.split(',');
            // - NOTE: the above code is note necessary as the base64 string require no splitting
            
            // decode Base64 strings into byte with atob()
            const byteCharacters = atob(product.image_data); // Decode the base64 string to binary data
            
            const byteArrays = [];

            // Convert binary string to byte array
            for (let offset = 0; offset < byteCharacters.length; offset++) {
                // get the unicode of each byte character
                const byte = byteCharacters.charCodeAt(offset);

                // add unicode to the byteArray list
                byteArrays.push(byte);
            }

            // Create a blob object from the byte array list
            const imageBlob = new Blob([new Uint8Array(byteArrays)], { type: product.image_type });

            // Convert the blob to an image URL
            const image_data = URL.createObjectURL(imageBlob);


            const productElement = `
                <div
                class="rounded-lg shadow-md bg-white w-[13rem] h-auto hover:shadow-lg transition duration-150 ease-in">
                    <div class="w-full rounded-lg">
                    <a href="/agrohub/pub/product/${product.product_id}">
                        <img
                        id="imageId${product.product_id}"
                        src="${image_data}"
                        alt="${product.product_name}"
                        class="w-auto rounded-t-lg hover:curso-pointer"
                        />
                    </a>
                    </div>
                    <div class="p-3">
                    <h3 class="font-semibold text-black" >
                    ${product.product_name}
                    </h3>
                    <div class="flex items-center justify-start space-x-4">
                        <p class="font-semibold text-orange-500">
                        $${product.price}
                        </p>
                        <p class="text-gray-500 line-through">
                        $${product.discount}
                        </p>
                    </div>
                    <p
                        class="text-sm text-gray-500 select-none"
                    >
                    ${product.description}
                    </p>

                    <!-- Add to cart button and success message -->
                    <div class="flex flex-col">
                        <a
                        href="/agrohub/api/req/buyer/cart/add/${product.product_id}"
                        class="text-sm bg-orange-500 py-2 px-4 text-white cursor-pointer hover:bg-orange-600 transition duration-150 ease-out rounded-3xl flex items-center justify-center w-[fit-content] mt-2"
                        >Add to Cart</a
                        >
                        <p
                        class="flex items-center mt-2 text-sm text-green-600"
                        id="${product.product_id}add-to-cart-msg"
                        >
                        <i
                            class="flex items-center justify-center w-5 h-5 mr-1 text-white bg-green-600 rounded-full fa-solid fa-check"
                        ></i>
                        Added to cart
                        </p>
                    </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productElement;
            productContainer2.innerHTML += productElement;
            //pass url to the image element src
            // const imageElement = document.getElementById(`imageId${product.product_id}`)
            // imageElement.src = image_data;
        });
        
    } catch (error) {
        console.error(error);
    
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error fetching products. Please try again later.';
        productContainer.appendChild(errorMessage);
    
        // show error message
        document.getElementById('error-message').style.display = 'block';
    
        // hide loading spinner
        document.getElementById('loading-spinner').style.display = 'none';
    
        // show error button
        document.getElementById('error-button').style.display = 'block';
    
        // show back to home button
        document.getElementById('back-to-home-button').style.display = 'block';
    
        // remove previous error message
        const previousErrorMessage = document.getElementById('error-message');
        if(previousErrorMessage) {
            previousErrorMessage.parentNode.removeChild(previousErrorMessage);
        }
    
        // remove previous loading spinner
        const previousLoadingSpinner = document.getElementById('loading-spinner');
        if(previousLoadingSpinner) {
            previousLoadingSpinner.parentNode.removeChild(previousLoadingSpinner);
        }
    
        // remove previous error button
        const previousErrorButton = document.getElementById('error-button');
        if(previousErrorButton) {
            previousErrorButton.parentNode.removeChild(previousErrorButton);
        }
        
        // remove previous back to home button
        const previousBackToHomeButton = document.getElementById('back-to-home-button');
        if(previousBackToHomeButton) {
            previousBackToHomeButton.parentNode.removeChild(previousBackToHomeButton);
        }
    
        // remove previous hero slider
        const previousHeroSwiper = document.querySelector('.hero-swiper');
        if(previousHeroSwiper) {
            previousHeroSwiper.parentNode.removeChild(previousHeroSwiper);
        }
        
        // remove previous products section
        const previousProductsSection = document.querySelector('.mySwiper');
        if(previousProductsSection) {
            previousProductsSection.parentNode.removeChild(previousProductsSection);
        }
    
        // remove previous product container
        const previousProductContainer = document.getElementById('product-container');
        if(previousProductContainer) {
            previousProductContainer.parentNode.removeChild(previousProductContainer);
        }
    
    
    }    
}