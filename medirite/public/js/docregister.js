

document.getElementById("registrationform").addEventListener("submit", async function (event) {
    event.preventDefault(); 
  
    // Clear all previous error messages
    document.querySelectorAll('.error').forEach(function(errorElement) {
        errorElement.innerHTML = ''; 
    });
  
    let valid = true;
    
    //validate name
    let Fname = document.getElementById('first_name').value;
    if(Fname === ""){
        document.getElementById('firstnameError').innerHTML = 'Error! First Name is required.'
        valid = false;
    }

    let Lname = document.getElementById('last_name').value;
    if(Lname === ""){
        document.getElementById('lastnameError').innerHTML = 'Error! Last Name is required.'
        valid = false;
    }

    //validate email
    const EmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let email = document.getElementById('email').value;
    if(email === ""){
        document.getElementById('emailError').innerHTML = 'Error! Email is required.'
        valid = false;
    } else if (!EmailPattern.test(email)){
        document.getElementById('emailError').innerHTML = 'Email format should be: user@example.com.'
        valid = false;
    }

    //validate gender
    let gender = document.querySelector('input[name="gender"]:checked');
    if(!gender){
        document.getElementById('genderError').innerHTML = 'Error! Please select a gender.'
        valid = false;
    }

    //validate country
    let country = document.getElementById('country').value;
    if(country === ""){
        document.getElementById('countryError').innerHTML = 'Error! Please select a country.'
        valid = false;
    }

    //validate terms
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
        gender: gender,  
        country: country,
      };
  
  
        try {
            const response = await fetch('/doctors/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (response.ok) {
                alert(result.message || 'Registration successful!');
                window.location.href = "/doctor.html"; 
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