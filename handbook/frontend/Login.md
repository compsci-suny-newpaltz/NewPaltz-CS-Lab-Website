# pages/Login.jsx — Component Documentation

---

## Imports

### React Hooks
import { useState } from 'react';
- Imports React’s useState hook.
- Used to store and update the login form fields and error messages.

### React Router
import { useNavigate } from 'react-router-dom';
- Imports the useNavigate hook.
- Used to redirect the user after a successful login.

### Authentication Service
import authService from '../services/authService';
- Imports the authentication service.
- Handles API-based login actions such as: login(formData), validating credentials, and returning authentication results.

---

## Component Overview

### Login Component
The Login component renders the admin login page. It manages:
- User input
- Submitting login requests
- Error handling
- Navigation after login
- Local state for form data and errors

---

## State Variables

### Form Data
const [formData, setFormData] = useState({...});
- Stores username and password.
- Updated on each keystroke via handleChange().

### Error State
const [error, setError] = useState('');
- Stores any login error messages.
- Displayed above the form when authentication fails.

### Navigation Hook
const navigate = useNavigate();
- Used to redirect the user after successful login.

---

## Functions

### handleChange(e)
- Triggered whenever an input field changes.
- Extracts the field’s name and value.
- Updates only that specific field in formData.
- Ensures controlled input behavior.

### handleLogin(e)
- Called when the login form is submitted.
- Prevents default form submission.
- Sends formData to authService.login().
- On success:
  - Logs the result
  - Redirects to homepage with navigate('/')
  - Refreshes the window to load authenticated state
- On failure:
  - Logs the error
  - Displays an error message using setError()

---

## Export

export default Login;
- Makes the Login component available for routing and use in other files.
