const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Route to handle form data
router.post('/', upload.any(), (req, res) => {
    console.log('Form Fields:', req.body); // Logs text fields
    console.log('Uploaded Files:', req.files); // Logs file details
    res.status(200).json({ message: 'Form data received successfully!' });
});

module.exports = router;
