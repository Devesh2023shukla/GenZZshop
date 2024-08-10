const scriptURL = 'https://script.google.com/macros/s/AKfycbzFnykUHzxjLT43clxi1VeGZwHbaohQBgdJ7jkpAy1bM7Mv7BMOgi70_pd2MBS09hq98g/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! your form is submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})