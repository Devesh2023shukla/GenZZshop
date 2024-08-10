const scriptURL = 'https://script.google.com/macros/s/AKfycbzKTajF3YBbQ8gN9Lk6yYVY64bgfssp2UpuOE47ZCfaO1i1BVLIkqPOhEKPDH64x5FFqA/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! your form is submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})
