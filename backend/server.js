const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Use property routes
app.use('/api', propertyRoutes);

// Use user routes
app.use('/api/users', userRoutes);

// Catch-all route to serve index.html for any other requests (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});