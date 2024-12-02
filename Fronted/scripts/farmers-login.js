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
    showValidation(valid, email, "Email is required")
  } else {
    showValidation(valid, email)
  }

  //validate password input field
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password.value)){
    valid = false
    showValidation(valid, password, "Password must be 6 or more characters long with at least a number, a capital letter and a special character")
  } else {
    showValidation(valid, password)
  }

  //check validation
  if (!valid) {
    //submit form
    return false
  } else {
    loginFarmer()
  }
})

//function to change input field color on validation
function showValidation(valid, field, message){
  const spanError = document.getElementById(field.id + "Error")
  if(valid){
    field.style.borderColor = 'lightgreen'
    spanError.classList.add('hidden')
  } else {
    field.style.borderColor = 'red'
    spanError.classList.remove('hidden')
    spanError.textContent = message
  }
}

//function to register buyer
async function loginFarmer() {
  const data = {
    email: email.value,
    password: password.value,
  }

  try {
    const response = await fetch('/agrohub/api/farmer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    //show response message
    showResponse(result.success, result.message)
  
  } catch(error){
    console.log(error)
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
      responseDiv.style.display = 'block';
      responseDiv.classList.remove('bg-green-500');
      responseDiv.classList.remove('text-white-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5 secs
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