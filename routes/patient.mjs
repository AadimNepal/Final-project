import express from 'express';
import { Encounter } from '../models/encounter.mjs';
import { User } from '../models/user.mjs';

const router = express.Router();

// Middleware to check if user is a patient
const isPatient = (req, res, next) => {
    if (!req.session.user || req.session.user.isDoctor) {
        return res.redirect('/');
    }
    next();
};

router.use(isPatient);

// Main patient dashboard - showing list of doctors
router.get('/', async (req, res) => {
    try {
        // Find all encounters for this patient
        const encounters = await Encounter.find({ 
            patientId: req.session.user._id 
        }).populate('doctorId', 'name');

        // Get unique doctors and count their encounters
        const doctorStats = encounters.reduce((acc, encounter) => {
            const doctorId = encounter.doctorId._id.toString();
            if (!acc[doctorId]) {
                acc[doctorId] = {
                    id: doctorId,
                    name: encounter.doctorId.name,
                    encounterCount: 0,
                    lastVisit: encounter.date
                };
            }
            acc[doctorId].encounterCount++;
            if (new Date(encounter.date) > new Date(acc[doctorId].lastVisit)) {
                acc[doctorId].lastVisit = encounter.date;
            }
            return acc;
        }, {});

        const doctors = Object.values(doctorStats);

        res.render('patient-dashboard', {
            doctors,
            patientName: req.session.user.name
        });

    } catch (err) {
        console.error("Error fetching patient data:", err);
        res.status(500).send('Error loading dashboard');
    }
});

// Doctor-specific encounters list
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const encounters = await Encounter.find({
            patientId: req.session.user._id,
            doctorId: req.params.doctorId
        })
        .populate('doctorId', 'name')
        .sort({ date: -1 });

        const doctor = await User.findById(req.params.doctorId);

        res.render('patient-doctor-encounters', {
            encounters,
            doctorName: doctor.name,
            patientName: req.session.user.name
        });

    } catch (err) {
        console.error("Error fetching encounters:", err);
        res.status(500).send('Error loading encounters');
    }
});

// Individual encounter details
router.get('/encounter/:encounterId', async (req, res) => {
    try {
        const encounter = await Encounter.findById(req.params.encounterId)
            .populate('doctorId', 'name');

        console.log('Found encounter:', encounter);

        if (!encounter || encounter.patientId.toString() !== req.session.user._id.toString()) {
            return res.status(404).send('Encounter not found');
        }

        res.render('patient-encounter-details', {
            encounter,
            patientName: req.session.user.name
        });

    } catch (err) {
        console.error("Error fetching encounter:", err);
        res.status(500).send('Error loading encounter details');
    }
});

export default router;