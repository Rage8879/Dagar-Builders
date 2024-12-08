document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('search-btn');
    const searchPopover = document.getElementById('search-popover');
    const searchInput = searchPopover.querySelector('input'); // Select the input field within the popover

    // Toggle popover visibility on button click
    searchBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up
        searchPopover.style.display = searchPopover.style.display === 'block' ? 'none' : 'block';
        
        // Focus the input field if the popover is visible
        if (searchPopover.style.display === 'block') {
            searchInput.focus(); // Focus the input field
        }
    });

    // Close popover when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!searchBtn.contains(event.target) && !searchPopover.contains(event.target)) {
            searchPopover.style.display = 'none';
        }
    });
});

// Search on Enter key
document.querySelector('.search-container input[type="text"]').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        searchProperties();
    }
});

// Search on button click
document.querySelector('.search-container .btn').addEventListener('click', searchProperties);



function searchProperties() {
    const searchInput = document.querySelector('.search-container input[type="text"]');
    const keyword = searchInput.value.trim();

    if (keyword) {
        // Redirect to search_results.html with the search keyword as a query parameter
        window.location.href = `search_results.html?query=${encodeURIComponent(keyword)}`;
    }
}
