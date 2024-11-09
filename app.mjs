// File: app.mjs
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import hbs from 'hbs';
import './config.mjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

// MongoDB Connection
mongoose.connect(process.env.DSN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Session Setup
app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
  })
);

// Define Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isDoctor: Boolean,
});

const encounterSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  doctorId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
  description: String,
});

const User = mongoose.model('User', userSchema);
const Encounter = mongoose.model('Encounter', encounterSchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Home (Login/Register)
app.get('/', (req, res) => res.render('index'));

// Register Route
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const isDoctor = role === 'doctor';
  
    if (isDoctor && !email.endsWith('@nyu.edu')) {
      return res.status(400).send('Doctors must use an @nyu.edu email');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isDoctor });
  
    try {
      await user.save();
      
      if (isDoctor) {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: 'Welcome to the Health Portal',
          text: `Hi ${name}, you are registered as a doctor.`,
        });
      }
      
      res.redirect('/');
    } catch (err) {
      console.error("Registration Error:", err);  // Log the error
      res.status(500).send('Error registering user');
    }
  });
  

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect(user.isDoctor ? '/doctor-dashboard' : '/patient-dashboard');
  } else {
    res.status(400).send('Invalid credentials');
  }
});

// Doctor Dashboard
app.get('/doctor-dashboard', async (req, res) => {
  if (!req.session.user?.isDoctor) return res.redirect('/');
  const patients = await User.find({ isDoctor: false });
  res.render('doctor-dashboard', { patients });
});

// Add Encounter
app.post('/doctor-dashboard/add-encounter', async (req, res) => {
  const { patientId, description } = req.body;
  const encounter = new Encounter({
    patientId,
    doctorId: req.session.user._id,
    description,
  });
  await encounter.save();
  res.redirect('/doctor-dashboard');
});

// Patient Dashboard
app.get('/patient-dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.isDoctor) return res.redirect('/');
  const encounters = await Encounter.find({ patientId: req.session.user._id }).populate('doctorId', 'name');
  res.render('patient-dashboard', { encounters });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
