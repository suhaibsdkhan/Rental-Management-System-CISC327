export function getApiBaseUrl() {
    const apiBaseUrl = window.__API_BASE_URL__ || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    return apiBaseUrl.replace(/\/$/, '');
}

export function setupLoginEventListeners(document, window, navigateFn = (url) => window.location.assign(url)) {
    // Login Form Elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');

    // Sign-Up Form Elements
    const signupForm = document.getElementById('signup-form');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupRepeatPasswordInput = document.getElementById('signup-repeat-password');
    const signupButton = document.getElementById('signup-button');
    const signupError = document.getElementById('signup-error');

    // Login Button Event Listener
    loginButton.addEventListener('click', async function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous error message
        loginError.textContent = '';

        if (!email || !password) {
            loginError.textContent = 'Please enter both email and password.';
            return;
        }

        // Prepare the data to send for login
        const loginData = {
            email: email,
            password: password
        };
        const baseUrl = getApiBaseUrl();

        try {
            const response = await fetch(`${baseUrl}/login?useCookies=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found. Please sign up.');
                } else if (response.status === 401) {
                    throw new Error('Incorrect password. Please try again.');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }
            }

            navigateFn('/dashboard');
        } catch (error) {
            loginError.textContent = error.message;
        }

        return true;
    });

    // Sign-Up Form Submission Event
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value.trim();
        const repeatPassword = signupRepeatPasswordInput.value.trim();

        // Clear previous error message
        signupError.textContent = '';
        signupError.classList.remove('text-success', 'text-danger');

        // Password validation patterns
        const minLengthPattern = /.{6,}/;
        const nonAlphanumericPattern = /[^a-zA-Z0-9]/;
        const digitPattern = /\d/;
        const uppercasePattern = /[A-Z]/;

        if (!email || !password || !repeatPassword) {
            signupError.textContent = 'Please fill in all fields.';
            signupError.classList.add('text-danger');
            return;
        }

        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            signupError.textContent = 'Please enter a valid email address.';
            signupError.classList.add('text-danger');
            return;
        }

        // Check if passwords match
        if (password !== repeatPassword) {
            signupError.textContent = 'Passwords do not match.';
            signupError.classList.add('text-danger');
            return;
        }

        // Validate password requirements
        if (!minLengthPattern.test(password)) {
            signupError.textContent = 'Password must be at least 6 characters long.';
            signupError.classList.add('text-danger');
            return;
        }

        if (!nonAlphanumericPattern.test(password)) {
            signupError.textContent = 'Password must contain at least one non-alphanumeric character.';
            signupError.classList.add('text-danger');
            return;
        }

        if (!digitPattern.test(password)) {
            signupError.textContent = 'Password must contain at least one digit.';
            signupError.classList.add('text-danger');
            return;
        }

        if (!uppercasePattern.test(password)) {
            signupError.textContent = 'Password must contain at least one uppercase letter.';
            signupError.classList.add('text-danger');
            return;
        }

        // Prepare the data to send for registration
        const registerData = {
            email: email,
            password: password
        };

        const baseUrl = getApiBaseUrl();

        fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error('Email already exists. Please use another one.');
                    } else {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Registration failed');
                        });
                    }
                }
            })
            .then(data => {
                // Show success message
                signupError.textContent = 'Registration successful! Please log in.';
                signupError.classList.remove('text-danger');
                signupError.classList.add('text-success');

                // Hide the modal after a short delay
                setTimeout(() => {
                    $('#signupModal').modal('hide');
                    signupForm.reset();
                    // Reset error message style
                    signupError.textContent = '';
                    signupError.classList.remove('text-success');
                }, 2000);
            })
            .catch(error => {
                signupError.textContent = error.message;
                signupError.classList.add('text-danger');
                signupButton.disabled = false;
            });

        return true;
    });
}

// Only run the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => setupLoginEventListeners(document, window));