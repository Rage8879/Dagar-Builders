document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('User registered successfully');
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register user');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('userToken', result.token);
            alert('Login successful');
            // Redirect to home page or dashboard
            window.location.href = '/index.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to login');
    }
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.forgot-password').style.display = 'block';
});

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('OTP sent successfully');
            document.querySelector('.forgot-password').style.display = 'none';
            document.querySelector('.verify-otp').style.display = 'block';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send OTP');
    }
});

document.getElementById('verifyOtpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/users/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('OTP verified successfully');
            // Redirect to reset password page or allow password reset
            window.location.href = '/reset-password.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to verify OTP');
    }
});
