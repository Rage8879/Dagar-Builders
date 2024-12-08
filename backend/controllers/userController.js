const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
});

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

exports.registerUser = (req, res) => {
    const newUser = req.body;
    newUser.email = newUser.email.toLowerCase(); // Convert email to lowercase

    // Check if username already exists
    User.findByUsername(newUser.username, (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            res.status(500).json({ error: 'Failed to register user' });
            return;
        }
        if (results.length > 0) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }

        // Check if email already exists
        User.findByEmail(newUser.email, (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                res.status(500).json({ error: 'Failed to register user' });
                return;
            }
            if (results.length > 0) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }

            // Check if contact already exists
            User.findByContact(newUser.contact, (err, results) => {
                if (err) {
                    console.error('Error checking contact:', err);
                    res.status(500).json({ error: 'Failed to register user' });
                    return;
                }
                if (results.length > 0) {
                    res.status(400).json({ error: 'Mobile number already exists' });
                    return;
                }

                // Create new user
                User.create(newUser, (err, result) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        res.status(500).json({ error: 'Failed to register user' });
                        return;
                    }
                    res.json({ message: 'User registered successfully' });
                });
            });
        });
    });
};

exports.loginUser = (req, res) => {
    const { identifier, password } = req.body;
    const lowerCaseIdentifier = identifier ? identifier.toLowerCase() : ''; // Convert identifier to lowercase
    console.log('Login attempt:', lowerCaseIdentifier); // Debugging log
    User.findByIdentifier(lowerCaseIdentifier, async (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).json({ error: 'Failed to login' });
            return;
        }
        if (results.length === 0) {
            console.log('User not found'); // Debugging log
            res.status(400).json({ error: 'Invalid email, mobile, or username' });
            return;
        }
        const user = results[0];
        console.log('User found:', user); // Debugging log
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Debugging log
        if (!isMatch) {
            console.log('Password mismatch'); // Debugging log
            res.status(400).json({ error: 'Invalid email, mobile, or username' });
            return;
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
};

exports.forgotPassword = (req, res) => {
    const { identifier } = req.body;
    const lowerCaseIdentifier = identifier ? identifier.toLowerCase() : ''; // Convert identifier to lowercase
    console.log('Forgot password attempt:', lowerCaseIdentifier); // Debugging log
    User.findByIdentifier(lowerCaseIdentifier, (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).json({ error: 'Failed to send OTP' });
            return;
        }
        if (results.length === 0) {
            console.log('User not found'); // Debugging log
            res.status(400).json({ error: 'Email or mobile number not found' });
            return;
        }
        const user = results[0];
        console.log('User found for forgot password:', user); // Debugging log
        const otp = crypto.randomInt(100000, 999999).toString();
        User.saveOtp(lowerCaseIdentifier, otp, (err, result) => {
            if (err) {
                console.error('Error saving OTP:', err);
                res.status(500).json({ error: 'Failed to send OTP' });
                return;
            }

            if (user.email === lowerCaseIdentifier) {
                // Send OTP via email
                const mailOptions = {
                    from: config.email.auth.user,
                    to: user.email,
                    subject: 'Your OTP for Password Reset',
                    text: `Your OTP for password reset is ${otp}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        res.status(500).json({ error: 'Failed to send OTP via email' });
                        return;
                    }
                    console.log('Email sent:', info.response);
                    res.json({ message: 'OTP sent successfully via email' });
                });
            } else if (user.contact === lowerCaseIdentifier) {
                // Send OTP via SMS using Twilio Verify API
                client.verify.v2.services(config.twilio.verifyServiceSid)
                    .verifications
                    .create({ to: user.contact, channel: 'sms' })
                    .then(verification => {
                        console.log('SMS sent:', verification.sid);
                        res.json({ message: 'OTP sent successfully via SMS' });
                    })
                    .catch(error => {
                        console.error('Error sending SMS:', error);
                        res.status(500).json({ error: 'Failed to send OTP via SMS' });
                    });
            } else {
                console.log('Invalid identifier:', lowerCaseIdentifier); // Debugging log
                res.status(400).json({ error: 'Invalid identifier' });
            }
        });
    });
};

exports.verifyOtp = (req, res) => {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
        return res.status(400).json({ error: 'Identifier and OTP are required' });
    }
    const lowerCaseIdentifier = identifier.toLowerCase(); // Convert identifier to lowercase
    console.log('Verify OTP attempt:', lowerCaseIdentifier, otp); // Debugging log

    User.verifyOtp(lowerCaseIdentifier, otp, (err, results) => {
        if (err) {
            console.error('Error verifying OTP:', err);
            return res.status(500).json({ error: 'Failed to verify OTP' });
        }
        if (results.length === 0) {
            console.log('Invalid OTP'); // Debugging log
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        console.log('OTP verified successfully'); // Debugging log
        res.json({ message: 'OTP verified successfully' });
    });
};

exports.resetPassword = (req, res) => {
    const { identifier, newPassword } = req.body;
    const lowerCaseIdentifier = identifier ? identifier.toLowerCase() : ''; // Convert identifier to lowercase
    User.resetPassword(lowerCaseIdentifier, newPassword, (err, result) => {
        if (err) {
            console.error('Error resetting password:', err);
            res.status(500).json({ error: 'Failed to reset password' });
            return;
        }
        res.json({ message: 'Password reset successfully' });
    });
};