//fetching values from input fields
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
    // window.location.href = '/'
    const authBtns = document.getElementById('btns').style.display = "none"
    
  } else {
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
