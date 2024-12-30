const express = require('express');
const multer = require('multer');
const { processFiles } = require('../services/fileHandler'); // Import file handling module
const { saveToGoogleSheet } = require('../services/googleSheet'); // Import Google Sheets module
const crypto = require('crypto'); // To generate HMAC-based token

const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory
const secret = process.env.TOTP; // Secret key stored in environment variable

// Function to generate token based on timestamp
const generateTokenForTimestamp = (timestamp) => {
    const timeWindow = Math.floor(timestamp / 300); // Use 30-second window
    const message = Buffer.from(timeWindow.toString()); // Timestamp as message
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('hex'); // Return token as hex string
};

// Route to handle form data
router.post('/', upload.any(), async (req, res) => {
    try {
        const token = req.headers['x-totp-token']; // Expect TOTP token in headers
        const timestamp = parseInt(req.headers['x-timestamp'], 10);

        if (!token || !timestamp) {
            return res.status(400).json({ message: 'Missing token or timestamp' });
        }

        // Generate the expected token for the provided timestamp
        const expectedToken = generateTokenForTimestamp(timestamp);
        console.log("Expected Token:", expectedToken);

        // Validate the token by comparing it with the expected token
        if (token !== expectedToken) {
            return res.status(401).json({ message: 'Invalid TOTP token' });
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
