const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const pool = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const app = express();

dotenv.config();


// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
//my public folder that contains js and css files
app.use(express.static(path.join(__dirname, 'public')));
//html files contained in views folder
app.set('views', path.join(__dirname, '/views'));



// Testing Database Connection
pool.getConnection()
.then((connection) => {
    console.log('Connected to the MySQL database.');
    connection.release();
})
.catch((err) => {
    console.error('Error connecting to the database:', err);
});


// Session configuration
app.use(session({
    secret: 'jnkfhnvkKOJNoKJNVJJIFFNIOJJJNnBDIJNHWUINJIVJIWOJFVNNnjefijkhuvjowk',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 60 * 60 * 24,
        secure: false,
        httpOnly: true,
    }
}));


// Importing my routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');

// Using the routes
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
//app.use('/appointments', appointmentRoutes);
//app.use('/admin', adminRoutes);


// Route for the home page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for the patient dashboard (indexp.html)
app.get('/indexp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'indexp.html'));
});

app.post('/indexp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'indexp.html'));
});

// Route for the login form (flogin.html)
app.get('/flogin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'flogin.html'));
});

// Route for the registration form (fregiter.html)
app.get('/fregister.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fregister.html'));
});


// Route for the admin dashboard (admin.html)
app.post('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Route for the patient's webpage (patient.html)
app.post('/patient.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'patient.html'));
});

app.get('/patient.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'patient.html'));
});


// Route for apointment booking webpage(bookApp.html)
app.get('/bookApp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bookApp.html'));
});

// Route for doctor login form(doclogin.html)
app.get('/doclogin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'doclogin.html'));
});

// Route for doctor registration form(docregister.html)
app.get('/docregister.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'docregister.html'));
});

// Route for doctor's dashboard(doctor.html)
app.post('/doctor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'doctor.html'));
});

app.get('/doctor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'doctor.html'));
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});




