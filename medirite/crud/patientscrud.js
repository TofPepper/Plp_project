
//performs all crud operations for patient

const db = require('../config/db'); 
const bcrypt = require('bcryptjs');

const patient = {
    create: async (patientData) => {
        const { first_name, last_name, email, password_hash, phone, date_of_birth, gender, address } = patientData;
        try {
            const [result] = await db.query(
                `INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address]
            );
            return result;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    },

    findByEmailForLogin: async (email) => {
        try {
            const [rows] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
            return rows;
        } catch (error) {
            console.error('Error finding patient by email for login:', error);
            throw error;
        }
    },

    findByEmail: async (email) => {
        try {
            const [rows] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
            return rows;
        } catch (error) {
            console.error('Error finding patient by email:', error);
            throw error;
        }
    },

    getPatientById: async (patient_id) => {
        try {
            const [patient] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [patient_id]);
            console.log('Database Query Result:', patient)
            return patient;
        } catch (error) {
            console.error('Error fetching patient data:', error);
            throw error;
        }
    },

    getAllPatients: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM patients');
            return rows;
        } catch (error) {
            console.error('Error getting all patients:', error);
            throw error;
        }
    },

    updatePatient: async (patient_id, patientData) => {
        const { first_name, last_name, phone, date_of_birth, gender, address } = patientData;
        try {
            const [result] = await db.query(
                `UPDATE patients 
                 SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?
                 WHERE patient_id = ?`,
                [first_name, last_name, phone, date_of_birth, gender, address, patient_id]
            );
    
            return result;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    },
    
    deletePatient: async (patient_id) => {
        try {
            const [result] = await db.query('DELETE FROM patients WHERE patient_id = ?', [patient_id]);
            return result;
        } catch (error) {
            console.error('Error deleting patient:', error);
            throw error;
        }
    }
};

module.exports = patient;


