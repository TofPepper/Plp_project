


// To display list of patients and fetch the crud file
document.addEventListener('DOMContentLoaded', () => {
    const patientList = document.getElementById('patientList'); 
    const searchInput = document.getElementById('searchInput'); 
    const searchContainer = document.getElementById('search-container');
    const listPatientsBtn = document.getElementById('patient-List'); 

    // Flag to track if the patient list is visible
    let isListVisible = false;

    // Function to fetch patients and display them
    const fetchPatients = async () => {
        try {
            const response = await fetch('/admin/patients');
            const data = await response.json();

            if (data.success) {
                // Clear existing list
                patientList.innerHTML = '';
                
                data.data.forEach(patient => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${patient.first_name} ${patient.last_name} - Phone No: ${patient.phone || 'N/A'}`;
                    patientList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Show search and patient list when "List of Patients" is clicked
    listPatientsBtn.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent default link behavior

        // Toggle the visibility of the search input and patient list
        if (!isListVisible) {
            searchInput.style.display = 'block';  // Show search input
            searchContainer.style.display = 'block'; //show search container
            patientList.style.display = 'block';  // Show patient list
            fetchPatients();  
        } else {
            searchInput.style.display = 'none'; 
            searchContainer.style.display = 'none'; 
            patientList.style.display = 'none';  
        }
        
        // Toggle the visibility flag
        isListVisible = !isListVisible;

    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const patients = document.querySelectorAll('#patientList li');
        
        patients.forEach(patient => {
            if (patient.textContent.toLowerCase().includes(searchTerm)) {
                patient.style.display = '';
            } else {
                patient.style.display = 'none';
            }
        });
    });
});


// Add Doctor 
document.getElementById("addDoctor").addEventListener('click', () => {
    const profileBox = document.getElementById('profileBox');
    const overlay = document.getElementById('overlay');
    const addedDoctor = document.getElementById('addedDoctor');

    // Display the form and overlay
    profileBox.style.display = 'block';
    overlay.style.display = 'block';

    // Add the doctor form
    addedDoctor.innerHTML = `
        <br><h3 style="color:purple;">Fill out this field to add doctor</h3><br>
        <label style="font-weight:bold;">First Name: </label>
        <input type="text" id="firstNameInput" placeholder="Enter doctor's first name"><br><br>
        <label style="font-weight:bold;">Last Name: </label>
        <input type="text" id="lastNameInput" placeholder="Enter doctor's last name"><br><br>
        <label style="font-weight:bold;">Email: </label>
        <input type="email" id="emailInput" placeholder="Enter doctor's email"><br><br>
        <label style="font-weight:bold;">Specialisation: </label>
        <input type="text" id="specialisationInput" placeholder="Enter doctor's specialisation"><br><br>
        <label style="font-weight:bold;">Phone: </label>
        <input type="number" id="phoneInput" placeholder="Enter doctor's phone no"><br><br>
        <label style="font-weight:bold;">Days: </label>
        <input type="text" id="dayInput" placeholder="Enter doctor's day"><br><br>
        <label style="font-weight:bold;">Start Time: </label>
        <input type="time" id="startInput" placeholder="Enter doctor's start time"><br><br>
        <label style="font-weight:bold;">End Time: </label>
        <input type="time" id="endInput" placeholder="Enter doctor's end time"><br><br>
        <button id="submitUpdate" style="font-weight:bold; color:black; background-color:rgb(235, 199, 235); padding:5px 10px;">Confirm</button>
    `;

    // Add event listener to submit the form
    document.getElementById('submitUpdate').addEventListener('click', async () => {
        const profileData = {
            first_name: document.getElementById('firstNameInput').value,
            last_name: document.getElementById('lastNameInput').value,
            email: document.getElementById('emailInput').value,
            specialisation: document.getElementById('specialisationInput').value,
            phone: document.getElementById('phoneInput').value,
            days: document.getElementById('dayInput').value,
            start_time: document.getElementById('startInput').value,
            end_time: document.getElementById('endInput').value
        };

        try {
            const addResponse = await fetch('/doctors/add', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const result = await addResponse.json();
            console.log('Server response:', result);

            if (result.success) {
                alert('Doctor added successfully!');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    });
});

// Close profile box and overlay
document.getElementById('closeProfile').addEventListener('click', () => {
    document.getElementById('profileBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Close profile box when the overlay is clicked
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('profileBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

//to edit a doctor profile data
document.addEventListener('DOMContentLoaded', () => {
    const editDoctorButton = document.getElementById('editDoctor');
    const editDoctorBox = document.getElementById('editDoctorBox');
    const editDoctorOverlay = document.getElementById('editDoctorOverlay');
    const closeEditDoctor = document.getElementById('closeEditDoctor');
    const fetchDoctorButton = document.getElementById('fetchDoctor');
    const doctorDetails = document.getElementById('doctorDetails');
    const doctorInfo = document.getElementById('doctorInfo');
    const editDoctorForm = document.getElementById('editDoctorForm');

    // Show the edit doctor box when the "Edit a Doctor's Profile" is clicked
    editDoctorButton.addEventListener('click', () => {
        editDoctorBox.style.display = 'block';
        editDoctorOverlay.style.display = 'block';
    });

    // Close the edit doctor box
    closeEditDoctor.addEventListener('click', () => {
        editDoctorBox.style.display = 'none';
        editDoctorOverlay.style.display = 'none';
    });

    // Fetch doctor's details based on the entered email
    fetchDoctorButton.addEventListener('click', async () => {
        const email = document.getElementById('doctorEmail').value;

        try {
            const response = await fetch('/admin/doctor', {
                method: 'post',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });
            const data = await response.json();

            if (data.success) {
                // Populate the doctor's details
                doctorDetails.style.display = 'block';
                doctorInfo.textContent = `Name: ${data.doctorData.first_name} ${data.doctorData.last_name}, Specialisation: ${data.doctorData.specialisation}, Email: ${data.doctorData.email}, Phone Number: ${data.doctorData.phone}, Days: ${data.doctorData.days}, Start Time: ${data.doctorData.start_time}, End Time: ${data.doctorData.end_time}`;

                // Fill form inputs with current values
                document.getElementById('firstName').value = data.doctorData.first_name;
                document.getElementById('lastName').value = data.doctorData.last_name;
                document.getElementById('specialisation').value = data.doctorData.specialisation;
                document.getElementById('phone').value = data.doctorData.phone;
                document.getElementById('days').value = data.doctorData.days;
                document.getElementById('start_time').value = data.doctorData.start_time;
                document.getElementById('end_time').value = data.doctorData.end_time;
            } else {
                alert('Doctor not found');
            }
        } catch (error) {
            console.error('Error fetching doctor:', error);
        }
    });

    // Submit form to update doctor's details
    editDoctorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedDoctor = {
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            specialisation: document.getElementById('specialisation').value,
            phone: document.getElementById('phone').value,
            days: document.getElementById('days').value,
            start_time: document.getElementById('start_time').value,
            end_time: document.getElementById('end_time').value,
        };

        const email = encodeURIComponent(document.getElementById('doctorEmail').value);

        try {
            const response = await fetch(`/admin/doctor/${email}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDoctor),
            });

            const result = await response.json();
            console.log('Server response:', result);

            if (result.success) {
                alert('Doctor profile updated successfully');
            } else {
                alert('Failed to update doctor profile');
            }
        } catch (error) {
            console.error('Error updating doctor profile:', error);
        }
    });
});

