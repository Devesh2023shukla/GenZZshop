document.addEventListener('DOMContentLoaded', function () {
    const sheetID = '1tU0vZ2y6q4818OljkjgJb0cmIlH4WO4HdiVKEhVAUxE';
    const apiKey = 'AIzaSyAFaW2EDlekqe51GowiUkT7oHcFsjSvYXU';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Tshirt?key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayProducts(data.values))
        .catch(error => console.error('Error fetching data:', error));
});

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    products.slice(1).forEach(product => {
        const [productID, brand, name, , , price, discountedPrice, , , imageURL1] = product;
        const discountPercentage = ((price - discountedPrice) / price * 100).toFixed(0);

        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
        <a href="product.html?id=${productID}">
            <img src="${imageURL1}" alt="${name}">
            <div class="brand">${brand}</div>
            <div class="name">${name}</div>
            <div class="price-container">
                <div class="price">₹${discountedPrice}</div>
                <div class="original-price">₹${price}</div>
            
                <div class="discount">${discountPercentage}% off</div>
            </div>
        </a>
        `;

        productItem.addEventListener('click', function () {
            window.location.href = `product.html?id=${productID}`;
        });

        productList.appendChild(productItem);
    });
}
