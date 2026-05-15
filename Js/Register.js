document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const submitBtn = document.querySelector('.btn-submit');

    const mockHash = (str) => {
        return btoa(str + '_nova_salt_2026');
    };

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = termsCheckbox.checked;

        if (!fullName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (!terms) {
            alert('You must agree to the terms to register.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('novaCartUsers')) || [];
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert('An account with this email already exists. Please login.');
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';

        setTimeout(() => {
            const newUser = {
                fullName: fullName,
                email: email,
                passwordHash: mockHash(password),
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('novaCartUsers', JSON.stringify(users));

            localStorage.setItem('novaCartDemoEmail', email);

            alert(`Registration successful for ${fullName}!\n\nYou can now log in with your credentials.`);

            window.location.href = 'login.html';
        }, 1500);
    });
});
