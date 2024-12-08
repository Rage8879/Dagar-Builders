const db = require('../config/db');

const Property = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM properties';
        db.query(sql, callback);
    },
    create: (newProperty, callback) => {
        const sql = 'INSERT INTO properties SET ?';
        db.query(sql, newProperty, callback);
    },
    // Add more methods as needed (e.g., update, delete)
};

module.exports = Property;