
//handles all operations of patient

const bcrypt = require('bcryptjs'); //for hashed password
const patient = require('../crud/patientscrud');


// function to calculate date of birth from age
const calculateDOB = (age) => {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const birthMonth = today.getMonth();
    const birthDay = today.getDate();
    const dateOfBirth = new Date(birthYear, birthMonth, birthDay);
    return dateOfBirth;
};

exports.registerPatient = async (req, res) => {
    const { first_name, last_name, email, password, phone, age, gender, country } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const date_of_birth = calculateDOB(age); 

    try {
        const existingUser = await patient.findByEmail(email);

        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        
        await patient.create({
            first_name,
            last_name,
            email,
            password_hash: passwordHash,
            phone,
            date_of_birth,
            gender,
            country
        });

        const rows = await patient.findByEmailForLogin(email) 
        const token = 'jnfuhujivnbnfjufjfjiwjij';  
        req.session.patient_id = rows[0].patient_id;
        console.log('Patient ID stored in session:', req.session.patient_id);

        return res.json({ success: true, token, redirectUrl: '/views/patient.html'}); 
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Failed to register user!' });
    }
};

exports.loginPatient = async (req, res) => {
    const { email, password } = req.body;
    try {
        const rows = await patient.findByEmailForLogin(email);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid details!' });
        }

        const token = 'generate-jwt-token-here';  
        req.session.patient_id = rows[0].patient_id;
        console.log('Patient ID stored in session:', req.session.patient_id);

        return res.json({ success: true, token, redirectUrl: '/views/patient.html' });
        
    } catch (error) {  
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Failed to log in!' });
    }
};

exports.logoutPatient = (req, res) => {
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
        const patient_id = req.session.patient_id; 
        console.log('Patient ID:', patient_id);

        const patientData = await patient.getPatientById(patient_id);
        console.log('Patient Data:', patientData);

        if (!patientData || patientData.length === 0) {
            return res.status(404).json({ success: false, message: 'Time out. Login again' });
        }

        return res.json({ success: true, data: patientData[0] });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const patient_id = req.session.patient_id;
    const patientData = req.body; 

    console.log('Patient data:', patientData);

    if (!patientData.first_name || !patientData.last_name || !patientData.phone || !patientData.date_of_birth || !patientData.gender || !patientData.address) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const result = await patient.updatePatient(patient_id, patientData);

        if (result.affectedRows > 0) {
            const updatedPatient = await patient.getPatientById(patient_id);
            res.status(200).json({ success: true, message: 'Patient profile updated successfully', data: updatedPatient[0] });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ success: false, message: 'Error updating patient profile', error });
    }
};

exports.deletePatient = async (req, res) => {
    const patient_id = req.session.patient_id;  

    if (!patient_id) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No patient ID found' });
    }

    try {
        const result = await patient.deletePatient(patient_id);  

        if (result.affectedRows > 0) {
            req.session.destroy();  
            res.status(200).json({ success: true, message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error deleting patient account:', error);
        res.status(500).json({ success: false, message: 'Error deleting account' });
    }
};



