const express = require('express');
const formRoutes = require('./routes/form');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Route for handling form submissions
app.use('/form', formRoutes);

module.exports = app;
