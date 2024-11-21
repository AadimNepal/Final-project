import express from 'express';
import { User } from '../models/user.mjs';
import { Encounter } from '../models/encounter.mjs';

const router = express.Router();

// Middleware to check if user is a doctor
const isDoctor = (req, res, next) => {
    if (!req.session.user?.isDoctor) {
        return res.redirect('/');
    }
    next();
};

router.use(isDoctor); // Apply middleware to all routes in this file

// Doctor dashboard
router.get('/', async (req, res) => {
    const patients = await User.find({ isDoctor: false });
    res.render('doctor-dashboard', { patients });
});

// Add encounter
router.post('/add-encounter', async (req, res) => {
    try {
        console.log('Received form data:', req.body); // Debug log

        // Process blood pressure separately as it's nested
        const bloodPressure = {
            systolic: req.body['bloodPressure.systolic'],
            diastolic: req.body['bloodPressure.diastolic']
        };

        // Process cholesterol separately as it's nested
        const cholesterol = {
            total: req.body['cholesterol.total'],
            hdl: req.body['cholesterol.hdl'],
            ldl: req.body['cholesterol.ldl'],
            triglycerides: req.body['cholesterol.triglycerides']
        };

        // Process symptoms (convert comma-separated string to array)
        const symptoms = req.body.symptoms ? req.body.symptoms.split(',').map(s => s.trim()) : [];

        // Process prescriptions
        const prescription = [];
        // Check if there are any prescriptions
        if (req.body['prescription[0].medication']) {
            let i = 0;
            while (req.body[`prescription[${i}].medication`]) {
                prescription.push({
                    medication: req.body[`prescription[${i}].medication`],
                    dosage: req.body[`prescription[${i}].dosage`],
                    frequency: req.body[`prescription[${i}].frequency`],
                    duration: req.body[`prescription[${i}].duration`],
                    instructions: req.body[`prescription[${i}].instructions`]
                });
                i++;
            }
        }

        // Process diagnosis
        const diagnosis = [];
        if (req.body['diagnosis[0].code']) {
            diagnosis.push({
                code: req.body['diagnosis[0].code'],
                description: req.body['diagnosis[0].description'],
                type: 'primary'
            });
        }

        const encounter = new Encounter({
            patientId: req.body.patientId,
            doctorId: req.session.user._id,
            date: req.body.date || new Date(),
            status: req.body.status || 'completed',

            // Vital Signs
            bloodPressure,
            heartRate: req.body.heartRate,
            temperature: req.body.temperature,
            respiratoryRate: req.body.respiratoryRate,
            oxygenSaturation: req.body.oxygenSaturation,

            // Measurements
            height: req.body.height,
            weight: req.body.weight,
            bmi: req.body.bmi,

            // Lab Results
            bloodGlucose: req.body.bloodGlucose,
            hba1c: req.body.hba1c,
            cholesterol,

            // Clinical Information
            chiefComplaint: req.body.chiefComplaint,
            symptoms,
            diagnosis,

            // Treatment
            prescription,

            // Notes
            clinicalNotes: req.body.clinicalNotes,
            recommendations: req.body.recommendations,

            // Follow-up
            followUpDate: req.body.followUpDate,
            followUpInstructions: req.body.followUpInstructions
        });

        console.log('Saving encounter:', encounter); // Debug log

        await encounter.save();
        res.redirect('/doctor-dashboard');
    } catch (err) {
        console.error("Error adding encounter:", err);
        res.status(500).send('Error adding encounter');
    }
});

export default router;