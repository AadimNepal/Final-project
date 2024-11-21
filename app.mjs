import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import hbs from 'hbs';
import nconf from './config/index.mjs';  // Change this line
import './utils/hbsHelpers.mjs';

// Import routes
import authRoutes from './routes/auth.mjs';
import doctorRoutes from './routes/doctor.mjs';
import patientRoutes from './routes/patient.mjs';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

// Register helper for comparing values in handlebars
hbs.registerHelper('eq', (a, b) => a === b);

// MongoDB Connection
mongoose.connect(nconf.get('MONGODB:DSN'), {  // Change this line
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Session Setup
app.use(
    session({
        secret: nconf.get('SESSION_SECRET'),  // Change this line
        resave: false,
        saveUninitialized: true,
    })
);

// Routes
app.use('/', authRoutes);
app.use('/doctor-dashboard', doctorRoutes);
app.use('/patient-dashboard', patientRoutes);

// Start the Server
const PORT = nconf.get('PORT');  // Change this line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));