function goHome() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const email = loginForm.email.value;
        const password = loginForm.pswd.value;

        // Simple hardcoded check for demonstration purposes
        // Replace this with actual authentication logic (e.g., API call)
        if (email === 'user@example.com' && password === 'password123') {
            // Store user information in localStorage
            localStorage.setItem('userToken', 'exampleToken');
            localStorage.setItem('userEmail', email);

            // Redirect to the account page
            window.location.href = './index.html'; // Replace with the actual account page URL
        } else {
            alert('Invalid email or password');
        }
    });
});