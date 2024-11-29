//fetch button and section from html
const nextBtn = document.getElementById("nextBtn");
const section1 = document.getElementById("section1");
const section2 = document.getElementById("section2");

//fetch input fields from form
const form = document.getElementById('farmerReg');
const first_name = document.getElementById('fName');
const last_name = document.getElementById('lName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const phone_number = document.getElementById('phone_number');
const country = document.getElementById('country');
const state = document.getElementById('state');
const LGA = document.getElementById('LGA');
const address = document.getElementById('address');

nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let valid = true

  // Validate first name input field
  if (first_name.value === ''||first_name.value === null){
    valid = false
    showValidation(valid, first_name)
  }else if (!isNaN(first_name.value)){
    valid = false
    showValidation(valid, first_name)
  }else {
    showValidation(valid, first_name)
  }

  // Validate last name last name input field
  if (last_name.value === ''||last_name.value === null){
    valid = false
    showValidation(valid, last_name)
  }else if (!isNaN(last_name.value)){
    valid = false
    showValidation(valid, last_name)
  }else {
    showValidation(valid, last_name)
  }

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

  //check validation to move to next page
  if (valid) {
    section1.classList.add("hidden"); // Hide section 1
    section2.classList.remove("hidden"); // Show section 2
  }else {
    return false
  }
  // section1.classList.add("hidden"); // Hide section 1
  // section2.classList.remove("hidden"); // Show section 2
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  //validate phone number input field
  if (phone_number.value === ''|| phone_number.value === null){
    valid = false
    showValidation(valid, password)
  }else if (isNaN(phone_number.value)){
    valid = false
    showValidation(valid, phone_number)
  }

  //validate country input field
  if (country.value === ''|| country.value === null){
    valid = false
    showValidation(valid, country)
  }else if (!isNaN(country.value)){
    valid = false
    showValidation(valid, country)
  }

  //validate state input field
  if (state.value === ''|| state.value === null){
    valid = false
    showValidation(valid, state)
  }else if (!isNaN(state.value)){
    valid = false
    showValidation(valid, state)
  }

  //validate LGA input field
  if (LGA.value === ''|| LGA.value === null){
    valid = false
    showValidation(valid, LGA)
  }else if (!isNaN(LGA.value)){
    valid = false
    showValidation(valid, LGA)
  }

  //validate address input field
  if (address.value === ''|| address.value === null){
    valid = false
    showValidation(valid, address)
  }


  //check validation
  if (!valid) {
    //submit form
    return false
  } else {
    registerFarmer()
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

//function to register farmer
async function registerFarmer() {
  const data = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    password: password.value,
    phone_number: phone_number.value,
    country: country.value,
    state: state.value,
    LGA: LGA.value,
    address: address.value,
  }

  try {
    const response = await fetch('/agrohub/api/farmer/register', {
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
  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = '';

  if(success){
    responseDiv.style.backgroundColor = 'lightgreen'
    responseDiv.style.color = 'green'
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.style.display = 'none'
    }, 5000) //timout for 5secs
  } else {
    responseDiv.style.backgroundColor = 'pink'
    responseDiv.style.color = 'red'
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.style.display = 'none'
    }, 5000) //timout for 5secs
  }

}