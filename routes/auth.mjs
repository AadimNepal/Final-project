import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/user.mjs';
import { transporter } from '../utils/email.mjs';

const router = express.Router();

// Store temporary data
const pendingRegistrations = new Map();
const passwordResetTokens = new Map();

// Home route
router.get('/', (req, res) => {
    res.render('index', {
        message: req.query.message,
        error: req.query.error
    });
});

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const isDoctor = role === 'doctor';

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('index', { 
                error: 'Email already registered',
                formData: { name, email, role }
            });
        }

        if (isDoctor && !email.endsWith('@nyu.edu')) {
            return res.render('index', {
                error: 'Doctors must use an @nyu.edu email',
                formData: { name, email, role }
            });
        }

        // Generate verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        
        // Store registration data temporarily
        pendingRegistrations.set(email, {
            name,
            password,
            isDoctor,
            verificationCode,
            timestamp: Date.now()
        });

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify your Health Portal account',
            html: `
                <h1>Welcome to Health Portal</h1>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        });

        // Render verification page
        res.render('verify', { email });

    } catch (err) {
        console.error("Registration Error:", err);
        res.render('index', {
            error: 'Error during registration. Please try again.',
            formData: { name, email, role }
        });
    }
});

// Verification route
router.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    const registration = pendingRegistrations.get(email);

    if (!registration) {
        return res.render('verify', { 
            email, 
            error: 'Registration expired. Please register again.' 
        });
    }

    // Check if verification code is expired (10 minutes)
    if (Date.now() - registration.timestamp > 600000) {
        pendingRegistrations.delete(email);
        return res.render('verify', { 
            email, 
            error: 'Verification code expired. Please register again.' 
        });
    }

    if (registration.verificationCode !== code) {
        return res.render('verify', { 
            email, 
            error: 'Invalid verification code. Please try again.' 
        });
    }

    try {
        // Create verified user
        const hashedPassword = await bcrypt.hash(registration.password, 10);
        const user = new User({
            name: registration.name,
            email,
            password: hashedPassword,
            isDoctor: registration.isDoctor,
            isVerified: true
        });

        await user.save();
        pendingRegistrations.delete(email);

        // Send welcome email
        if (registration.isDoctor) {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Welcome to the Health Portal',
                text: `Hi ${registration.name}, you are registered as a doctor.`
            });
        }

        res.redirect('/?message=Registration successful. Please login.');

    } catch (err) {
        console.error("Verification Error:", err);
        res.render('verify', { 
            email, 
            error: 'Error during verification. Please try again.' 
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isVerified) {
            return res.render('index', { 
                error: 'Please verify your email before logging in.',
                formData: { email }
            });
        }
        req.session.user = user;
        res.redirect(user.isDoctor ? '/doctor-dashboard' : '/patient-dashboard');
    } else {
        res.render('index', { 
            error: 'Invalid credentials',
            formData: { email }
        });
    }
});

// Forgot password routes
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('forgot-password', {
                error: 'No account found with this email address.'
            });
        }

        // Generate reset code
        const resetCode = crypto.randomInt(100000, 999999).toString();
        
        // Store reset code
        passwordResetTokens.set(email, {
            code: resetCode,
            timestamp: Date.now()
        });

        // Send reset email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request - Health Portal',
            html: `
                <h1>Password Reset Request</h1>
                <p>Your password reset code is: <strong>${resetCode}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        res.render('reset-password', {
            email,
            message: 'Reset code has been sent to your email.'
        });

    } catch (err) {
        console.error("Password Reset Error:", err);
        res.render('forgot-password', {
            error: 'Error processing your request. Please try again.'
        });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, code, password, confirmPassword } = req.body;
    const resetData = passwordResetTokens.get(email);

    // Validate reset request
    if (!resetData) {
        return res.render('reset-password', {
            email,
            error: 'Reset code expired. Please request a new one.'
        });
    }

    // Check if code is expired (10 minutes)
    if (Date.now() - resetData.timestamp > 600000) {
        passwordResetTokens.delete(email);
        return res.render('reset-password', {
            email,
            error: 'Reset code expired. Please request a new one.'
        });
    }

    // Verify code
    if (resetData.code !== code) {
        return res.render('reset-password', {
            email,
            error: 'Invalid reset code. Please try again.'
        });
    }

    // Verify passwords match
    if (password !== confirmPassword) {
        return res.render('reset-password', {
            email,
            error: 'Passwords do not match.'
        });
    }

    try {
        // Update user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        // Clean up reset token
        passwordResetTokens.delete(email);

        // Redirect to login with success message
        res.redirect('/?message=Password has been reset successfully. Please login with your new password.');

    } catch (err) {
        console.error("Password Reset Error:", err);
        res.render('reset-password', {
            email,
            error: 'Error resetting password. Please try again.'
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

export default router;