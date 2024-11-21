import mongoose from 'mongoose';

const encounterSchema = new mongoose.Schema({
    patientId: mongoose.Schema.Types.ObjectId,
    doctorId: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    
    // Vital Signs
    bloodPressure: {
        systolic: Number,
        diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    
    // Measurements
    height: Number,  // in cm
    weight: Number,  // in kg
    bmi: Number,
    
    // Lab Results
    bloodGlucose: Number,
    hba1c: Number,
    cholesterol: {
        total: Number,
        hdl: Number,
        ldl: Number,
        triglycerides: Number
    },
    
    // Clinical Information
    chiefComplaint: String,
    symptoms: [String],
    diagnosis: [{
        code: String,  // ICD-10 code
        description: String,
        type: { type: String, enum: ['primary', 'secondary'] }
    }],
    
    // Treatment
    prescription: [{
        medication: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
    }],
    
    // Notes
    clinicalNotes: String,
    recommendations: String,
    
    // Follow-up
    followUpDate: Date,
    followUpInstructions: String,
    
    // Attachments/Scans
    attachments: [{
        type: String,  // e.g., 'X-Ray', 'MRI', 'CT Scan', 'Lab Report'
        url: String,
        description: String,
        date: Date
    }],
    
    // Status
    status: {
        type: String,
        enum: ['draft', 'completed', 'requires-follow-up'],
        default: 'completed'
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

export const Encounter = mongoose.model('Encounter', encounterSchema);