// Fetch the doctor by email for deletion
document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('initiateDelete')
    const deleteDoctorBox = document.getElementById('deleteDoctorBox')
    const deleteDoctorOverlay = document.getElementById('deleteDoctorOverlay')
    const confirmDelete = document.getElementById('confirmDelete')
    const cancelDelete = document.getElementById('cancelDelete')
    const fetchDeleteButton = document.getElementById('fetchDoctorForDelete')
    const confirmDeleteSection = document.getElementById('confirmDeleteSection')
    const deleteDoctorInfo = document.getElementById('deleteDoctorInfo')
    const closeDeleteDoctor = document.getElementById('closeDeleteDoctor');

    deleteButton.addEventListener('click', () => {
        deleteDoctorBox.style.display = 'block';
        deleteDoctorOverlay.style.display = 'block';
    })

    // Close the edit doctor box
    closeDeleteDoctor.addEventListener('click', () => {
        deleteDoctorBox.style.display = 'none';
        deleteDoctorOverlay.style.display = 'none';
    });

    fetchDeleteButton.addEventListener('click', async () => {
        const email = document.getElementById('deleteDoctorEmail').value

        try {
            const response = await fetch('/admin/doctor', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})

            })
            const data = await response.json()

            if (data.success) {
                confirmDeleteSection.style.display = 'block';
                deleteDoctorInfo.textContent = `Name: ${data.doctorData.first_name} ${data.doctorData.last_name}, Specialisation: ${data.doctorData.specialisation}, Email: ${data.doctorData.email}, Phone Number: ${data.doctorData.phone}, Days: ${data.doctorData.days}, Start Time: ${data.doctorData.start_time}, End Time: ${data.doctorData.end_time}`;

            } else {
                alert("Doctor not found") 
            }
        } catch (error) {
            console.error('Error fetching the doctor details', error);
            alert("Error fetching doctor details.")
        }
    })

    confirmDelete.addEventListener('click', async () => {
        const email = document.getElementById('deleteDoctorEmail').value;
        if (confirm('Are you sure you want to delete your account? This action cannot be undone!'))

        try {
            const response = await fetch(`/admin/delete/${email}`,
                {method: 'delete', credentials: 'include'}
            )
            const data = await response.json();

            if (data.success) {
                alert('Doctor account deleted successfully!')
                deleteDoctorEmail.value ='';
                confirmDeleteSection.style.display = 'none'
            } else {
                alert('Failed to delete doctor.')
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Error deleting doctor.');
        }
    });

    cancelDelete.addEventListener('click', () => {
        confirmDeleteSection.style.display = 'none';
    });
});

