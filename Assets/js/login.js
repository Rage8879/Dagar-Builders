document.querySelectorAll('.toggle-form').forEach(item => {
    item.addEventListener('click', event => {
        const loginSection = document.querySelector('.form-section.login-active');
        const signupSection = document.querySelector('.form-section:nth-child(2)');
        
        loginSection.classList.toggle('login-active');
        signupSection.classList.toggle('active');

        // If login is active, move signup to view
        if (loginSection.classList.contains('login-active')) {
            signupSection.style.transform = 'translateX(100%)';
            loginSection.style.transform = 'translateX(0)';
        } else {
            signupSection.style.transform = 'translateX(0)';
            loginSection.style.transform = 'translateX(-100%)';
        }
    });
});
