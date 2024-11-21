// To login for patient
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("loginform");

    // Ensure the form exists before attaching the event listener
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            let valid = true;

            // Clear previous error messages
            document.getElementById('emailError').innerHTML = '';
            document.getElementById('passwordError').innerHTML = '';

            // Form data
            const formData = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
            };

            // Validate email
            const email = document.getElementById('email').value;
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            if (email === "") {
                document.getElementById('emailError').innerHTML = 'Error! Email is required.';
                valid = false;
            } else if (!emailPattern.test(email)) {
                document.getElementById('emailError').innerHTML = 'Error! Invalid email format (e.g., user@example.com).';
                valid = false;
            }

            // Validate password
            const password = document.getElementById('password').value;
            if (password === "") {
                document.getElementById('passwordError').innerHTML = 'Error! Password is required.';
                valid = false;
            } else if (password.length < 8) {
                document.getElementById('passwordError').innerHTML = 'Error! Password must be at least 8 characters long.';
                valid = false;
            }

            // If validation failed, do not proceed to login
            if (!valid) return;

            try {
                // Send the login request
                const response = await fetch('/patients/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    // Successful login
                    alert(result.message || 'Login successful!');
                    window.location.href = "/patient.html";  // Redirect to patient dashboard
                } else {
                    // Failed login
                    alert(result.message || 'Login failed. Please check your credentials and try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.error('Login form not found!');
    }
});
