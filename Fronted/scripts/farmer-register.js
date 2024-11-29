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
const phone_number = document.getElementById('phoneNumber');
const country = document.getElementById('country');
const state = document.getElementById('state');
const LGA = document.getElementById('LGA');
const address = document.getElementById('address');
const farm_name = document.getElementById('farmName');
const farm_size = document.getElementById('farmSize');

nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let valid = true;

  // Clear all previous errors
  const errorSpans = document.querySelectorAll('.text-red-500');
  errorSpans.forEach(span => span.classList.add('hidden')); // Hide all error spans initially

  // Validate first name input field
  if (first_name.value === '' || first_name.value === null) {
    valid = false;
    showValidation(valid, first_name, "First Name is required");
  } else if (!isNaN(first_name.value)) {
    valid = false;
    showValidation(valid, first_name, "First Name cannot be a number");
  } else {
    showValidation(valid, first_name);
  }

  // Validate last name input field
  if (last_name.value === '' || last_name.value === null) {
    valid = false;
    showValidation(valid, last_name, "Last Name is required");
  } else if (!isNaN(last_name.value)) {
    valid = false;
    showValidation(valid, last_name, "Last Name cannot be a number");
  } else {
    showValidation(valid, last_name);
  }

  // Validate email input field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    valid = false;
    showValidation(valid, email, "Please enter a valid email address");
  } else {
    showValidation(valid, email);
  }

  // Validate password input field
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password.value)) {
    valid = false;
    showValidation(valid, password, "Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character.");
  } else {
    showValidation(valid, password);
  }

  // If all fields are valid, proceed to section 2
  if (valid) {
    document.getElementById('section1').classList.add("hidden"); // Hide section 1
    document.getElementById('section2').classList.remove("hidden"); // Show section 2
  }
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  //validate phone number input field
  if (phone_number.value === ''|| phone_number.value === null){
    valid = false
    showValidation(valid, password, "Phone number is required")
  }else if (isNaN(phone_number.value)){
    valid = false
    showValidation(valid, phone_number, "Phone number cannot be text")
  }

  //validate country input field
  if (country.value === ''|| country.value === null){
    valid = false
    showValidation(valid, country, "Country is required")
  }else if (!isNaN(country.value)){
    valid = false
    showValidation(valid, country, "Country cannot be number")
  }

  //validate state input field
  if (state.value === ''|| state.value === null){
    valid = false
    showValidation(valid, state, "State/County is required")
  }else if (!isNaN(state.value)){
    valid = false
    showValidation(valid, state, "State/County cannot be number")
  }

  //validate LGA input field
  if (LGA.value === ''|| LGA.value === null){
    valid = false
    showValidation(valid, LGA, "LGA/District is required")
  }else if (!isNaN(LGA.value)){
    valid = false
    showValidation(valid, LGA, "LGA/District cannot be number")
  }

  //validate address input field
  if (address.value === ''|| address.value === null){
    valid = false
    showValidation(valid, address, "Address is required")
  }

  //validate farm_name input field
  if (farm_name.value === ''|| farm_name.value === null){
    valid = false
    showValidation(valid, farm_name, "Farm name is required")
  }

  //validate farm_size input field
  if (farm_size.value === ''|| farm_size.value === null){
    valid = false
    showValidation(valid, farm_size, "Farm size is required")
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
function showValidation(valid, inputField, message) {
  const errorSpan = document.getElementById(inputField.id + 'Error');
  
  if (valid) {
    inputField.style.borderColor = "lightgreen"
    errorSpan.classList.add('hidden'); // Hide error if valid
  } else {
    errorSpan.classList.remove('hidden'); // Show error if invalid
    inputField.style.borderColor = 'red'
    errorSpan.textContent = message; // Update error message
  }
}

//function to register farmer
async function registerFarmer() {
  const data = {
    first_name: first_name.value,
    last_name: last_name.value,
    farm_name: farm_name.value,
    farm_size: farm_size.value,
    email: email.value,
    password: password.value,
    phone_number: phone_number.value,
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
  const responseDiv = document.getElementById('responseDiv');
  responseDiv.innerHTML = '';

  if(success){
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