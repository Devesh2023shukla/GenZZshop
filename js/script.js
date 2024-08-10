document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search').value;
    if (query) {
        alert('Searching for: ' + query);
        // Implement your search functionality here
    }
});

