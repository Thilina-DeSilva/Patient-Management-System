const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    PID: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    NearCity: { type: String, required: true },
    Doctor: { type: String, required: true },
    Guardian: { type: String, required: true },
    MedicalConditions: { type: [String], default: [] }, // Array of strings
    Medications: { type: [String], default: [] },       // Array of strings
    Allergies: { type: [String], default: [] },         // Array of strings
    Status: { type: String, required: true },
    LastVisitDate: { type: String, required: true } // Storing as string for simplicity as per example
});

module.exports = mongoose.model('Patient', patientSchema);