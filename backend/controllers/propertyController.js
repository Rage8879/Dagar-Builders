const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.getAllProperties = (req, res) => {
    Property.getAll((err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Failed to fetch properties' });
            return;
        }
        res.json(results);
    });
};

exports.createProperty = (req, res) => {
    const newProperty = req.body;
    Property.create(newProperty, (err, result) => {
        if (err) {
            console.error('Error adding property:', err);
            res.status(500).json({ error: 'Failed to add property' });
            return;
        }
        res.json({ id: result.insertId, ...newProperty });
    });
};

exports.registerUser = (req, res) => {
    const newUser = req.body;
    User.create(newUser, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Failed to register user' });
            return;
        }
        res.json({ message: 'User registered successfully' });
    });
};

exports.loginUser = (req, res) => {
    const { identifier, password } = req.body;
    User.findByIdentifier(identifier, async (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).json({ error: 'Failed to login' });
            return;
        }
        if (results.length === 0) {
            res.status(400).json({ error: 'Invalid email, mobile, or username' });
            return;
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
};

exports.forgotPassword = (req, res) => {
    const { identifier } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    User.saveOtp(identifier, otp, (err, result) => {
        if (err) {
            console.error('Error saving OTP:', err);
            res.status(500).json({ error: 'Failed to send OTP' });
            return;
        }
        // Send OTP via email or SMS (implementation not shown)
        res.json({ message: 'OTP sent successfully' });
    });
};

exports.verifyOtp = (req, res) => {
    const { identifier, otp } = req.body;
    User.verifyOtp(identifier, otp, (err, results) => {
        if (err) {
            console.error('Error verifying OTP:', err);
            res.status(500).json({ error: 'Failed to verify OTP' });
            return;
        }
        if (results.length === 0) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }
        res.json({ message: 'OTP verified successfully' });
    });
};