// To display list of doctors and fetch the crud file
document.addEventListener('DOMContentLoaded', () => {
    const doctorList = document.getElementById('doctorList'); 
    const searchDocInput = document.getElementById('searchDocInput'); 
    const searchDocContainer = document.getElementById('search-doc-container');
    const listDoctorsBtn = document.getElementById('doctor-List'); 

    // Flag to track if the patient list is visible
    let isListVisible = false;

    // Function to fetch patients and display them
    const fetchDoctors = async () => {
        try {
            const response = await fetch('/admin/doctors');
            const data = await response.json();

            if (data.success) {
                // Clear existing list
                doctorList.innerHTML = '';
                
                data.data.forEach(doctor => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${doctor.first_name} ${doctor.last_name} - Specialisation: ${doctor.specialisation || 'N/A'}`;
                    doctorList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    // Show search and patient list when "List of Doctors" is clicked
    listDoctorsBtn.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent default link behavior

        // Toggle the visibility of the search input and doctor list
        if (!isListVisible) {
            searchDocInput.style.display = 'block';  // Show search input
            searchDocContainer.style.display = 'block'; //show search container
            doctorList.style.display = 'block';  // Show doctor list
            fetchDoctors();  
        } else {
            searchDocInput.style.display = 'none'; 
            searchDocContainer.style.display = 'none'; 
            doctorList.style.display = 'none';  
        }
        
        // Toggle the visibility flag
        isListVisible = !isListVisible;

    });

    // Search functionality
    searchDocInput.addEventListener('input', () => {
        const searchTerm = searchDocInput.value.toLowerCase();
        const doctors = document.querySelectorAll('#doctorList li');
        
        doctors.forEach(doctor => {
            if (doctor.textContent.toLowerCase().includes(searchTerm)) {
                doctor.style.display = '';
            } else {
                doctor.style.display = 'none';
            }
        });
    });
});

document.getElementById('viewAppointments').addEventListener('click', async () => {
    try {
        const response = await fetch('appointments/viewAll');
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
                            <th>Doctor's__Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.data.map(appointment => `
                            <tr>
                                <td>${appointment.patient_first_name} ${appointment.patient_last_name}</td>
                                <th>${appointment.doctor_first_name} ${appointment.doctor_last_name}</td>
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
document.getElementById('closeView').addEventListener('click', () => {
    document.getElementById('appointmentBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Close the profile box if the user clicks on the overlay
document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('appointmentBox').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});




