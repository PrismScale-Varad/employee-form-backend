const express = require('express');
const multer = require('multer');
const { processFiles } = require('../services/fileHandler'); // Import file handling module
const { saveToGoogleSheet } = require('../services/googleSheet'); // Import Google Sheets module

const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory
const secretToken = process.env.BEARER_TOKEN; // Bearer token stored in .env

// Route to handle form data
router.post('/', upload.any(), async (req, res) => {
    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            return res.status(400).json({ message: 'Authorization header missing' });
        }

        // Extract Bearer token from Authorization header
        const token = authorizationHeader.split(' ')[1]; // "Bearer token"

        if (token !== secretToken) {
            return res.status(401).json({ message: 'Invalid Bearer token' });
        }

        // Process files (resize and upload)
        const fileUrls = await processFiles(req.files); // Returns array of URLs

        // Combine form data with file URLs
        const formData = {
            ...req.body,
            files: fileUrls,
        };

        // Save data to Google Sheets
        await saveToGoogleSheet(formData);

        res.status(200).json({ message: 'Form data saved successfully!', formData });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;
