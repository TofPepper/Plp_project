
const express = require('express');
const router = express.Router();
const adminhandler = require('../handler/adminhandler');
const doctorhandler = require('../handler/doctorhandler');
//const {isAdmin} = require('../handler/adminhandler');



// route to login 
router.post('/login', adminhandler.loginAdmin);
router.post('/login', async (req, res) => {
  try {
    const { username} = req.body; 
    const AdminUser = await crud.loginAdminUser(username); 
    
    if (AdminUser) {
      res.status(200).json({ message: 'Login successful', AdminUser });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
      }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get list of patients
router.get('/patients', adminhandler.getPatients);

// Route to view all doctors
router.get('/doctors', adminhandler.getDoctors);

// Route to fetch a doctor by email
router.post('/doctor', doctorhandler.getDoctorByEmail);

// Route to update doctor profile
router.put('/doctor/:email', doctorhandler.updateDoctorData);

//Route to delete doctors accout
router.delete('/delete/:email', doctorhandler.adminDeleteDoctor)

/*

// Route to update a doctor's profile (admin only)
router.put('/doctors/:id', isAdmin, adminhandler.updateDoctor);

// Route to deactivate (delete) a doctor (admin only)
router.delete('/doctors/:id', isAdmin, adminhandler.deleteDoctor);

// Route to view all appointments (admin only)
router.get('/appointments', isAdmin, adminhandler.getAppointments);
*/


module.exports = router;

