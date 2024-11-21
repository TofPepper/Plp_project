// to register for patient
document.getElementById("registrationform").addEventListener("submit", async function (event) {
  event.preventDefault(); 

  // Clear all previous error messages
  document.querySelectorAll('.error').forEach(function(errorElement) {
      errorElement.innerHTML = ''; 
  });

  let valid = true;
  
  // Validate name
  let first_name = document.getElementById('first_name').value;
  if(first_name === ""){
    document.getElementById('firstnameError').innerHTML = 'Error! First Name is required.'
    valid = false;
  }

  let last_name = document.getElementById('last_name').value;
  if(last_name === ""){
    document.getElementById('lastnameError').innerHTML = 'Error! Last Name is required.'
    valid = false;
  }

  // Validate email
  const EmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let email = document.getElementById('email').value;
  if(email === ""){
    document.getElementById('emailError').innerHTML = 'Error! Email is required.'
    valid = false;
  } else if (!EmailPattern.test(email)){
    document.getElementById('emailError').innerHTML = 'Email format should be: user@example.com.'
    valid = false;
  }

  // Validate password
  let password = document.getElementById('password').value;
  if(password === ""){
    document.getElementById('passwordError').innerHTML = 'Error! Password is required.'
    valid = false;
  } else if(password.length < 8){
    document.getElementById('passwordError').innerHTML = 'Error! Password must be at least 8 characters long.'
    valid = false;
  }

  // Validate confirm password
  let confirmPassword = document.getElementById('confirmPassword').value;
  if(confirmPassword === ""){
    document.getElementById('confirmPasswordError').innerHTML = 'Error! It is required'
    valid = false;
  } else if(confirmPassword !== password){
    document.getElementById('confirmPasswordError').innerHTML = 'Incorrect! Password does not match.'
    valid = false;
  }

  // Validate age
  let age = document.getElementById('age').value;
  if(age === ""){
    document.getElementById('ageError').innerHTML = 'Error! Age is required.'
    valid = false;
  } else if(isNaN(age) || age < 18 || age > 100){
    document.getElementById('ageError').innerHTML = 'Error! Age must be a number not less than 18 and not greater than 100.'
    valid = false;
  }

  // Validate gender
  let genderElement = document.querySelector('input[name="gender"]:checked');
  let gender = genderElement ? genderElement.value : null;
  if(!gender){
    document.getElementById('genderError').innerHTML = 'Error! Please select a gender.'
    valid = false;
  }

  // Validate country
  let country = document.getElementById('country').value;
  if(country === ""){
    document.getElementById('countryError').innerHTML = 'Error! Please select a country.'
    valid = false;
  }

  // Validate terms
  let terms = document.getElementById('terms').checked;
  if(!terms){
    document.getElementById('termsError').innerHTML = 'Error! You must agree to the terms and conditions.'
    valid = false;
  }

  // Only proceed to submit if validation passed
  if (valid) {
    const formData = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      age: age,
      gender: gender,  
      country: country,
    };


    try {
      const response = await fetch('/patients/register', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Registration successful!');
        window.location.href = "/patient.html"; 
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  }

  return valid; // Returns true only if validation passes
});
