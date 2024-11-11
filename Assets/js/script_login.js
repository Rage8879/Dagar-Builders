function goHome() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.pswd.value;

        // Simple hardcoded check for demonstration purposes
        // Replace this with actual authentication logic (e.g., API call)
        if (email === 'user@example.com' && password === 'password123') {
            // Store user information in localStorage
            localStorage.setItem('userToken', 'exampleToken');
            localStorage.setItem('userEmail', email);

            window.location.href = './index.html';
        } else {
            alert('Invalid email or password');
        }
    });
});