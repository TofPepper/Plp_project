document.addEventListener('DOMContentLoaded', async () => {
    // Find the doctor dropdown element
    const doctorSelect = document.getElementById('doctor');
    if (!doctorSelect) {
        console.error("Doctor dropdown element not found.");
        return;
    }

    try {
        const response = await fetch('/admin/doctors');
        const responseData = await response.json();
        
        // Access the array within responseData
        const doctors = responseData.data;

        // Check if doctors is an array
        if (Array.isArray(doctors)) {
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.doctor_id;
                option.textContent = `${doctor.first_name} ${doctor.last_name} - Specialization: ${doctor.specialisation || 'Not Specified'}`;
                option.setAttribute("data-specialisation", doctor.specialisation);
                option.setAttribute("data-name", `${doctor.first_name} ${doctor.last_name}`);
                doctorSelect.appendChild(option);
            });
        } else {
            console.error("Expected an array but received:", doctors);
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
});



// Handle form submission
document.getElementById('bookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear previous error messages
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('contactError').innerHTML = '';
    document.getElementById('dateError').innerHTML = '';
    document.getElementById('timeError').innerHTML = '';
    document.getElementById('termsError').innerHTML = '';

    // Capture form data
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const appointment_date = document.getElementById('date').value;
    const appointment_time = document.getElementById('time').value;
    const terms = document.getElementById('terms').checked;
    const doctorSelect = document.getElementById('doctor');

    const selectedDoctorId = doctorSelect.value;
    const selectedDoctorName = doctorSelect.options[doctorSelect.selectedIndex].getAttribute("data-name");
    const selectedDoctorSpecialisation = doctorSelect.options[doctorSelect.selectedIndex].getAttribute("data-specialisation");

    let isValid = validateForm(email, contact, appointment_date, appointment_time, terms);

    // Only proceed if the form is valid
    if (isValid) {
        const appointmentData = {
            doctor_id: selectedDoctorId,
            email,
            contact,
            appointment_date,
            appointment_time,
            terms,
        };

        try {
            const response = await fetch('/appointments/book', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                alert("Appointment booked successfully!");
                displayFormData({
                    email,
                    contact,
                    appointment_date,
                    appointment_time,
                    terms,
                    doctorName: selectedDoctorName,
                    doctorSpecialisation: selectedDoctorSpecialisation
                });
            } else {
                alert("Failed to book appointment.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    }
});

// Form validation function
function validateForm(email, contact, appointment_date, appointment_time, terms) {
    let valid = true;

    const emailError = document.getElementById('emailError');
    const contactError = document.getElementById('contactError');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    const termsError = document.getElementById('termsError');

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
        emailError.innerHTML = "Error, email address is required!";
        valid = false;
    } else if (!emailPattern.test(email)) {
        emailError.innerHTML = "Please enter a valid email address!";
        valid = false;
    }

    // Contact validation
    if (!contact) {
        contactError.innerHTML = "Please provide a contact method!";
        valid = false;
    }

    // Date validation
    if (!appointment_date) {
        dateError.innerHTML = "Error! Appointment date is required.";
        valid = false;
    }

    // Time validation
    if (!appointment_time) {
        timeError.innerHTML = "Error! Select a time.";
        valid = false;
    }

    // Terms validation
    if (!terms) {
        termsError.innerHTML = "Error! You need to agree to terms and conditions";
        valid = false;
    }

    return valid;
}

// Display form data summary
function displayFormData(formData) {
    const formSummary = document.getElementById('formSummary');
    formSummary.innerHTML = `
        <h3>Appointment Details</h3>
        <p>Email: ${formData.email}</p>
        <p>Contact: ${formData.contact}</p>
        <p>Date of Appointment: ${formData.appointment_date}</p>
        <p>Preferred Time: ${formData.appointment_time}</p>
        <p>Doctor: ${formData.doctorName}</p>
        <p>Specialization: ${formData.doctorSpecialisation}</p>
        <p>Agreed to Terms: ${formData.terms ? "Yes" : "No"}</p>
    `;

    displayConfirmation();
}

// Display confirmation message
function displayConfirmation() {
    const formSummary = document.getElementById('formSummary');
    formSummary.innerHTML += `
        <p>Thank you! Your appointment has been submitted successfully.</p>
        <button id="goBackButton" style="background-color: purple; color: black; padding: 10px;">Go Back</button>
    `;

    // Redirect to patient page
    document.getElementById('goBackButton').addEventListener('click', () => {
        window.location.href = '/patient.html';
    });
}
