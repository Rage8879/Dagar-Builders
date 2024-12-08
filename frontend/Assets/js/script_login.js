function goHome() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    // Function to render the login form
    function renderLoginForm() {
        contentDiv.innerHTML = `
            <div class="login">
                <form id="loginForm">
                    <label for="chk" aria-hidden="true">Login</label>
                    <input type="text" name="identifier" placeholder="Email, Mobile, or Username" required="">
                    <input class="pswd" type="password" name="password" placeholder="Password" required="">
                    <p><a href="#" id="forgotPasswordLink" class="navbar-link">Forgot Password?</a></p>
                    <button type="submit" class="btn">Login</button>
                </form>
                <p><a href="#" id="signUpLink" class="navbar-link">Don't have an account? Sign up</a></p>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('forgotPasswordLink').addEventListener('click', renderForgotPasswordForm);
        document.getElementById('signUpLink').addEventListener('click', renderSignUpForm);
    }

    // Function to handle login form submission
    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log('Login data:', data); // Debugging log

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('Login response:', result); // Debugging log
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
    }

    // Function to render the sign-up form
    function renderSignUpForm(e) {
        e.preventDefault();
        contentDiv.innerHTML = `
            <div class="signup">
                <form id="signUpForm">
                    <label for="chk" aria-hidden="true">Sign up</label>
                    <input type="text" inputmode="latin-name" name="username" placeholder="User name" required="">
                    <input type="email" inputmode="email" name="email" placeholder="Email" required="">
                    <input type="number" name="contact" inputmode="tel" placeholder="Mobile Number" required="">
                    <input class="pswd" type="password" name="password" placeholder="Password" required="">
                    <button type="submit" class="btn">Sign up</button>
                </form>
                <p><a href="#" id="loginLink" class="navbar-link">Already have an account? Login</a></p>
            </div>
        `;

        document.getElementById('signUpForm').addEventListener('submit', handleSignUp);
        document.getElementById('loginLink').addEventListener('click', renderLoginForm);
    }

    // Function to handle sign-up form submission
    async function handleSignUp(e) {
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
                renderLoginForm();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to register user');
        }
    }

    // Function to render the forgot password form
    function renderForgotPasswordForm(e) {
        e.preventDefault();
        contentDiv.innerHTML = `
            <div class="forgot-password">
                <form id="forgotPasswordForm">
                    <label for="chk" aria-hidden="true">Forgot Password</label>
                    <input type="text" name="identifier" placeholder="Email or Mobile" required="">
                    <button type="submit" class="btn">Send OTP</button>
                </form>
            </div>
        `;

        document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    }

    // Function to handle forgot password form submission
    async function handleForgotPassword(e) {
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
                renderVerifyOtpForm(data.identifier); // Pass the identifier to the next form
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send OTP');
        }
    }

    // Function to render the verify OTP form
    function renderVerifyOtpForm(identifier) {
        contentDiv.innerHTML = `
            <div class="verify-otp">
                <form id="verifyOtpForm">
                    <label for="chk" aria-hidden="true">Verify OTP</label>
                    <input type="hidden" name="identifier" value="${identifier}">
                    <input type="text" name="otp" placeholder="Enter OTP" required="">
                    <button type="submit" class="btn">Verify OTP</button>
                </form>
            </div>
        `;

        document.getElementById('verifyOtpForm').addEventListener('submit', handleVerifyOtp);
    }

    // Function to handle verify OTP form submission
    async function handleVerifyOtp(e) {
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
                renderResetPasswordForm(data.identifier); // Pass the identifier to the next form
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to verify OTP');
        }
    }

    // Function to render the reset password form
    function renderResetPasswordForm(identifier) {
        contentDiv.innerHTML = `
            <div class="reset-password">
                <form id="resetPasswordForm">
                    <label for="chk" aria-hidden="true">Reset Password</label>
                    <input type="hidden" name="identifier" value="${identifier}">
                    <input class="pswd" type="password" name="newPassword" placeholder="New Password" required="">
                    <button type="submit" class="btn">Reset Password</button>
                </form>
            </div>
        `;

        document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    }

    // Function to handle reset password form submission
    async function handleResetPassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                alert('Password reset successfully');
                renderLoginForm();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to reset password');
        }
    }

    // Initially render the login form
    renderLoginForm();
});