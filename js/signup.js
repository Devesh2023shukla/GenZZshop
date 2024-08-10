document.addEventListener('DOMContentLoaded', function () {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzKTajF3YBbQ8gN9Lk6yYVY64bgfssp2UpuOE47ZCfaO1i1BVLIkqPOhEKPDH64x5FFqA/exec';
  const form = document.forms['contact-form'];

  form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Fetch all input values
      const mobile = document.getElementById('signup-mobile').value;
      const reenterMobile = document.getElementById('signup-reenter-mobile').value;
      const email = document.getElementById('signup-email').value;
      const reenterEmail = document.getElementById('signup-reenter-email').value;
      const password = document.getElementById('signup-password').value;
      const reenterPassword = document.getElementById('signup-reenter-password').value;

      // Validate Mobile Numbers
      if (!/^\d{10}$/.test(mobile)) {
          alert("Mobile Number must be exactly 10 digits and contain only numbers 0-9.");
          return;
      }
      if (mobile !== reenterMobile) {
          alert("Mobile Number and Re-enter Mobile Number do not match.");
          return;
      }

      // Validate Email Addresses
      if (email !== reenterEmail) {
          alert("Email and Re-enter Email do not match.");
          return;
      }

      // Validate Passwords (DOBs)
      if (password !== reenterPassword) {
          alert("Password (DOB) and Re-enter Password (DOB) do not match.");
          return;
      }

      // If all validations pass, submit the form
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
          .then(response => {
              alert("Thank you! Your form is submitted successfully.");
              window.location.href = window.location.origin + '/index.html';
          })
          .catch(error => console.error('Error!', error.message));
  });
});
