

// Update Profile
document.getElementById("updateProfile").addEventListener('click', () => {
    const updateContent = document.getElementById('updateContent');

    // Toggle between view mode and edit mode
    if (!updateContent.dataset.mode || updateContent.dataset.mode === 'view') {
        // Switch to edit mode and show the form with prefilled values
        updateContent.innerHTML = `
            <br><h3 style="color:purple;">Edit Profile</h3><br>
            <label style="font-weight:bold;">First Name: </label>
            <input type="text" id="firstNameInput" placeholder="Enter new first name" value="${updateContent.dataset.first_name || ''}">
            <br><br>
            <label style="font-weight:bold;">Last Name: </label>
            <input type="text" id="lastNameInput" placeholder="Enter new last name" value="${updateContent.dataset.last_name || ''}">
            <br><br>
            <label style="font-weight:bold;">Phone: </label>
            <input type="text" id="phoneInput" placeholder="Enter new phone no" value="${updateContent.dataset.phone || ''}">
            <br><br>
            <label style="font-weight:bold;">Date of Birth: </label>
            <input type="date" id="dobInput" value="${updateContent.dataset.date_of_birth || ''}">
            <br><br>
            <label style="font-weight:bold;">Gender: </label>
            <input type="text" id="genderInput" placeholder="Enter new gender" value="${updateContent.dataset.gender || ''}">
            <br><br>
            <label style="font-weight:bold;">Address: </label>
            <input type="text" id="addressInput" placeholder="Enter new address" value="${updateContent.dataset.address || ''}">
            <br><br>
            <button id="submitUpdate" style="font-weight:bold; color:black; background-color:rgb(235, 199, 235); padding:5px 10px;">Update Changes</button>
        `;

        updateContent.dataset.mode = 'edit'; 

        document.getElementById('submitUpdate').addEventListener('click', async () => {
            // Collect the updated profile data
            const profileData = {
                first_name: document.getElementById('firstNameInput').value,
                last_name: document.getElementById('lastNameInput').value,
                phone: document.getElementById('phoneInput').value,
                date_of_birth: document.getElementById('dobInput').value,
                gender: document.getElementById('genderInput').value,
                address: document.getElementById('addressInput').value
            };

            console.log('Update button clicked. Data to be updated:', profileData);

            try {
                const updateResponse = await fetch('/patients/update', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(profileData)
                });

                const result = await updateResponse.json();

                console.log('Server response:', result);
                if (result.success) {
                    alert('Profile updated successfully!');
                    updateContent.dataset.mode = 'view';

                    // Update the displayed profile info
                    updateContent.innerHTML = `
                        <br><br><h3 style="color:purple;"> Updated Profile</h3>
                        <p style="font-weight:bold;">First Name: ${result.data.first_name || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Last Name: ${result.data.last_name || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Phone: ${result.data.phone || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Date of Birth: ${new Date(result.data.date_of_birth).toLocaleDateString() || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Gender: ${result.data.gender || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Address: ${result.data.address || 'N/A'}</p><br>
                    `;
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    }
});



// view profile
document.getElementById('viewProfileButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/patients/Vprofile');
        const result = await response.json();

        if (result.success) {
        // Assuming you have an HTML element to display the profile
            const profileBox = document.getElementById('profileBox');
            const overlay = document.getElementById('overlay');
            const profileContent = document.getElementById('profileContent');

            profileContent.innerHTML = `
            <p>First Name: ${result.data.first_name || 'N/A' }</p>
            <p>Last Name: ${result.data.last_name || 'N/A'}</p>
            <p>Email: ${result.data.email || 'N/A'}</p>
            <p>Phone: ${result.data.phone || 'N/A'}</p>
            <p>Date of birth: ${new Date(result.data.date_of_birth).toLocaleDateString() || 'N/A'}</p>
            <p>Gender: ${result.data.gender || 'N/A'}</p>
            <p>Country: ${result.data.country || 'N/A'}</p>
            `;

            // Display the profile box and overlay
            profileBox.style.display = 'block';
            overlay.style.display = 'block';

        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});

// Close the profile box and overlay
document.getElementById('closeProfile').addEventListener('click', () => {
    document.getElementById('profileBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Close the profile box if the user clicks on the overlay
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('profileBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// log out
document.getElementById('logout').addEventListener('click', async ()  => {
    try {
        const response = await fetch('/patients/logout', {
            method: 'post',
            credentials: 'include'
        })

        const result = await response.json()

        if (result.success){
            window.location.href = '/indexp.html'
            
        } else {
            alert("Failed to log out. Please try again.")
        }
    } catch (error){
        console.error('Error logging out :', error);
    } 
})


//delete account
document.getElementById('deleteAccount').addEventListener('click', async () =>{
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!'))
    try{
        const response = await fetch('/patients/delete', {
            method: 'delete',
            credentials: 'include'
        });

        const result = await response.json()

        if (result.success){
            alert('Account deleted successfully! Click "OK" to continue')
            window.location.href = '/indexp.html'
        } else {
            alert('Unable to delete account! Try again later')
        }
    } catch (error) {
        console.error("Error deleting account:", error )
    }
});

//To view all doctors
document.addEventListener('DOMContentLoaded', () => {
    const doctorList = document.getElementById('doctorList'); 
    const doctorBox = document.getElementById('doctorBox');
    const doctorOverlay = document.getElementById('doctorOverlay');
    const closeDoctorList = document.getElementById('closeDoctorList');
    const listDoctorsBtn = document.getElementById('doctor-List'); 

    // Function to fetch doctors and display them
    const fetchDoctors = async () => {
        try {
            const response = await fetch('/admin/doctors');
            const data = await response.json();

            if (data.success) {
                doctorList.innerHTML = ''; // Clear previous list

                data.data.forEach(doctor => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${doctor.first_name} ${doctor.last_name} - Specialisation: ${doctor.specialisation || 'N/A'} - Available Day(s): ${doctor.days || 'N/A'}`;
                    doctorList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    // Show the list and blur background
    listDoctorsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        fetchDoctors();
        doctorBox.style.display = 'block';
        doctorOverlay.style.display = 'block';
    });

    // Close the list and remove blur
    closeDoctorList.addEventListener('click', () => {
        doctorBox.style.display = 'none';
        doctorOverlay.style.display = 'none';
    });
});

//To view upcoming assignments
document.addEventListener('DOMContentLoaded', () => {
    const upAppButton = document.getElementById('upApp');
    const appointmentsModal = document.getElementById('appointments-modal');
    const appointmentsList = document.getElementById('appointments-list');
    const upAppointmentContent = document.getElementById('updatedAppointmentContent');
    const closeModal = document.querySelector('.close');

    // Function to open the modal
    function openModal() {
        appointmentsModal.style.display = 'flex';
    }

    // Function to close the modal
    closeModal.onclick = function () {
        appointmentsModal.style.display = 'none';
    }

    // Close the modal if clicking outside of the modal-content
    window.onclick = function (event) {
        if (event.target === appointmentsModal) {
            appointmentsModal.style.display = 'none';
        }
    }

    

    // Event listener for fetching appointments when the button is clicked
    upAppButton.addEventListener('click', async () => {

        // Fetch and display upcoming appointments in the modal
        try {
            const response = await fetch('/appointments/upcoming');
            const result = await response.json();

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                // Clear any previous appointments displayed
                appointmentsList.innerHTML = '';
            
                // Iterate over each appointment and display its details
                result.data.forEach(appointment => {
                    const appointmentElement = document.createElement('div');
                    appointmentElement.classList.add('appointment');
            
                    appointmentElement.innerHTML = `
                        <p>Date: ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
                        <p>Time: ${appointment.appointment_time}</p>
                        <p>Doctor: Dr. ${appointment.first_name} ${appointment.last_name}</p>
                        <p>Specialisation: ${appointment.specialisation}</p>
                        <button class="reschedule-btn" data-appointment-id="${appointment.appointment_id}" style="background-color: purple; color: black; padding: 10px;">Reschedule</button>
                        <button class="cancel-btn" data-appointment-id="${appointment.appointment_id}" style="background-color: purple; color: black; padding: 10px;">Cancel Appointment</button>
                    `;
            
                    appointmentsList.appendChild(appointmentElement);
                });

                // Add event listener for reschedule buttons
                document.querySelectorAll('.reschedule-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const appointmentId = event.target.getAttribute('data-appointment-id');
                        showRescheduleForm(appointmentId);
                    });
                });

                // Add event listener for cancel buttons
                document.querySelectorAll('.cancel-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const appointmentId = event.target.getAttribute('data-appointment-id');
                        cancelAppointment(appointmentId);
                    });
                });

                openModal()
            } else {
                appointmentsList.innerHTML = '<p>No upcoming appointments.</p>';
            }
            

            openModal();  // Show the modal with appointments
        } catch (error) {
            console.error('Error fetching appointments:', error);
            appointmentsList.innerHTML = '<p>Error fetching appointments.</p>';
            openModal();
        }
    });

    // Function to show reschedule form
    function showRescheduleForm(appointmentId) {
        upAppointmentContent.innerHTML = `
            <br><br><h3>Change Time and Date</h3>
            <label>Appointment Time:</label>
            <input type="time" id="newTime">
            <label>Appointment Date:</label>
            <input type="date" id="newDate">
            <br><button id="submitUpdate" style="background-color: purple; color: black; padding: 7px;">Update Changes</button>
        `;
        upAppointmentContent.style.display = 'block'; 

        document.getElementById('submitUpdate').addEventListener('click', async () => {
            const newTime = document.getElementById('newTime').value;
            const newDate = document.getElementById('newDate').value;

            const profileData = { appointmentId, newTime, newDate };

            try {
                const updateResponse = await fetch("/appointments/update", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                });

                const result = await updateResponse.json();
                if (result.success) {
                    alert('Appointment rescheduled successfully!');
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error updating appointment:', error);
            }
        });
    }

    // Function to cancel an appointment
    function cancelAppointment(appointmentId) {
        // Show confirmation dialog to the patient
        const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
    
        if (confirmCancel) {
            // Proceed with cancellation if confirmed
            fetch('/appointments/cancel', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointmentId })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Appointment canceled successfully.');
                    // Optionally refresh the appointments list here to reflect the cancellation
                } else {
                    alert('Failed to cancel appointment: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error canceling appointment:', error);
                alert('An error occurred while canceling the appointment.');
            });
        }
    }


});


//To view appoinment history
document.addEventListener('DOMContentLoaded', () => {
    const appointmentHistoryButton = document.getElementById('history'); // Your button ID
    const appointmentHistoryModal = document.getElementById('appointmentHistoryModal');
    const closeModal = document.querySelector('.close');
    const appointmentsTableBody = document.getElementById('appointmentsTable').querySelector('tbody');

    // Function to open the modal
    function openModal() {
        console.log("Opening modal...");
        appointmentHistoryModal.style.display = 'flex';
    }

    // Function to close the modal
    closeModal.onclick = function () {
        appointmentHistoryModal.style.display = 'none';
    }

    // Close the modal if clicking outside the modal-content
    window.onclick = function (event) {
        if (event.target === appointmentHistoryModal) {
            appointmentHistoryModal.style.display = 'none';
        }
    }

    // Fetch and display appointment history
    appointmentHistoryButton.addEventListener('click', async () => {
        console.log("Appointment history button clicked...");
        try {
            const response = await fetch('/appointments/history');
            const result = await response.json();
            console.log("Data fetched from server:", result)

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                // Clear any existing table rows
                appointmentsTableBody.innerHTML = '';

                // Populate the table with appointment data
                result.data.forEach(appointment => {
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${new Date(appointment.appointment_date).toLocaleDateString()}</td>
                        <td>${appointment.appointment_time}</td>
                        <td>Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}</td>
                        <td>${appointment.specialisation || 'General Medicine'}</td>
                        <td>${appointment.appointment_status}</td>
                    `;

                    appointmentsTableBody.appendChild(row);
                });

                openModal();
            } else {
                appointmentsTableBody.innerHTML = '<tr><td colspan="5">No appointment history available.</td></tr>';
                openModal();
            }
        } catch (error) {
            console.error('Error fetching appointment history:', error);
            appointmentsTableBody.innerHTML = '<tr><td colspan="5">Error fetching appointment history.</td></tr>';
            openModal();
        }
    });
});


//to login for patient
document.getElementById("loginform").addEventListener("submit", async function (event) {
    event.preventDefault(); 
      
    let valid = true;
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    
    document.getElementById('emailError'). innerHTML = ''
    document.getElementById('passwordError'). innerHTML = ''
  
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
      
    //validate password
    let password = document.getElementById('password').value;
    if(password === ""){
      document.getElementById('passwordError').innerHTML = 'Error! Password is required.'
      valid = false;
    } else if(password.length < 8){
      document.getElementById('passwordError').innerHTML = 'Error! Password must be at least 8 characters long.'
      valid = false;
    }
    
    try {
      const response = await fetch('/patients/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const result = await response.json();
    
      if (response.ok) {
        alert(result.message || 'Login successful!');
        window.location.href = "/patient.html";
      } else {
        alert(result.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
});

//to register for patient
document.getElementById("registrationform").addEventListener("submit", async function (event) {
    event.preventDefault(); 
      
    let valid = true;
    
    const formData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
      age: document.getElementById("age").value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      country: document.getElementById("country").value,
    };
    
    //clear error messages
    document.getElementById('lastnameError'). innerHTML = ''
    document.getElementById('firstnameError'). innerHTML = ''
    document.getElementById('emailError'). innerHTML = ''
    document.getElementById('passwordError'). innerHTML = ''
    document.getElementById('confirmPasswordError'). innerHTML = ''
    document.getElementById('ageError'). innerHTML = ''
    document.getElementById('genderError'). innerHTML = ''
    document.getElementById('countryError'). innerHTML = ''
    document.getElementById('termsError'). innerHTML = ''
  
    //validate name
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
  
    //validate password
    let password = document.getElementById('password').value;
    if(password === ""){
      document.getElementById('passwordError').innerHTML = 'Error! Password is required.'
      valid = false;
    } else if(password.length < 8){
      document.getElementById('passwordError').innerHTML = 'Error! Password must be at least 8 characters long.'
      valid = false;
    }
  
    //validate confirm password
    let confirmPassword = document.getElementById('confirmPassword').value;
    if(confirmPassword === ""){
      document.getElementById('confirmPasswordError').innerHTML = 'Error! It is required'
      valid = false;
    } else if(confirmPassword !== password){
      document.getElementById('confirmPasswordError').innerHTML = 'Incorrect! Password does not match.'
      valid = false;
    }
  
    //validate age
    let age = document.getElementById('age').value;
    if(age === ""){
      document.getElementById('ageError').innerHTML = 'Error! Age is required.'
      valid = false;
    } else if(isNaN(age) || age < 18 || age > 100){
      document.getElementById('ageError').innerHTML = 'Error! Age must be a number not less than 18 and not greater than 100.'
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
    return valid;
});  







