// MySQL connection setup
const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2');


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTIONLIMIT
});


const createTables = async () => {
    try {
        const connection = await pool.promise().getConnection();

        const patientsTable = `
            CREATE TABLE IF NOT EXISTS patients (
                patient_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password_hash VARCHAR(255),
                phone VARCHAR(20),
                date_of_birth DATE,
                gender ENUM('male', 'female', 'other'),
                address TEXT
            )`;

        const doctorsTable = `
            CREATE TABLE IF NOT EXISTS doctors (
                doctor_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                specialisation VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                days VARCHAR(255),
                start_time TIME,
                end_time TIME
            )`;

        const appointmentsTable = `
            CREATE TABLE IF NOT EXISTS appointments (
                appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                appointment_date DATE,
                appointment_time TIME,
                appointment_status ENUM('scheduled', 'completed', 'rescheduled', 'cancelled'),
                FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
                FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
            )`;

        const adminTable = `
            CREATE TABLE IF NOT EXISTS admin (
                admin_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                password_hash VARCHAR(255),
                role ENUM('superadmin', 'admin')
            )`;

        // Execute table creation queries
        await connection.query(patientsTable);
        console.log('Patients table created or already exists');

        await connection.query(doctorsTable);
        console.log('Doctors table created or already exists');

        await connection.query(appointmentsTable);
        console.log('Appointments table created or already exists');

        await connection.query(adminTable);
        console.log('Admin table created or already exists');

        connection.release(); 
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};


createTables();


module.exports = pool.promise();
