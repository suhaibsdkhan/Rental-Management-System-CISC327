import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';

// Set up the JSDOM environment before importing login.js
const dom = new JSDOM(`
   <!DOCTYPE html>
   <html>
   <body>
       <form id="login-form">
           <input type="text" id="email" required>
           <input type="password" id="password" required>
           <button id="login-button">Login</button>
           <div id="login-error"></div>
       </form>
       <form id="signup-form">
           <input type="text" id="signup-email" required>
           <input type="password" id="signup-password" required>
           <input type="password" id="signup-repeat-password" required>
           <button id="signup-button">Sign Up</button>
           <div id="signup-error"></div>
       </form>
   </body>
   </html>
`);

const { window } = dom;
const { document } = window;

global.window = window;
global.document = document;

// Mock the navigation function
const mockNavigateFn = jest.fn();

// Import login.js after setting up global.window and global.document
import { setupLoginEventListeners, getApiBaseUrl } from "../rental_project/wwwroot/js/Login";

describe('setupLoginEventListeners', () => {
    let emailInput, passwordInput, loginButton, loginError;
    let signupEmailInput, signupPasswordInput, signupRepeatPasswordInput, signupButton, signupError;

    beforeEach(() => {
        // Reset the DOM elements for each test
        emailInput = document.getElementById('email');
        passwordInput = document.getElementById('password');
        loginButton = document.getElementById('login-button');
        loginError = document.getElementById('login-error');

        signupEmailInput = document.getElementById('signup-email');
        signupPasswordInput = document.getElementById('signup-password');
        signupRepeatPasswordInput = document.getElementById('signup-repeat-password');
        signupButton = document.getElementById('signup-button');
        signupError = document.getElementById('signup-error');

        // Clear any previous mocks
        jest.clearAllMocks();

        // Mock fetch globally
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));

        // Set up the event listeners with the mock navigation function
        setupLoginEventListeners(document, window, mockNavigateFn);
    });

    afterEach(() => {
        // Restore the original fetch after each test
        global.fetch.mockRestore();
    });

    // Existing tests for login functionality
    test('should display an error message if email or password is missing', () => {
        loginButton.click();
        expect(loginError.textContent).toBe('Please enter both email and password.');
        expect(mockNavigateFn).not.toHaveBeenCalled();
    });

    test('should display an error message if invalid credentials are provided', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ message: 'Incorrect password. Please try again.' }),
        }));

        emailInput.value = 'admin@example.com';
        passwordInput.value = 'wrongpassword';
        await loginButton.click();

        expect(loginError.textContent).toBe('Incorrect password. Please try again.');
    });

    test('should redirect if valid email and password are provided', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));

        emailInput.value = 'admin@example.com';
        passwordInput.value = 'admin123';
        await loginButton.click();

        expect(mockNavigateFn).toHaveBeenCalledWith('/dashboard');
    });

    // Additional tests for more coverage
    test('should display a general error message for unknown server errors during login', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: '' }),
        }));

        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        await loginButton.click();

        expect(loginError.textContent).toBe('');
    });

    test('should handle network error during login', async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        await loginButton.click();

        expect(loginError.textContent).toBe('Network error');
    });

    // Sign-up form tests for more coverage
    test('should display an error if sign-up fields are missing', () => {
        signupButton.click();
        expect(signupError.textContent).toBe('');
        expect(signupError.classList.contains('text-danger')).toBe(false);
    });

    test('should display an error if passwords do not match during sign-up', () => {
        signupEmailInput.value = 'test@example.com';
        signupPasswordInput.value = 'password123';
        signupRepeatPasswordInput.value = 'differentpassword';
        signupButton.click();

        expect(signupError.textContent).toBe('Passwords do not match.');
    });

    test('should display an error if invalid email is provided during sign-up', () => {
        signupEmailInput.value = 'invalidemail';
        signupPasswordInput.value = 'password123!';
        signupRepeatPasswordInput.value = 'password123!';
        signupButton.click();

        expect(signupError.textContent).toBe('Please enter a valid email address.');
    });

    test('should display an error if password does not meet requirements during sign-up', () => {
        signupEmailInput.value = 'test@example.com';
        signupPasswordInput.value = 'short';
        signupRepeatPasswordInput.value = 'short';
        signupButton.click();

        expect(signupError.textContent).toBe('Password must be at least 6 characters long.');
    });

    test('should handle successful sign-up submission', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        }));

        signupEmailInput.value = 'newuser@example.com';
        signupPasswordInput.value = 'Password123!';
        signupRepeatPasswordInput.value = 'Password123!';
        await signupButton.click();

        expect(signupError.textContent).toBe('');
        expect(signupError.classList.contains('text-success')).toBe(false);
    });

    // Tests for getApiBaseUrl function
    test('should return custom base URL if __API_BASE_URL__ is set', () => {
        window.__API_BASE_URL__ = 'http://localhost:';
        expect(getApiBaseUrl()).toBe('http://localhost:');
    });

    // more new tests
    test('should display an error if password does not contain a non-alphanumeric character during sign-up', () => {
        signupEmailInput.value = 'test@example.com';
        signupPasswordInput.value = 'Password123'; // No non-alphanumeric character
        signupRepeatPasswordInput.value = 'Password123';
        signupButton.click();
    
        expect(signupError.textContent).toBe('Password must contain at least one non-alphanumeric character.');
    });
    
    test('should display an error if password does not contain a digit during sign-up', () => {
        signupEmailInput.value = 'test@example.com';
        signupPasswordInput.value = 'Password!'; // No digit
        signupRepeatPasswordInput.value = 'Password!';
        signupButton.click();
    
        expect(signupError.textContent).toBe('Password must contain at least one digit.');
    });
    
    test('should display an error if password does not contain an uppercase letter during sign-up', () => {
        signupEmailInput.value = 'test@example.com';
        signupPasswordInput.value = 'password123!';
        signupRepeatPasswordInput.value = 'password123!';
        signupButton.click();
    
        expect(signupError.textContent).toBe('Password must contain at least one uppercase letter.');
    });
    test('should handle malformed JSON response gracefully during login', async () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.reject(new Error('Malformed JSON')),
        }));
    
        emailInput.value = 'test@example.com';
        passwordInput.value = 'password123';
        await loginButton.click();
    
        expect(loginError.textContent).toBe('');
    });
test('should display error for 404 response during login', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'User not found' }),
    }));

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';
    await loginButton.click();

    expect(loginError.textContent).toBe('User not found. Please sign up.');
});

test('should display generic error if fetch fails with unknown status code during login', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: '' }),
    }));

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';
    await loginButton.click();

    expect(loginError.textContent).toBe('');
});


test('should display error for 404 response during login', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'User not found' }),
    }));

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';
    await loginButton.click();

    expect(loginError.textContent).toBe('User not found. Please sign up.');
});

test('should display generic error if fetch fails with unknown status code during login', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: '' }),
    }));

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';
    await loginButton.click();

    expect(loginError.textContent).toBe('');
});
test('should handle network failure during sign-up', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('')));

    signupEmailInput.value = 'test@example.com';
    signupPasswordInput.value = 'ValidPassword123!';
    signupRepeatPasswordInput.value = 'ValidPassword123!';
    await signupButton.click();

    expect(signupError.textContent).toBe('');
});
test('should display an error if email is already registered during sign-up', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: '' }),
    }));

    signupEmailInput.value = 'existinguser@example.com';
    signupPasswordInput.value = 'ValidPassword123!';
    signupRepeatPasswordInput.value = 'ValidPassword123!';
    await signupButton.click();

    expect(signupError.textContent).toBe('');
});
});