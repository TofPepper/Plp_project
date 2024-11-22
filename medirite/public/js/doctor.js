
// View profile
document.getElementById('viewProfileButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/doctors/view');
        const result = await response.json();

        if (result.success) {
            const profileBox = document.getElementById('profileBox');
            const overlay = document.getElementById('overlay');
            const profileContent = document.getElementById('profileContent');
            
            profileContent.innerHTML = `
            <br><p>First Name: ${result.data.first_name || 'N/A' }</p><br>
            <p>Last Name: ${result.data.last_name || 'N/A'}</p><br>
            <p>Specialisation: ${result.data.specialisation || 'N/A'}</p><br>
            <p>Email: ${result.data.email || 'N/A'}</p><br>
            <p>Phone: ${result.data.phone || 'N/A'}</p><br>
            <p>Days: ${result.data.days || 'N/A'}</p><br>
            <p>End_time: ${result.data.end_time || 'N/A'}<p><br>
            <p>Start_time: ${result.data.start_time || 'N/A'}<p><br>
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

// Selecting all <h3> elements
const headings = document.querySelectorAll('h3');
        
// Loop through each <h3>
headings.forEach((heading) => {
    heading.addEventListener('click', () => {
        // Toggle the display of the next <ul> element
        const nextUl = heading.nextElementSibling;
        if (nextUl.style.display === 'none' || nextUl.style.display === '') {
            nextUl.style.display = 'block';  // Show list if it's hidden
        } else {
            nextUl.style.display = 'none';  // Hide list if it's visible
        }
    });
});

// Initially hide all <ul> elements
document.querySelectorAll('.main-container ul').forEach((ul) => {
    ul.style.display = 'none';
});

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
            <label style="font-weight:bold;">Specialisation: </label>
            <input type="text" id="specialisationInput" placeholder="Enter new specialisation" value="${updateContent.dataset.specialisation || ''}">
            <br><br>
            <label style="font-weight:bold;">Phone: </label>
            <input type="number" id="phoneInput" placeholder="Enter new phone no" value="${updateContent.dataset.phone || ''}">
            <br><br>
            <label style="font-weight:bold;">Days: </label>
            <input type="text" id="dayInput" placeholder="Enter new day" value="${updateContent.dataset.days || ''}">
            <br><br>
            <label style="font-weight:bold;">Start Time: </label>
            <input type="time" id="startInput" placeholder="Enter new start time" value="${updateContent.dataset.start_time || ''}">
            <br><br>
            <label style="font-weight:bold;">End Time: </label>
            <input type="time" id="endInput" placeholder="Enter new end time" value="${updateContent.dataset.end_time || ''}">
            <br><br>
            <button id="submitUpdate" style="font-weight:bold; color:black; background-color:rgb(235, 199, 235); padding:5px 10px;">Update Changes</button>
        `;

        updateContent.dataset.mode = 'edit'; 

        document.getElementById('submitUpdate').addEventListener('click', async () => {
            // Collect the updated profile data
            const profileData = {
                first_name: document.getElementById('firstNameInput').value,
                last_name: document.getElementById('lastNameInput').value,
                specialisation: document.getElementById('specialisationInput').value,
                phone: document.getElementById('phoneInput').value,
                days: document.getElementById('dayInput').value,
                start_time: document.getElementById('startInput').value,
                end_time: document.getElementById('endInput').value
            };

            console.log('Update button clicked. Data to be updated:', profileData);

            try {
                const updateResponse = await fetch('/doctors/update', {
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
                        <p style="font-weight:bold;">Specialisation: ${result.data.specialisation || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Phone: ${result.data.phone || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Days: ${result.data.days || 'N/A'}</p><br>
                        <p style="font-weight:bold;">Start Time: ${result.data.start_time || 'N/A'}</p><br>
                        <p style="font-weight:bold;">End Time: ${result.data.end_time || 'N/A'}</p><br>
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

//log out
document.getElementById('logout').addEventListener('click', async ()  => {
    try {
        const response = await fetch('/doctors/logout', {
            method: 'post',
            credentials: 'include'
        })

        const result = await response.json()

        if (result.success){
            window.location.href = '/'
            
        } else {
            alert("Failed to log out. Please try again.")
        }
    } catch (error){
        console.error('Error logging out:', error);
    } 
})

//delete account
document.getElementById('deleteAccount').addEventListener('click', async () =>{
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!'))
    try{
        const response = await fetch('/doctors/delete', {
            method: 'delete',
            credentials: 'include'
        });

        const result = await response.json()

        if (result.success){
            alert('Account deleted successfully! Click "OK" to continue')
            window.location.href = '/'
        } else {
            alert('Unable to delete account! Try again later')
        }
    } catch (error) {
        console.error("Error deleting account:", error )
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

document.getElementById('viewAppointment').addEventListener('click', async () => {
    try {
        const response = await fetch('appointments/viewDoc');
        const result = await response.json();

        if (result.success) {
            const box = document.getElementById('appointmentBox');
            const overlay = document.getElementById('overlay');
            const content = document.getElementById('appointmentContent');
            
            // Clear previous content
            content.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Patient__Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.data.map(appointment => `
                            <tr>
                                <td>${appointment.patient_first_name} ${appointment.patient_last_name}</td>
                                <td>${new Date(appointment.appointment_date).toLocaleDateString()}</td>
                                <td>${appointment.appointment_time}</td>
                                <td>${appointment.appointment_status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            box.style.display = 'block';
            overlay.style.display = 'block';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error fetching appointments', error);
    }
});

// Close the profile box and overlay
document.getElementById('close').addEventListener('click', () => {
    document.getElementById('appointmentBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Close the profile box if the user clicks on the overlay
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('appointmentBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});