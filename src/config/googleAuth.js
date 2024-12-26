const { google } = require('googleapis');

const googleAuth = new google.auth.GoogleAuth({
    keyFile: 'path/to/your/service-account-key.json',
    scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

module.exports = googleAuth;
