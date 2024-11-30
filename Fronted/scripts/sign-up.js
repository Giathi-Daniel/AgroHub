//fetch input fields from form
const form = document.getElementById('signupForm');
const buyerName = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const phone_number = document.getElementById('phone_number');
const country = document.getElementById('country');
const state = document.getElementById('state');
const LGA = document.getElementById('LGA');
const address = document.getElementById('address');

let first_name;
let last_name;

//listen on submit event
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Validate first name input field
  if (buyerName.value === ''||buyerName.value === null){
    valid = false
    showValidation(valid, buyerName, "Name is required e.g John Doe")
  }else if (!isNaN(buyerName.value)){
    valid = false
    showValidation(valid, buyerName, "Name cannot be number")
  }else {
    showValidation(valid, buyerName)
  }

  //trim for whitespace in the name field
  buyerName.value = buyerName.value.trim();

  //seperate first name from last name
  const index = buyerName.value.search(' ');
  if (index < 0){
    valid = false;
    showValidation(valid, buyerName, "Enter name in this format: John Doe")
  }else {
    first_name = buyerName.value.slice(0, index);
    last_name = buyerName.value.slice(index + 1);

    //check if name has only one letter or one character
    if (last_name.length === 1 || !first_name.length === 1){
      valid = false;
      showValidation(valid, buyerName, "Name cannot be one character ")
    }
  }

  //validate phone number input field
  if (phone_number.value === ''|| phone_number.value === null){
    valid = false
    showValidation(valid, phone_number, "Phone number is required")
  }else if (isNaN(phone_number.value)){
    valid = false
    showValidation(valid, phone_number, "Phone cannot be text")
  }

  //validate email input field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)){
    valid = false
    showValidation(valid, email, "Please enter a valid email e.g john@example.com")
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

  //validate country input field
  if (country.value === ''|| country.value === null){
    valid = false
    showValidation(valid, country, "Country is required")
  }else if (!isNaN(country.value)){
    valid = false
    showValidation(valid, country, "Country cannot be number")
  } else {
    showValidation(valid, country)
  }

  //validate state input field
  if (state.value === ''|| state.value === null){
    valid = false
    showValidation(valid, state, "County/State is required")
  }else if (!isNaN(state.value)){
    valid = false
    showValidation(valid, state, "County/State cannot be number")
  }else {
    showValidation(valid, state)
  }

  //validate LGA input field
  if (LGA.value === ''|| LGA.value === null){
    valid = false
    showValidation(valid, LGA, "LGA/District is required")
  }else if (!isNaN(LGA.value)){
    valid = false
    showValidation(valid, LGA, "LGA/District cannot be number")
  }else {
    showValidation(valid, LGA)
  }

  //validate address input field
  if (address.value === ''|| address.value === null){
    valid = false
    showValidation(valid, address, "Address is required")
  }

  //check validation
  if (!valid) {
    //submit form
    return false
  } else {
    registerBuyer()
  }


})

//function to change input field color on validation
function showValidation(valid, field, message){
  const spanError = document.getElementById(field.id + "Error");
  if(valid){
    field.style.borderColor = 'lightgreen'
  } else {
    field.style.borderColor = 'red'
    spanError.classList.remove('hidden')
    spanError.textContent = message; // Update error message
  }
}

//function to register buyer

async function registerBuyer() {
  const data = {
    first_name: first_name,
    last_name: last_name,
    email: email.value,
    password: password.value,
    phone_number: phone_number.value,
    country: country.value,
    state: state.value,
    LGA: LGA.value,
    address: address.value,
  }

  try {
    const response = await fetch('/agrohub/api/buyer/register', {
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
    console.error(error)
    showResponse(false, error) //show error message in case of failure
  }
  
}

//function to show response message

function showResponse(success, message){
  const responseDiv = document.getElementById('responseDiv');
  responseDiv.textContent = ''

  if(success){
    responseDiv.classList.remove('hidden')
    responseDiv.classList.add('bg-green-500');
    responseDiv.classList.add('text-white-800');
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.classList.add('hidden');
      responseDiv.classList.remove('bg-green-500');
      responseDiv.classList.remove('text-white-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
  } else {
    responseDiv.classList.remove('hidden')
    responseDiv.classList.add('bg-pink-500');
    responseDiv.classList.add('text-red-800')
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.classList.add('hidden')
      responseDiv.classList.remove('bg-pink-500');
      responseDiv.classList.remove('text-red-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
  }

}
