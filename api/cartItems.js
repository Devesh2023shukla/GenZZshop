// api/cartItems.js
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const sheetId = process.env.SHEET_ID_CART;
        const sheetName = process.env.SHEET_NAME_CART;
        const apiKey = process.env.GOOGLE_API_KEY;

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        const response = await axios.get(url);

        const data = response.data.values;
        const headers = data[0];
        const cartItems = data.slice(1).filter(row => row[headers.indexOf('email')] === email);

        if (!cartItems.length) {
            return res.status(404).json({ error: 'No items found in the cart' });
        }

        res.status(200).json({ data: cartItems.map(item => ({
            productId: item[headers.indexOf('productId')],
            productSize: item[headers.indexOf('productSize')]
        })) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};
