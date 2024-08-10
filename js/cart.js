document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadUserInfo();
    loadCartItems();
});

function checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert('You are not logged in');
        window.location.href = 'profile.html';
    }
}

function loadUserInfo() {
    const userEmail = localStorage.getItem('userEmail');
    fetch(`/api/userInfo?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const userInfo = data.data;
            document.getElementById('user-name').innerText = userInfo.name;
            document.getElementById('pin-code').innerText = userInfo.pinCode;
            document.getElementById('complete-address').innerText = userInfo.address;
        })
        .catch(error => console.error('Error fetching user info:', error));
}

function loadCartItems() {
    const userEmail = localStorage.getItem('userEmail');
    fetch(`/api/cartItems?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const cartItems = data.data;
            fetchProductDetails(cartItems);
        })
        .catch(error => console.error('Error fetching cart items:', error));
}

function fetchProductDetails(cartItems) {
    const productIds = cartItems.map(item => item.productId);
    const productSizes = cartItems.map(item => item.productSize);

    fetch('/api/productDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds, productSizes })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const products = data.data;
            const cartContainer = document.getElementById('cart-items');
            let totalItems = 0;
            let totalPrice = 0;
            let totalDiscount = 0;

            products.forEach((product, index) => {
                if (product) {
                    const { productName, price, discountedPrice, stockStatus, imageUrl } = product;
                    const discount = price - discountedPrice;
                    const productSize = productSizes[index];

                    totalItems++;
                    totalPrice += discountedPrice;
                    totalDiscount += discount;

                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <img src="${imageUrl}" alt="${productName}">
                        <div class="cart-item-details">
                            <h3>${productName.length > 40 ? productName.slice(0, 40) + '...' : productName}</h3>
                            <p>₹${discountedPrice} <span style="text-decoration: line-through;">₹${price}</span> (${Math.round((discount / price) * 100)}% off)</p>
                            <p>Size: ${productSize}</p>
                            <p>Stock Status: ${stockStatus}</p>
                            <div class="quantity-controls">
                                <button onclick="updateQuantity(this, -1)">-</button>
                                <span>1</span>
                                <button onclick="updateQuantity(this, 1)">+</button>
                            </div>
                            <button class="remove-product" onclick="removeItem(this)">REMOVE</button>
                        </div>
                    `;
                    cartContainer.appendChild(cartItem);
                }
            });

            updatePriceDetails();
        })
        .catch(error => console.error('Error fetching product details:', error));
}

function updateQuantity(button, delta) {
    const quantitySpan = button.parentElement.querySelector('span');
    let quantity = parseInt(quantitySpan.innerText);
    quantity += delta;
    if (quantity <= 0) {
        button.parentElement.parentElement.parentElement.remove();
    } else {
        quantitySpan.innerText = quantity;
    }
    updatePriceDetails();
}

function removeItem(button) {
    button.parentElement.parentElement.remove();
    updatePriceDetails();
}

function updatePriceDetails() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalItems = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    cartItems.forEach(cartItem => {
        const priceDetails = cartItem.querySelector('.cart-item-details p').innerText.split(' ');
        const discountedPrice = parseFloat(priceDetails[0].slice(1));
        const originalPrice = parseFloat(priceDetails[1].slice(1));
        const discount = originalPrice - discountedPrice;
        const quantity = parseInt(cartItem.querySelector('.quantity-controls span').innerText);

        totalItems += quantity;
        totalPrice += discountedPrice * quantity;
        totalDiscount += discount * quantity;
    });

    document.getElementById('price-details').innerHTML = `
    <p><span>Price (${totalItems} items)</span><span>₹${totalPrice + totalDiscount}</span></p>
    <p class="discount"><span>Discount</span><span>- ₹${totalDiscount}</span></p>
    <p class="delivery"><span>Delivery Charges</span><span id="srk">₹140</span> <span>Free</span></p>
    <h3><span>Total Amount</span><span>₹${totalPrice}</span></h3>
    <p>You will save ₹${totalDiscount} on this order.</p>
    `;
}

document.getElementById('change-address-btn').addEventListener('click', () => {
    window.location.href = 'newaddress.html';
});

document.getElementById('place-order-btn').addEventListener('click', () => {
    window.location.href = 'payment.html';
});
