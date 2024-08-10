// api/productDetails.js
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'Product IDs are required' });
        }

        const sheetId = process.env.SHEET_ID_MASTER;
        const sheetName = process.env.SHEET_NAME_MASTER;
        const apiKey = process.env.GOOGLE_API_KEY;

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        const response = await axios.get(url);

        const data = response.data.values;
        const headers = data[0];
        const products = productIds.map(id => data.slice(1).find(row => row[headers.indexOf('Product ID')] === id))
                                    .filter(product => product);

        res.status(200).json({ data: products.map(product => ({
            productName: product[headers.indexOf('Product Name')],
            price: parseFloat(product[headers.indexOf('Price')]),
            discountedPrice: parseFloat(product[headers.indexOf('Discounted Price')]),
            stockStatus: product[headers.indexOf('Stock Status')],
            imageUrl: product[headers.indexOf('Image URL 1')]
        })) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
};
