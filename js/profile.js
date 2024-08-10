const sheetId = '1x46MYy-Mc8DQUNbrDCEGuYRYjoyYM2qUrOh6iF1GhE8';
const apiKey = 'AIzaSyAFaW2EDlekqe51GowiUkT7oHcFsjSvYXU';
const sheetName = 'Userinfo';  // Update if necessary

function authenticate() {
    gapi.load('auth2', function() {
        gapi.auth2.init({apiKey: apiKey});
    });
}

function fetchSheetData() {
    return new Promise((resolve, reject) => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        $.get(url, function(data) {
            resolve(data.values);
        }).fail(function() {
            reject('Error fetching data');
        });
    });
}

function validateCredentials(email, dob) {
    return fetchSheetData().then(data => {
        for (let i = 1; i < data.length; i++) {  // Skip header row
            if (data[i][3] === email && data[i][5] === dob) {
                return data[i]; // Return the entire row
            }
        }
        return null;
    });
}

function setGreeting(userName) {
    $('#user-greeting').text(`Hello ${userName.split(' ')[0]} !!!`); // Display first name
}

$(document).ready(function() {
    console.log('Profile page loaded');
    
    // Check if user is already logged in
    const userEmail = localStorage.getItem('userEmail');
    console.log('User email from local storage:', userEmail);
    
    if (userEmail) {
        fetchSheetData().then(data => {
            let userFound = false;
            for (let i = 1; i < data.length; i++) {
                if (data[i][3] === userEmail) {
                    // User is logged in, display greeting and redirect
                    $('#login-form').hide();
                    $('#user-nav').show();
                    $('#login-tab').hide();
                    $('#signup-tab').hide();
                    setGreeting(data[i][0]); // Set greeting text
                    // Redirect to info.html
                    window.location.href = 'info.html';
                    userFound = true;
                    break;
                }
            }
            if (!userFound) {
                // If email is not found in the sheet, clear local storage
                localStorage.removeItem('userEmail');
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    $('#login-button').click(function() {
        const email = $('#login-email').val();
        const dob = $('#login-password').val();
        validateCredentials(email, dob).then(user => {
            if (user) {
                // User logged in successfully
                $('#login-form').hide();
                $('#user-nav').show();
                $('#login-tab').hide();
                $('#signup-tab').hide();
                setGreeting(user[0]); // Set greeting text

                // Store user email in local storage
                localStorage.setItem('userEmail', email);

                // Redirect to info.html
                window.location.href = 'info.html';
            } else {
                alert('Invalid email or password');
            }
        }).catch(error => {
            console.error('Error validating credentials:', error);
        });
    });

    $('#logout').click(function() {
        $('#login-form').show();
        $('#user-nav').hide();
        $('#login-tab').show();
        $('#signup-tab').show();
        $('#user-greeting').text('');

        // Clear user email from local storage
        localStorage.removeItem('userEmail');
    });

    authenticate();
});

