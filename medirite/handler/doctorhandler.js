

const doctor = require('../crud/doctorscrud');

exports.registerDoctor = async (req, res) => {
    const { first_name, last_name, email, specialisation, phone, days } = req.body;

    try {
        const existingDocUser = await doctor.findByEmail(email);

        if (existingDocUser.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        await doctor.create({
            first_name,
            last_name,
            email,
            specialisation,
            phone,
            days
        });

        const token = 'generate-jwt-token-here';
        const rows = await doctor.findByEmailForLogin(email) 
        req.session.doctor_id = rows[0].doctor_id; // Save doctor_id in session
        return res.json({ success: true, token, redirectUrl: '/views/doctor.html'}); 
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Failed to register Doctor!' });
    }
};


exports.loginDoctor = async (req, res) => {
    const { email } = req.body;

    try {
        const rows = await doctor.findByEmailForLogin(email);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Doctor not found!' });
        }

        const token = 'generate-jwt-token-here';  
        req.session.doctor_id = rows[0].doctor_id; // Save doctorId in session

        return res.json({ success: true, token, redirectUrl: '/views/doctor.html' }); 
    } catch (error) {  
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Failed to log in!' });
    }
};

exports.logoutDoctor = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out!' });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: "Log out successful!" });
    });
};

exports.viewProfile = async (req, res) => {
    try {
        const doctor_id = req.session.doctor_id;  // Assuming doctorId is stored in session when logged in
        console.log('Doctor ID:', doctor_id);

        const doctorData = await doctor.getDoctorById(doctor_id);
        console.log('Doctor Data:', doctorData);

        if (!doctorData || doctorData.length === 0) {
            return res.status(404).json({ success: false, message: 'Time out. Login again' }); // try to redirect to login page instead
        }

        return res.json({ success: true, data: doctorData[0] });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};


exports.addDoctor = async (req, res) => {
    const { first_name, last_name, email, specialisation, phone, days, start_time, end_time } = req.body;

    try {
        const existingDocUser = await doctor.findByEmail(email);

        if (existingDocUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Doctor already exists.' });
        }
        await doctor.create({
            first_name,
            last_name,
            email,
            specialisation,
            phone,
            days,
            start_time, 
            end_time
        });

        const token = 'generate-jwt-token-here';
        const rows = await doctor.findByEmailForLogin(email) 

        return res.json({ success: true, token, doctor: rows[0]}); 
    } catch (error) {
        console.error('Unable to add Doctor! :', error);
        res.status(500).json({ error: 'Failed to add Doctor!' });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await pool.query(`SELECT * FROM Doctors`);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve doctors!' });
    }
};


exports.updateProfile = async (req, res) => {
    const doctor_id = req.session.doctor_id; 
    const doctorData = req.body; 

    console.log('Doctor data:', doctorData);

    if (!doctorData.first_name || !doctorData.last_name || !doctorData.specialisation || !doctorData.phone || !doctorData.days || !doctorData.start_time || !doctorData.end_time) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const result = await doctor.updateDoctor(doctor_id, doctorData);

        if (result.affectedRows > 0) {
        
            const updatedDoctor = await doctor.getDoctorById(doctor_id);
            res.status(200).json({ success: true, message: 'Doctor profile updated successfully', data: updatedDoctor[0] });
        } else {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).json({ success: false, message: 'Error updating doctor profile', error });
    }
};

exports.deleteDoctor = async (req, res) => {
    const doctor_id = req.session.doctor_id;  

    if (!doctor_id) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No doctor ID found' });
    }

    try {
        const result = await doctor.deleteDoctor(doctor_id);  

        if (result.affectedRows > 0) {
            req.session.destroy();  
            res.status(200).json({ success: true, message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error deleting doctor account:', error);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
};

exports.getDoctorByEmail = async (req, res) => { 
    try {
        const email = req.body.email || req.query.email;
        const doctorData = await doctor.findByEmail(email); 
        if (!doctorData || doctorData.length === 0) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ success: true, doctorData: doctorData[0] });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// Update doctor profile
exports.updateDoctorData = async (req, res) => {
    const  {email}  = req.params;
    const  data  = req.body;
    console.log('Data to be updated:', data)

    try {

        const result = await doctor.update(email, data);
        if (result.affectedRows > 0) {
        
            const doctorData = await doctor.findByEmail(email);
            res.status(200).json({ success: true, message: 'Doctor profile updated successfully', data: doctorData[0] });
        } else {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};


// Delete doctor by email
exports.adminDeleteDoctor = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await doctor.deleteByEmail(email);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Doctor account deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


