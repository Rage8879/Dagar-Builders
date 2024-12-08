const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async (newUser, callback) => {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const sql = 'INSERT INTO users (username, email, contact, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [newUser.username, newUser.email.toLowerCase(), newUser.contact, hashedPassword], callback);
    },
    findByIdentifier: (identifier, callback) => {
        const sql = 'SELECT * FROM users WHERE LOWER(email) = ? OR contact = ? OR LOWER(username) = ?';
        db.query(sql, [identifier.toLowerCase(), identifier, identifier.toLowerCase()], callback);
    },
    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM users WHERE LOWER(username) = ?';
        db.query(sql, [username.toLowerCase()], callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE LOWER(email) = ?';
        db.query(sql, [email.toLowerCase()], callback);
    },
    findByContact: (contact, callback) => {
        const sql = 'SELECT * FROM users WHERE contact = ?';
        db.query(sql, [contact], callback);
    },
    saveOtp: (identifier, otp, callback) => {
        const sql = 'UPDATE users SET otp = ? WHERE LOWER(email) = ? OR contact = ?';
        db.query(sql, [otp, identifier.toLowerCase(), identifier], callback);
    },
    verifyOtp: (identifier, otp, callback) => {
        const sql = 'SELECT * FROM users WHERE (LOWER(email) = ? OR contact = ?) AND otp = ?';
        db.query(sql, [identifier.toLowerCase(), identifier, otp], callback);
    },
    resetPassword: async (identifier, newPassword, callback) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE users SET password = ? WHERE LOWER(email) = ? OR contact = ?';
        db.query(sql, [hashedPassword, identifier.toLowerCase(), identifier], callback);
    }
};

module.exports = User;