

const express = require('express');
const router = express.Router();
const doctorhandler = require('../handler/doctorhandler');

//Route for register
router.post('/register', doctorhandler.registerDoctor);
router.post('/register', async (req, res) => {
  try {
    const {first_name, last_name, email, specialisation, phone, days} = req.body;
    const DocUser = await crud.registerDocUser(first_name, last_name, email, specialisation, phone, days);
    if (DocUser) {
      res.status(200).json({message: 'Login successful', DocUser});
    } else {
      res.status(401).json({message: 'Invalid credentials'})
    }
  } catch (error) {
    res.status(500).json({message: 'Server error'})
  }
});

// Route for login
router.post('/login', doctorhandler.loginDoctor);
router.post('/login', async (req, res) => {
  try {
    const { email} = req.body; 
    const DocUser = await crud.loginDocUser(email);
  
    if (DocUser) {
      res.status(200).json({ message: 'Login successful', DocUser });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Log out
router.post('/logout', doctorhandler.logoutDoctor)


// Add a new doctor 
router.post('/add', doctorhandler.addDoctor);

// Get all doctors
router.get('/', doctorhandler.getAllDoctors);

//View a doctor profile
router.get('/view', doctorhandler.viewProfile);

// Update a doctor's schedule
router.put('/update', doctorhandler.updateProfile);

// Delete a doctor
router.delete('/delete', doctorhandler.deleteDoctor);

module.exports = router;
