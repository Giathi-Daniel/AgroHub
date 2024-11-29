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
    showValidation(valid, email)
  } else {
    showValidation(valid, email)
  }

  //validate password input field
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password.value)){
    valid = false
    showValidation(valid, password)
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
function showValidation(valid, field){
  if(valid){
    field.style.backgroundColor = 'lightgreen'
  } else {
    field.style.backgroundColor = 'pink'
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
    confirm.error(error)
    showResponse(false, error) //show error message in case of failure
  }
  
}

//function to show response message
function showResponse(success, message){
  // const responseDiv = document.getElementById('response');
  // responseDiv.innerHTML = '';

  if(success){
    // responseDiv.style.backgroundColor = 'lightgreen'
    // responseDiv.style.color = 'green'
    // responseDiv.textContent = message; //might change
    // setTimeout(() => {
    //   responseDiv.style.display = 'none'
    // }, 5000) //timout for 5secs
    alert(message)
    //redirect to main page
    // window.location.href = '/'
  } else {
    alert(message)
    // responseDiv.style.backgroundColor = 'pink'
    // responseDiv.style.color = 'red'
    // responseDiv.textContent = message; //might change
    // setTimeout(() => {
    //   responseDiv.style.display = 'none'
    // }, 5000) //timout for 5secs
  }

}