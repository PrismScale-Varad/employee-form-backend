const express = require('express');
const multer = require('multer');
const { processFiles } = require('../services/fileHandler'); // Import file handling module
const { saveToGoogleSheet } = require('../services/googleSheet'); // Import Google Sheets module
const { file } = require('googleapis/build/src/apis/file');
const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Route to handle form data
router.post('/', upload.any(), async (req, res) => {
    try {
        // Process files (resize and upload)
        const fileUrls = await processFiles(req.files); // Returns array of URLs

        // Combine form data with file URLs
        const formData = {
            ...req.body,
            files: fileUrls,
        };
        
        // Save data to Google Sheets
        await saveToGoogleSheet(formData);

        res.status(200).json({ message: 'Form data saved successfully!', formData});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

module.exports = router;
