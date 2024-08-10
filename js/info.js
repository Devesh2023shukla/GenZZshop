document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the user's email from local storage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User email not found. Please log in.');
        // Redirect to login page or handle error accordingly
        window.location.href = 'login.html';
        return;
    }

    const userInfoSheetID = '1x46MYy-Mc8DQUNbrDCEGuYRYjoyYM2qUrOh6iF1GhE8';
    const userInfoSheetName = 'Userinfo';
    const addressSheetName = 'Address';
    const apiKey = 'AIzaSyAFaW2EDlekqe51GowiUkT7oHcFsjSvYXU';

    const userInfoUrl = `https://sheets.googleapis.com/v4/spreadsheets/${userInfoSheetID}/values/${userInfoSheetName}?key=${apiKey}`;
    const addressUrl = `https://sheets.googleapis.com/v4/spreadsheets/${userInfoSheetID}/values/${addressSheetName}?key=${apiKey}`;

    fetch(userInfoUrl)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const headers = rows[0];
            const userRow = rows.find(row => row[headers.indexOf('signup-email')] === userEmail);

            if (userRow) {
                const userInfo = {};
                headers.forEach((header, index) => {
                    userInfo[header] = userRow[index];
                });

                document.getElementById('user-name').textContent = userInfo['signup-name'];
                document.getElementById('user-mobile').textContent = userInfo['signup-mobile'];
                document.getElementById('user-email').textContent = userInfo['signup-email'];
                document.getElementById('user-gender').textContent = userInfo['signup-gender'];

                const primaryAddress = `${userInfo['signup-address']}, ${userInfo['signup-city']}, ${userInfo['signup-state']} - ${userInfo['signup-pin']}, Mobile: ${userInfo['signup-mobile']}, Alternate Phone: ${userInfo['signup-alternate-phone']}`;
                document.getElementById('primary-address').textContent = primaryAddress;

                fetch(addressUrl)
                    .then(response => response.json())
                    .then(addressData => {
                        const addressRows = addressData.values;
                        const addressHeaders = addressRows[0];
                        const userAddresses = addressRows.filter(row => row[addressHeaders.indexOf('signup-email')] === userEmail);

                        const otherAddressesContainer = document.getElementById('other-addresses');
                        userAddresses.forEach(address => {
                            const addressInfo = {};
                            addressHeaders.forEach((header, index) => {
                                addressInfo[header] = address[index];
                            });

                            const addressText = `${addressInfo['signup-address']}, ${addressInfo['signup-city']}, ${addressInfo['signup-state']} - ${addressInfo['signup-pin']}, Mobile: ${addressInfo['signup-mobile']}, Alternate Phone: ${addressInfo['signup-alternate-phone']}`;
                            const addressElement = document.createElement('p');
                            addressElement.textContent = addressText;
                            otherAddressesContainer.appendChild(addressElement);
                        });
                    })
                    .catch(error => console.error('Error fetching address data:', error));
            } else {
                console.error('User not found');
            }
        })
        .catch(error => console.error('Error fetching user data:', error));

    // Log out functionality
    const logoutButton = document.getElementById('logout-link');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();

            // Display confirmation dialog
            const confirmed = confirm('Are you sure you want to log out?');
            if (confirmed) {
                // Clear user information from local storage
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userDOB');

                // Redirect to index.html and show a popup message
                //alert('Logged Out');
                window.location.href = '/index.html';
            }
        });
    }
});
