const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const googleAuth = new JWT({
    keyFile: 'service-account-key.json',
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
    ],
});

module.exports = googleAuth;
