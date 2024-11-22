
const express = require('express');
const router = express.Router();
const appointhandler = require('../handler/appointhandler');

// Book an appointment
router.post('/book', appointhandler.bookAppointment);

// Get upcoming appointments
router.get('/upcoming', appointhandler.getAppointments);

//To reschedule appointments
router.put('/update', appointhandler.updateAppointment);

//To view appointments for doctors
router.get('/viewDoc', appointhandler.getAppointmentForDoctor);

//To view all appointments for admin
router.get('/viewAll', appointhandler.getAllAppointments)

// Cancel an appointment
router.delete('/cancel', appointhandler.cancelAppointment);

//view appointment history
router.get('/history', appointhandler.historyAppointment)

module.exports = router;
