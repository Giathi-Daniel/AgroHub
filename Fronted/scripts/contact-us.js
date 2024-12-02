//fetch input field from dom
const form = document.getElementById('messageForm');
const client = document.getElementById('name');
const email = document.getElementById('email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');

//add eventlistener to form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  //validate name field
  if (client.value === '' || client.value === null) {
    valid = false;
    showValidation(valid, client, "Name is required");
  } else if (!isNaN(client.value)){
    valid = false;
    showValidation(valid, client, "Name cannot be a number");
  }

  // Validate email input field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    valid = false;
    showValidation(valid, email, "Please enter a valid email address");
  } else {
    showValidation(valid, email);
  }

  //validate subject field
  if (subject.value === '' || subject.value === null) {
    valid = false;
    showValidation(valid, subject, "Subject is required");
  } else if (subject.value.length > 50) {
    valid = false;
    showValidation(valid, subject, "Subject should not exceed 50 characters");
  }
  
  //validate message field
  if (message.value === '' || message.value === null) {
    valid = false;
    showValidation(valid, message, "Message is required");
  } else if (message.value.length > 500) {
    valid = false;
    showValidation(valid, message, "Message should not exceed 500 characters");
  }

  // check validation
  if (!valid) {
    //submit form
    return false;
  } else {
    // send message to server
    sendToServer();
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

async function sendToServer(){
  const data = {
    name: client.value,
    email: email.value,
    subject: subject.value,
    message: message.value
  }

  try {
    const response = await fetch('/agrohub/pub/contact', {
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

function showResponse(success, message){
  const responseDiv = document.getElementById('responseDiv');
  responseDiv.textContent = '';

  if(success){
    // responseDiv.classList.remove('hidden')
    responseDiv.style.display = 'block'
    responseDiv.classList.add('bg-green-500');
    responseDiv.classList.add('text-white-800');
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.style.display = 'none'
      responseDiv.classList.remove('bg-green-500');
      responseDiv.classList.remove('text-white-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
  } else {
    responseDiv.style.display = 'block'
    responseDiv.classList.add('bg-pink-500');
    responseDiv.classList.add('text-red-800')
    responseDiv.textContent = message; //might change
    setTimeout(() => {
      responseDiv.style.display = 'none'
      responseDiv.classList.remove('bg-pink-500');
      responseDiv.classList.remove('text-red-800');
      responseDiv.textContent = ''; //clear message after 5 secs
    }, 5000) //timout for 5secs
  }

}
