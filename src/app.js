const express = require('express');
const formRoutes = require('./routes/form');
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Route for handling form submissions
app.use('/form', formRoutes);

module.exports = app;
