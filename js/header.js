$(document).ready(function() {
    // Retrieve user name from local storage
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // Split the name to get the first name
        const nameParts = userName.split(' ');
        const firstName = nameParts[0];
        
        // Update the greeting in the header
        $('#user-greeting').text(`Hello ${firstName} !!!`);
        
        // Ensure the profile icon link points to info.html if user is logged in
        $('.account').attr('href', 'info.html');
    } else {
        // If no user is logged in, the profile icon link should point to profile.html
        $('.account').attr('href', 'profile.html');
        $('#user-greeting').text('');
    }
});

