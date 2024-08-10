const SHEET_ID = '1MOsbCTZuYjjXu1njhb5TjsK_nM93zpRbPdG5Tu5lvd8';
const API_KEY = 'AIzaSyAFaW2EDlekqe51GowiUkT7oHcFsjSvYXU';
const RANGE = 'Gown';

// URLs for Google Apps Script
const addToCartScriptURL = 'https://script.google.com/macros/s/AKfycbyDG9zJswV4CMbWtcr4FtFpm6teKCSYIo1adBk9cJqiWgMoOoo_V8EyR5fnNyxjKKkuGg/exec';
const addToWishListScriptURL = 'https://script.google.com/macros/s/AKfycbxVvfbbEJV0BWfc3G0ELb8GEE9ZBRoLq_tKh-CR6uhQXSXelSBD-WDApxNVansTvdfRqA/exec';

let currentProduct;
let currentImageIndex = 0;

// Functions
function calculateDiscountPercentage(price, discountedPrice) {
    return Math.round(((price - discountedPrice) / price) * 100);
}

function displayProductDetails(product) {
    currentProduct = product;

    document.getElementById('brand-name').innerText = product['Brand Name'];
    document.getElementById('product-name').innerText = product['Product Name'];
    document.getElementById('discounted-price').innerText = `₹${product['Discounted Price']}`;
    document.getElementById('original-price').innerText = `₹${product['Price']}`;
    document.getElementById('discount-percentage').innerText = `${calculateDiscountPercentage(product['Price'], product['Discounted Price'])}% off`;

    const sizes = product['Size'].split(',').map(size => size.trim());
    const availableSizes = document.getElementById('available-sizes');
    availableSizes.innerHTML = '';
    sizes.forEach(size => {
        const sizeElement = document.createElement('span');
        sizeElement.innerText = size;
        sizeElement.classList.add('size-button');
        sizeElement.addEventListener('click', () => {
            document.querySelectorAll('#available-sizes .size-button').forEach(s => s.classList.remove('selected'));
            sizeElement.classList.add('selected');
        });
        availableSizes.appendChild(sizeElement);
    });

    document.getElementById('stock-status').innerText = `Stock Status: ${product['Stock Status']}`;
    document.getElementById('return-status').innerText = `Return Status: ${product['Return Status']}`;

    document.getElementById('desc-product-name').innerText = product['Product Name'];
    document.getElementById('desc-color').innerText = product['Color'];
    document.getElementById('desc-sizes').innerText = product['Size'];
    document.getElementById('desc-fabric').innerText = product['Fabric'];
    document.getElementById('desc-type').innerText = product['Type'];
    document.getElementById('desc-pattern').innerText = product['Pattern'];
    document.getElementById('desc-sleeve-length').innerText = product['Sleeve Length'];
    document.getElementById('desc-net-quantity').innerText = product['Net Quantity'];

    const refImages = [];
    for (let i = 1; i <= 4; i++) {
        if (product[`Image URL ${i}`]) {
            refImages.push(product[`Image URL ${i}`]);
        }
    }
    displayRefImages(refImages);
    updateMainImage(0);
}

function displayRefImages(images) {
    const imageGallery = document.querySelector('.image-gallery');
    imageGallery.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.addEventListener('click', () => updateMainImage(index));
        imageGallery.appendChild(img);
    });
}

function updateMainImage(index) {
    const images = [currentProduct['Image URL 1'], currentProduct['Image URL 2'], currentProduct['Image URL 3'], currentProduct['Image URL 4']].filter(Boolean);
    currentImageIndex = index;
    document.getElementById('main-image').src = images[currentImageIndex];
}

function prevImage() {
    const images = [currentProduct['Image URL 1'], currentProduct['Image URL 2'], currentProduct['Image URL 3'], currentProduct['Image URL 4']].filter(Boolean);
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateMainImage(currentImageIndex);
}

function nextImage() {
    const images = [currentProduct['Image URL 1'], currentProduct['Image URL 2'], currentProduct['Image URL 3'], currentProduct['Image URL 4']].filter(Boolean);
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateMainImage(currentImageIndex);
}

function addToCart() {
    if (currentProduct['Stock Status'] === 'Out of Stock') {
        alert('Product is out of stock');
        return;
    }

    const selectedSizeElement = document.querySelector('#available-sizes .selected');
    if (!selectedSizeElement) {
        alert('Please select a size');
        return;
    }

    const selectedSize = selectedSizeElement.innerText;
    const sizes = currentProduct['Size'].split(',').map(size => size.trim());
    if (sizes.includes(selectedSize)) {
        const form = document.forms['cart-form'];
        const formData = new FormData(form);
        formData.set('email', getUserEmail()); // Set email
        formData.set('productId', currentProduct['Product ID']); // Set product ID
        formData.set('productSize', selectedSize); // Set selected size

        // Prevent form submission and use fetch instead
        fetch(addToCartScriptURL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                alert('Product added successfully!');
                // window.location.href = '\\';
                window.history.back();
            } else {
                alert('Failed to add product to cart.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('An error occurred. Please try again.');
        });
    } else {
        alert('Selected size is not available');
    }
}

function addToWishList() {
    const selectedSizeElement = document.querySelector('#available-sizes .selected');
    if (!selectedSizeElement) {
        alert('Please select a size');
        return;
    }

    const selectedSize = selectedSizeElement.innerText;
    const form = document.forms['cart-form'];
    const formData = new FormData(form);
    formData.set('email', getUserEmail()); // Set email
    formData.set('productId', currentProduct['Product ID']); // Set product ID
    formData.set('productSize', selectedSize); // Set selected size

    // Prevent form submission and use fetch instead
    fetch(addToWishListScriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            alert('Product added to wishlist successfully!');
            // window.location.href = window.location.origin + '\\';
            // window.history.back();
        } else {
            alert('Failed to add product to wishlist.');
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('An error occurred. Please try again.');
    });
}

function getUserEmail() {
    // Fetch and return user email from login info stored data
    // Placeholder logic for demonstration
    return localStorage.getItem('userEmail') || '';
}

document.getElementById('prev-image').addEventListener('click', prevImage);
document.getElementById('next-image').addEventListener('click', nextImage);
document.getElementById('add-to-cart').addEventListener('click', (e) => {
    e.preventDefault();
    addToCart();
});
document.getElementById('wishlist').addEventListener('click', (e) => {
    e.preventDefault();
    addToWishList();
});

function fetchProductData() {
    gapi.client.load('sheets', 'v4', () => {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE,
            key: API_KEY
        }).then(response => {
            const data = response.result.values;
            const headers = data[0];
            const products = data.slice(1).map(row => {
                const product = {};
                headers.forEach((header, index) => {
                    product[header] = row[index];
                });
                return product;
            });

            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const product = products.find(p => p['Product ID'] === productId);
            if (product) {
                displayProductDetails(product);
            } else {
                alert('Product not found');
            }
        }).catch(error => {
            console.error('Error fetching product data:', error);
        });
    });
}

gapi.load('client', () => {
    gapi.client.init({
        apiKey: API_KEY
    }).then(fetchProductData);
});
