const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const config = require('dotenv').config()
// Define the path for the service account key file
const keyFilePath = path.join(__dirname, 'service-account-key.json');

// Check if the key file exists
if (!fs.existsSync(keyFilePath)) {
  console.log('Service account key file does not exist. Creating new one...');

  // Get the service account credentials from the environment variable
  const credentials = process.env.JSON; // Assume the entire JSON string is stored here

  if (!credentials) {
    throw new Error('No service account JSON found in environment variable.');
  }

  // Write the JSON string to a file
  fs.writeFileSync(keyFilePath, credentials);
  console.log('Service account key file created.');
}

// Now you can use the key file for authentication
const googleAuth = new JWT({
  keyFile: keyFilePath, // Use the file you just created or it already existed
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

module.exports = googleAuth