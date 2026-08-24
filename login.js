const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const showRegister = document.getElementById('showRegister');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            errorMessage.style.display = 'none';
            
            const success = await authManager.login(username, password);
            
            if (success) {
                window.location.href = '/index.html';
            } else {
                errorMessage.textContent = 'Invalid username or password';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        // Show registration form
        showRegistrationForm();
    });

    function showRegistrationForm() {
        loginForm.innerHTML = `
            <div class="form-group">
                <label for="regUsername">Username</label>
                <input type="text" id="regUsername" placeholder="Choose a username" required>
            </div>
            <div class="form-group">
                <label for="regEmail">Email</label>
                <input type="email" id="regEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
                <label for="regPassword">Password</label>
                <input type="password" id="regPassword" placeholder="Create a password" required>
            </div>
            <div class="form-group">
                <label for="regConfirmPassword">Confirm Password</label>
                <input type="password" id="regConfirmPassword" placeholder="Confirm your password" required>
            </div>
            <button type="submit" class="login-btn">Register</button>
        `;

        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                confirmPassword: document.getElementById('regConfirmPassword').value
            };

            if (userData.password !== userData.confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }

            try {
                errorMessage.style.display = 'none';
                
                const success = await authManager.register(userData);
                
                if (success) {
                    window.location.href = '/index.html';
                } else {
                    errorMessage.textContent = 'Registration failed. Please try again.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Registration error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            }
        };
    }
});

javascript