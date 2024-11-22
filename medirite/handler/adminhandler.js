
//handles all operations of admin
const admin = require('../crud/admincrud');
const patient = require('../crud/patientscrud')
const doctor = require('../crud/doctorscrud')

exports.loginAdmin = async(req, res) => {
    const { username} = req.body;

    try {
        const rows = await admin.FindAdminByUsernameForLogin(username);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Admin not found!' });
        }

        const token = 'jnfuhujivnbnfjufjfjiwjij';  
        req.session.admin_id = rows[0].id; 
    
        return res.json({ success: true, token, redirectUrl: '/views/admin.html' });
    } catch (error){
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Failed to log in!' });
    }
    
};

exports.getPatients = async (req, res) => {
    try {
        const patients = await patient.getAllPatients();
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch patients' });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await doctor.getAllDoctors();
        res.status(200).json({success: true, data: doctors });
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to fetch doctors' });
    }
};






