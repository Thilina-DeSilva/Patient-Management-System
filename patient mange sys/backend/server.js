const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Patient = require('./models/patient'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection

const MONGODB_URI = 'mongodb+srv://ERENyeager:clashofroyal@testmongo.ptn1bdi.mongodb.net/?appName=testMONGO';


mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// --- REST API Endpoints ---

// 1. Insert a Patient (POST request)
app.post('/api/patients', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. Show all Patients (GET request)
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Find a Patient by Patient_ID (PID) (GET request)
app.get('/api/patients/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const patient = await Patient.findOne({ PID: pid });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with this PID.' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Find Patient by First Name
app.get('/api/patients/firstName/:firstName', async (req, res) => {
    try {
        const firstName = req.params.firstName;
        const patients = await Patient.find({ FirstName: firstName });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found with that first name.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Find Patient by Last Name
app.get('/api/patients/lastName/:lastName', async (req, res) => {
    try {
        const lastName = req.params.lastName;
        const patients = await Patient.find({ LastName: lastName });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found with that last name.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Find Patients Email
app.get('/api/patients/email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const patients = await Patient.find({ Email: email });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found with that email.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Find Patients by Nearest City
app.get('/api/patients/city/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const patients = await Patient.find({ NearCity: city });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found in that city.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 8. Find Patients by Assigned Doctor
app.get('/api/patients/doctor/:doctor', async (req, res) => {
    try {
        const doctor = req.params.doctor;
        const patients = await Patient.find({ Doctor: doctor });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found for that doctor.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 9. Find Patients by Guardian
app.get('/api/patients/guardian/:guardian', async (req, res) => {
    try {
        const guardian = req.params.guardian;
        const patients = await Patient.find({ Guardian: guardian });
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found for that guardian.' });
        }
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 10. Update Patients by PID
app.put('/api/patients/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updateData = req.body;

        const updatedPatient = await Patient.findOneAndUpdate({ PID: pid }, updateData, { new: true, runValidators: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found with this PID for update.' });
        }
        res.status(200).json(updatedPatient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 11. Update Patients by First Name
app.put('/api/patients/firstName/:firstName', async (req, res) => {
    try {
        const firstName = req.params.firstName;
        const updateData = req.body;

        const result = await Patient.updateMany({ FirstName: firstName }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No patients found with that first name to update.' });
        }
        res.status(200).json({ message: `${result.modifiedCount} patient(s) updated successfully. Matched: ${result.matchedCount}.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 12. Delete Patients by PID
app.delete('/api/patients/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deletedPatient = await Patient.findOneAndDelete({ PID: pid });
        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found with this PID for deletion.' });
        }
        res.status(200).json({ message: 'Patient deleted successfully.', deletedPatient });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});