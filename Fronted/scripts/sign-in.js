i//fetching values from input fields
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

//listen on submit event
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let valid = true

  //validate email input field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)){
    valid = false
    showValidation(valid, email, 'Please enter a valid email e.g john@example.com')
  } else {
    showValidation(valid, email)
  }

  //validate password input field
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password.value)){
    valid = false
    showValidation(valid, password, "Please enter a password with at least 6 characters, one uppercase, one lowercase and one special character!")
  } else {
    showValidation(valid, password)
  }

  //check validation
  if (!valid) {
    //submit form
    return false
  } else {
    loginBuyer()
  }
})

//function to change input field color on validation
function showValidation(valid, field, message){
  const spanError = document.getElementById(field.id + 'Error');
  spanError.textContent = '';
  if(valid){
    field.style.borderColor = 'lightgreen'
    
  } else {
    field.style.borderColor = 'red'
    spanError.classList.remove('hidden')
    spanError.textContent = message; //update error message
  }
}

//function to register buyer
async function loginBuyer() {
  const data = {
    email: email.value,
    password: password.value,
  }

  try {
    const response = await fetch('/agrohub/api/buyer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    console.log(result)
    //show response message
    showResponse(result.success, result.message)
  
  } catch(error){
    console.error(error)
    showResponse(false, error) //show error message in case of failure
  }
  
}


//function to show response message
function showResponse(success, message){
  const responseDiv = document.getElementById('responseDiv');
  responseDiv.textContent = '';

  if(success){
    // responseDiv.classList.remove('hidden')
    responseDiv.style.display = 'block';
    responseDiv.classList.add('bg-green-500');
    responseDiv.classList.add('text-white-800');
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      // responseDiv.classList.add('hidden');
      responseDiv.style.display = 'none';
      responseDiv.classList.remove('bg-green-500');
      responseDiv.classList.remove('text-white-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
    // redirect to main page
    window.location.href = '/'
    const authBtns = document.getElementById('btns').style.display = "none"
    
  } else {
    alert('hello')
    // responseDiv.classList.remove('hidden')
    responseDiv.style.display = 'block';
    responseDiv.classList.add('bg-pink-500');
    responseDiv.classList.add('text-red-800')
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      // responseDiv.classList.add('hidden')
      responseDiv.style.display = 'none';
      responseDiv.classList.remove('bg-pink-500');
      responseDiv.classList.remove('text-red-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
  }

}


// function to update the dom
const isAuthenticated = async () => {
  try {
    // Check authentication status from the server
    const response = await fetch('/agrohub/api/buyer/auth-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result.isAuthenticated; // true/false
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false; // don't authenticate when fail
  }
};

isAuthenticated().then((authStatus) => {
  const authSection = document.getElementById('authSection')
  authSection.innerHTML = ''

  if(authStatus) {
    // add profile icon
    const profileIcon = document.createElement('a')
    profileIcon.href = '/agrohub/api/buyer/profile';
    profileIcon.innerHTML = `<i class="text-xl fa-solid fa-user></i>`
    profileIcon.classList.add (
      'relative',
      'text-orange-500',
      'duration-150',
      'ease-in',
      'hover:text-lg'
    )

    // add Logout button
    const logoutBtn = document.createElement('button')
    logoutBtn.textContent = 'Logout'
    logoutBtn.classList.add(
      'px-3',
      'py-1',
      'bg-red-500',
      'text-white',
      'rounded-lg',
      'hover:bg-orange-600'
    )
    logoutBtn.addEventListener('click', () => {
      fetch('/agrohub/api/buyer/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/agrohub/pub/login'
      })
      .catch((err) => console.error("Logout failed: ", err))
    })

    // Cart Icon
    const cartIcon = document.createElement('a')
    cartIcon.href = '/agrohub/api/req/buyer/cart';
    cartIcon.innerHTML = `
        <i class="text-xl fa-solid fa-cart-shopping"></i>
        <span
          class="bg-orange-400 rounded-full absolute flex items-center justify-center w-5 h-5 text-sm text-white top-[-.6rem] left-3"
          id="cart_msg"
          >
            0
        </span>
    `
    cartIcon.classList.add(
      'relative',
      'text-black',
      'transition',
      'duration-150',
      'ease-in',
      'hover:text-lg'
    )

    authSection.appendChild(profileIcon)
    authSection.appendChild(cartIcon)
    authSection.appendChild(logoutBtn)
  } else {
    // Add Sign In Button
    const loginBtn = document.createElement('a')
    loginBtn.href = '/agrohub/pub/login'
    loginBtn.textContent = 'Login'
    loginBtn.classList.add(
      'px-3',
      'py-1',
      'bg-orange-500',
      'text-white',
      'rounded-lg',
      'hover:bg-orange-600'
    )

    // Add Sign Up Button
    const signUpBtn = document.createElement('a')
    signUpBtn.href = '/agrohub/pub/signup'
    signUpBtn.textContent = 'Sign Up'
    signUpBtn.classList.add(
      'px-3',
      'py-1',
      'bg-orange-500',
      'text-white',
      'rounded-lg',
      'hover:bg-orange-600'
    )

    authSection.appendChild(loginBtn)
    authSection.appendChild(signUpBtn)
  }
})
