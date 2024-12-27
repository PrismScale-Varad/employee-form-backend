const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // For image resizing
const { google } = require('googleapis');
const googleAuth = require('../config/googleAuth');

// Google Drive configuration
const drive = google.drive({
    version: 'v3',
    auth: googleAuth
});

async function uploadToDrive(filePath, fileName) {
    try {
        const fileMetadata = {
            name: fileName,
            parents: ['1x32IABGYbuQQcmgEY7Hd_R1pvJRUf_03']
        };
        const media = {
            mimeType: 'image/png',
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id',
        });

        const fileId = response.data.id;
        const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw new Error('Failed to upload file to Google Drive.');
    }
}

async function processFiles(files) {
    const uploadsDir = path.join(__dirname, 'uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileUrls = [];

    for (const file of files) {
        const resizedPath = path.join(uploadsDir, `${file.filename}-resized.webp`);

        try {
            // Resize and convert to PNG
            await sharp(file.path)
                .resize({ width: 512 })
                .toFormat('webp')
                .toFile(resizedPath);

            // Upload to Google Drive
            const fileUrl = await uploadToDrive(resizedPath, `${file.originalname}-resized.png`);
            fileUrls.push(fileUrl);

            // Clean up temporary files
            //fs.unlinkSync(file.path); // Remove original
            fs.unlinkSync(resizedPath); // Remove resized after upload
        } catch (error) {
            console.error('Error processing file:', error);
            throw new Error('Failed to process and upload file.');
        }
    }

    return fileUrls;
}

module.exports = { processFiles };
