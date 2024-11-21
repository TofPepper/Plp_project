

const express = require('express');
const router = express.Router();
const patienthandler = require('../handler/patienthandler');

// Register a new patient
router.post('/register', patienthandler.registerPatient);
router.post('/register', async (req, res) => {
  try {
    const {first_name, last_name, email, password_hash, phone, date_of_birth, gender, country} = req.body;
    const user = await crud.registerUser(first_name, last_name, email, password_hash, phone, date_of_birth, gender, country);
    if (user) {
      res.status(200).json({message: 'Login successful', user});
      } else {
      res.status(401).json({message: 'Invalid credentials'})
    }
  } catch (error) {
    res.status(500).json({message: 'Server error'})
  }
});

// Route for login
router.post('/login', patienthandler.loginPatient);
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body; // Get login credentials
      const user = await crud.loginUser(email, password); // Call login logic from CRUD
  
      if (user) {
        res.status(200).json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

// Logout a patient
router.post('/logout', patienthandler.logoutPatient);

//View a patient profile
router.get('/Vprofile', patienthandler.viewProfile);

// Update a profile
router.put('/update', patienthandler.updateProfile);

// Delete account
router.delete('/delete', patienthandler.deletePatient);


module.exports = router;
