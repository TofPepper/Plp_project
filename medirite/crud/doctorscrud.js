
//performs all crud operations for doctors in the database
const db = require('../config/db');

const doctor = {
    create: async (doctorData) => {
        const { first_name, last_name, specialisation, email, phone, days } = doctorData;
        try {
            const [result] = await db.query(
                `INSERT INTO doctors (first_name, last_name, specialisation, email, phone, days, start_time, end_time)
                 VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)` ,
                [first_name, last_name, specialisation, email, phone, days] 
            );
            return result;
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error;
        }
    },

    findByEmailForLogin: async (email) => {
        try {
            const [rows] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
            return rows;
        } catch (error) {
            console.error('Error finding doctor by email for login:', error);
            throw error;
        }
    },

    findByEmail: async (email) => {
        try {
            const [rows] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
            console.log('Database Query Result:', rows)
            return rows;
        } catch (error) { 
            console.error('Error finding doctor by email:', error);
            throw error;
        }
    },

    getAllDoctors: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM doctors');
            return rows;
        } catch (error) {
            console.error('Error getting all doctors:', error);
            throw error;
        }
    },
    
    getDoctorById: async (doctor_id) => {
        try {
            const [doctor] = await db.query('SELECT * FROM doctors WHERE doctor_id = ?', [doctor_id]);
            console.log('Database Query Result:', doctor)
            return doctor;
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            throw error;
        }
    },

    updateDoctor: async (doctor_id, doctorData) => {
        const { first_name, last_name, specialisation, phone, days, start_time, end_time } = doctorData;
        try {
            const [result] = await db.query(
                `UPDATE doctors SET first_name = ?, last_name = ?, specialisation = ?, phone = ?, days = ?, start_time = ?, end_time = ?
                 WHERE doctor_id = ?`, 
                [first_name, last_name, specialisation, phone, days, start_time, end_time, doctor_id]
            );
            return result;
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    },

    update: async ( email, data) => {
        const { first_name, last_name, specialisation, phone, days, start_time, end_time } = data;
        try {
            const [result] = await db.query(
                `UPDATE doctors SET first_name = ?, last_name = ?, specialisation = ?, phone = ?, days = ?, start_time = ?, end_time = ?
                 WHERE email = ?`,
                 [first_name, last_name, specialisation, phone, days, start_time, end_time, email]
            );
            return result;
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    },

    deleteDoctor: async (doctor_id) => {
        try {
            const [result] = await db.query('DELETE FROM doctors WHERE doctor_id = ?', [doctor_id]);
            return result;
        } catch (error) {
            console.error('Error deleting doctor:', error);
            throw error;
        }
    },

    deleteByEmail: async (email) => {
        try {
            const [result] = await db.query('DELETE FROM doctors WHERE email = ?', [email]);
            return result;
        } catch (error) {
            console.error('Error deleting doctor', error);
            throw error;
        }
    }
};

module.exports = doctor;
