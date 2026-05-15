document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const submitBtn = document.querySelector('.btn-submit');
    
    // Check if demo account info is in local storage and pre-fill
    const savedEmail = localStorage.getItem('novaCartDemoEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in both email and password fields.');
            return;
        }
        
        // Email validation regex (simple)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Fetch registered users
        let users = JSON.parse(localStorage.getItem('novaCartUsers')) || [];
        
        // Mock hash function to compare passwords (same as in Register.js)
        const mockHash = (str) => {
            return btoa(str + '_nova_salt_2026'); 
        };

        const user = users.find(u => u.email === email && u.passwordHash === mockHash(password));

        // If users exist in the system, enforce actual credential checking
        if (users.length > 0 && !user) {
            alert('Invalid email or password.');
            return;
        } else if (users.length === 0) {
            // Demo fallback if nobody has registered yet
            console.log('No registered users found. Allowing demo login.');
        }

        // Manage 'Remember me' local storage
        if (remember) {
            localStorage.setItem('novaCartDemoEmail', email);
        } else {
            localStorage.removeItem('novaCartDemoEmail');
        }
        
        // Simulate login process with visual feedback
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';
        
        // Simulate a network request delay
        setTimeout(() => {
            if (user) {
                alert(`Success! Welcome back, ${user.fullName}!\n\nLogged in as: ${email}`);
            } else {
                alert(`Demo Login Success for ${email}\n\nNote: Create an account to test full validation.`);
            }
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            
            // Here you would typically redirect the user
            // window.location.href = '/dashboard.html';
        }, 1500);
    });
});
