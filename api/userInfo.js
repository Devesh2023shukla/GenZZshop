// api/userInfo.js
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const sheetId = process.env.SHEET_ID_USERINFO;
        const sheetName = process.env.SHEET_NAME_USERINFO;
        const apiKey = process.env.GOOGLE_API_KEY;

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        const response = await axios.get(url);

        const data = response.data.values;
        const headers = data[0];
        const userInfo = data.slice(1).find(row => row[headers.indexOf('signup-email')] === email);

        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            data: {
                name: userInfo[headers.indexOf('signup-name')],
                pinCode: userInfo[headers.indexOf('signup-pin')],
                address: `${userInfo[headers.indexOf('signup-address')]}, ${userInfo[headers.indexOf('signup-city')]}, ${userInfo[headers.indexOf('signup-state')]}, ${userInfo[headers.indexOf('signup-mobile')]}`
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user information' });
    }
};
