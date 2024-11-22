
const appointment = require('../crud/appointcrud'); 

// Handles all operations of appointment
exports.bookAppointment = async (req, res) => {
    const { email, doctor_id, appointment_date, appointment_time } = req.body;
    
    try {

        const patient_id = await appointment.findPatientByEmail(email)

        if (!patient_id) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        await appointment.create({
            patient_id :patient_id,
            doctor_id,
            appointment_date,
            appointment_time
        });
        
        res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment!' });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const patient_id = req.session.patient_id;
        console.log('Patient id:', patient_id);

        if (!patient_id) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please log in again' });
        }

        const comingAppointments = await appointment.upcoming(patient_id);
        console.log("Upcoming appointments", comingAppointments)

        if(!comingAppointments || comingAppointments.length === 0){
            return res.status(404).json({success: false, message: 'Time out. Login again'});

        }
        return res.json({success:true, data: comingAppointments});
    } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
        return res.status(500).json({success: false, error: 'Server error'});
    }
};

exports.getAppointmentForDoctor = async (req, res) => {
    const doctor_id = req.session.doctor_id; 
    try {
        const result = await appointment.getForDoctor(doctor_id);
        console.log("Data fetched from database", result);

        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, message: 'No appointments found' });
        }

        return res.json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching appointments for doctor", error);
        return res.status(500).json({ success: false, error: 'Ooops, server error' });
    }
};

exports.updateAppointment = async (req, res) => {
    const { appointmentId, newTime, newDate } = req.body;  
    
    if (!appointmentId || !newTime || !newDate) {
        return res.status(400).json({ success: false, message: "Missing appointment details" });
    }

    try {
        const result = await appointment.update(appointmentId, newTime, newDate);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Appointment updated successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ success: false, message: "Error updating appointment" });
    }
};

exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.body;

    if (!appointmentId) {
        return res.status(400).json({ success: false, message: "Appointment ID is required" });
    }

    try {
        const result = await appointment.delete(appointmentId);

        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Appointment canceled successfully" });
        } else {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
    } catch (error) {
        console.error('Error canceling appointment:', error);
        return res.status(500).json({ success: false, message: "Error canceling appointment" });
    }
};

exports.historyAppointment = async (req, res) => {
    const patient_id = req.session.patient_id; 

    if (!patient_id) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    try {
        const result = await appointment.history(patient_id); 
        
        if (result.length > 0) {
            console.log('Data from the database:', result)
            return res.status(200).json({ success: true, data: result });
        } else {
            return res.status(404).json({ success: false, message: "No appointments found" });
        }
        
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        return res.status(500).json({ success: false, message: "Error retrieving appointments" });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const result = await appointment.getAll();
        res.status(200).json({success: true, data: result });
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to fetch all appointments' });
    }
};


