//performs of crud operations for admin in the database

const db = require('../config/db');

const admin = {
    FindAdminByUsernameForLogin: async (username) => {
        try {
            const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
            return rows;
        } catch (error) {
            console.error('Error getting Admin Username', error)
            throw error;
        }
    },
    getAllPatients: async () => {
        try {
            const [patients] = await db.query('SELECT * FROM patients');
            return patients;
        } catch (error) {
            throw error;
        }
    },

    getAdminByRole: async (role) => {
        try {
            const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [role]);
            return rows;
        } catch (error) {
            console.error('Error getting the role', error)
            throw error;
        }
    },

    addDoctor: async (doctorData) => {
        const { first_name, last_name, specialization, email, phone, schedule } = doctorData

        try {
            const [result] = await db.query(
                `INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)`
                [first_name, last_name, specialization, email, phone, schedule]
            )
            return result;
        } catch (error){
            console.error('Error adding doctor', error)
            throw error;
        }
    }

};

module.exports = admin;


