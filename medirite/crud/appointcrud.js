
//performs all crud operations for appointments in the database 
const db = require('../config/db')

const appointment = {
    create: async (appointment) => {
        const { patient_id, doctor_id, appointment_date, appointment_time } = appointment;
        try {
            const [result] = await db.query(
                `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, appointment_status)
                 VALUES (?, ?, ?, ?, 'scheduled')`,
                [patient_id, doctor_id, appointment_date, appointment_time]
            );
            return result;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    findPatientByEmail: async (email) => {
        try {
            const [patients] = await db.query(`SELECT patient_id FROM patients WHERE email = ?`, [email]);
            return patients.length > 0 ? patients[0].patient_id : null;
        } catch (error) {
            console.error('Error finding patient_id by email:', error);
            throw error;
        }
        
    },

    upcoming: async (patient_id) => {
        try{
            const [result] = await db.query(
                `SELECT appointments.*, doctors.first_name, doctors.last_name, doctors.specialisation
                FROM appointments
                JOIN doctors ON appointments.doctor_id = doctors.doctor_id
                WHERE appointment_status = "scheduled" AND patient_id = ?
                ORDER BY appointments.appointment_date ASC`,
                [patient_id]
            );
            return result;
        } catch (error){
            console.error('Error getting upcoming appointments', error);
            throw error;
        }
    },

    update: async (appointmentId, newTime, newDate) => {
        try {
            const [result] = await db.query(
                `UPDATE appointments SET appointment_time = ?, appointment_date = ?, appointment_status = 'rescheduled' WHERE appointmnet_id = ?`,
                [newTime, newDate, appointmentId]
            );
            return result;
            
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    },

    delete: async (appointmentId) => {
        try {
            const [result] = await db.query(`UPDATE appointments SET appointment_status = 'cancelled' WHERE appointmnet_id = ? ` [appointmentId])
            return result;
        } catch (error) {
            console.error('Error cancelling appointment', error)
            throw error;
        }
    }, 

    history: async(patient_id) => {
        try {
            const [result] = await db.query(
                `SELECT a.appointment_date, a.appointment_time, a.appointment_status, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, d.specialisation 
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.doctor_id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
                [patient_id]
            );
            console.log('Data:', result)
            return result;
        } catch (error){
            console.error('Error fetching appointment history', error);
            throw error;
        }
    },

    getForDoctor: async (doctor_id) => {
        try {
            const [result] = await db.query(
                `SELECT a.appointment_date, a.appointment_time, a.appointment_status, 
                        p.first_name AS patient_first_name, p.last_name AS patient_last_name 
                 FROM appointments a
                 JOIN patients p ON a.patient_id = p.patient_id
                 WHERE a.doctor_id = ? 
                 AND (a.appointment_status = 'scheduled' OR a.appointment_status = 'rescheduled')
                 ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
                [doctor_id]
            );
            console.log('Data', result);
            return result;
        } catch (error) {
            console.error('Error fetching data from database', error);
            throw error;
        }
    },

    getAll: async () => {
        try {
            const [result] = await db.query(
                `SELECT a.appointment_date, a.appointment_time, a.appointment_status,
                    p.first_name AS patient_first_name, p.last_name AS patient_last_name,
                    d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.patient_id
                JOIN doctors d ON a.doctor_id = d.doctor_id
                ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
            )
            console.log('Database result', result);
            return result;
        } catch (error){
            console.error('Error fetching all appointments', error);
            throw error;
        }
    }
}

module.exports = appointment