// Function to check if the user is logged in
function isLoggedIn() {
    // Check if a session token or user information is stored in localStorage or sessionStorage
    return localStorage.getItem('userToken') !== null;
}

// Function to check if the user is logged in
function isLoggedIn() {
    // Check if a session token or user information is stored in localStorage or sessionStorage
    return localStorage.getItem('userToken') !== null;
}

// JavaScript to toggle the profile popover
document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profileButton');
    const profilePopover = document.getElementById('profilePopover');
    const wishlistButton = document.getElementById('wishlistButton');

    profileButton.addEventListener('click', function(event) {
        // Prevent the default action
        event.preventDefault();

        if (isLoggedIn()) {
            // Toggle the profile popover if the user is logged in
            profilePopover.classList.toggle('show');
        } else {
            // Redirect to the login page if the user is not logged in
            window.location.href = './Login.html';
        }
    });
    
    wishlistButton.addEventListener('click', function(event) {
        if (isLoggedIn()) {
            window.location.href = './wishlist.html';
        } else {
            window.location.href = './Login.html';
        }
    });

    // Close the popover when clicking outside
    document.addEventListener('click', function(event) {
        if (!profileButton.contains(event.target) && !profilePopover.contains(event.target)) {
            profilePopover.classList.remove('show');
        }
    });
});



// Function to handle profile button click
function handleProfileClick(event) {
    // Prevent the default action
    event.preventDefault();
    if (isLoggedIn()) {
        // Toggle the profile popover if the user is logged in
        const profilePopover = document.getElementById('profilePopover');
    } else {
        // Redirect to the login page if the user is not logged in
        window.location.href = './Login.html';
    }
}

// Add event listener to the profile button
document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.querySelector('.header-bottom-actions-btn[aria-label="Profile"]');
    if (profileButton) {
        profileButton.addEventListener('click', handleProfileClick);
    }
});

// JavaScript function to go to a specific page
function goToPage(page) {
    window.location.href = page;
}

// JavaScript function to handle logout
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    window.location.href = './index.html';
}
