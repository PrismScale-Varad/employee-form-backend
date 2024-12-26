const { google } = require('googleapis');
const googleAuth = require('../config/googleAuth');
const { JWT } = require('google-auth-library');

const jwtClient = new JWT({
    keyFile: 'service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({
    version: 'v4',
    auth: jwtClient
});

const SPREADSHEET_ID = '1iCWoLsWS4_e4X1310UTbkgh4CqfeuWJv8N-diIukWO4';
const RANGE = 'Sheet1!A:L';

async function saveToGoogleSheet(data) {
    const values = [
        data.name || '',
        data.email || '',
        data.designation || '',
        data.employeeID || '',
        data.dob || '',
        data.phone || '',
        data.bloodGroup || '',
    ]
    if (data.files && Array.isArray(data.files)) {
        values.push(...data.files);
    }

    await appendToGoogleSheet([values]);
}

async function appendToGoogleSheet(values) {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error);
    }
}


module.exports = { saveToGoogleSheet };
