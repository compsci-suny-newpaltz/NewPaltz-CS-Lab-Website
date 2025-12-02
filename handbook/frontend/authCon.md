# AuthContext & AuthProvider

This file manages authentication state for the frontend application. It supports both legacy JWT authentication and SAML/SSO authentication via New Paltz Hydra.

## File: `client/src/context/authContext.jsx`

```jsx
import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import jwt_decode from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [samlUser, setSamlUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Check JWT token first (legacy admin login)
            const token = authService.getToken();
            if (token) {
                try {
                    const decoded = jwt_decode(token);
                    setUser(decoded);
                } catch (err) {
                    console.error("Invalid token:", err);
                    authService.logout();
                    setUser(null);
                }
            }

            // Also check SAML auth
            try {
                const response = await fetch(`${API_BASE_URL}/api/saml/me`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.authenticated) {
                    setSamlUser(data.user);
                    // If SAML user is admin, also set as main user
                    if (data.user.isAdmin && !token) {
                        setUser({
                            id: data.user.email,
                            username: data.user.name,
                            email: data.user.email,
                            role: 'admin',
                            isSamlUser: true
                        });
                    }
                }
            } catch (err) {
                console.error("SAML auth check error:", err);
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
        setSamlUser(null);
        if (samlUser) {
            const HYDRA_BASE_URL = import.meta.env.VITE_HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';
            window.location.href = `${HYDRA_BASE_URL}/logout`;
        }
    };

    const isAuthenticated = !!user || !!samlUser;
    const isAdmin = user?.role === 'admin' || samlUser?.isAdmin;

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            samlUser,
            setSamlUser,
            loading,
            logout,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};
```

---

## What This Does

### **1. Creates a global authentication context**
```jsx
export const AuthContext = createContext();
```
This allows any component to access authentication data.

---

### **2. Stores authentication-related state**
```jsx
const [user, setUser] = useState(null);
const [samlUser, setSamlUser] = useState(null);
const [loading, setLoading] = useState(true);
```
- `user` - Contains user data from JWT or SAML (unified)
- `samlUser` - Contains SAML-specific user data
- `loading` - Tracks whether auth validation is still running

---

### **3. Dual Authentication Check on Page Load**

The `useEffect` hook checks both authentication methods:

#### JWT Token Check (Legacy)
```jsx
const token = authService.getToken();
if (token) {
    const decoded = jwt_decode(token);
    setUser(decoded);
}
```
- Retrieves token from localStorage
- Decodes with `jwt-decode`
- Removes token if invalid

#### SAML Session Check
```jsx
const response = await fetch(`${API_BASE_URL}/api/saml/me`, {
    credentials: 'include'
});
const data = await response.json();
if (data.authenticated) {
    setSamlUser(data.user);
    // Auto-promote SAML admins
    if (data.user.isAdmin && !token) {
        setUser({
            id: data.user.email,
            username: data.user.name,
            email: data.user.email,
            role: 'admin',
            isSamlUser: true
        });
    }
}
```
- Calls `/api/saml/me` endpoint with cookies
- If authenticated via SAML, stores user data
- If SAML user is admin, creates a unified `user` object

---

### **4. Unified Logout Function**
```jsx
const logout = () => {
    authService.logout();       // Clear JWT
    setUser(null);
    setSamlUser(null);
    if (samlUser) {
        window.location.href = `${HYDRA_BASE_URL}/logout`;
    }
};
```
- Clears JWT token from localStorage
- Clears both user states
- If SAML user, redirects to Hydra logout

---

### **5. Computed Auth Properties**
```jsx
const isAuthenticated = !!user || !!samlUser;
const isAdmin = user?.role === 'admin' || samlUser?.isAdmin;
```
- `isAuthenticated` - True if user has any valid session
- `isAdmin` - True if user has admin privileges

---

### **6. Context Provider Values**
```jsx
<AuthContext.Provider value={{
    user,           // Unified user object
    setUser,        // Update user manually
    samlUser,       // SAML-specific data
    setSamlUser,    // Update SAML user
    loading,        // Auth initialization status
    logout,         // Logout function
    isAuthenticated,// Boolean
    isAdmin         // Boolean
}}>
```

---

## Using the AuthContext

### Basic Usage
```jsx
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Dashboard = () => {
    const { user, samlUser, logout, isAdmin } = useContext(AuthContext);

    const displayName = samlUser?.name || user?.username || 'User';

    return (
        <div>
            <h1>Welcome, {displayName}</h1>
            {isAdmin && <p>You have admin access</p>}
            <button onClick={logout}>Logout</button>
        </div>
    );
};
```

### Checking Auth Status
```jsx
const { loading, isAuthenticated, isAdmin } = useContext(AuthContext);

if (loading) return <p>Loading...</p>;
if (!isAuthenticated) return <p>Please log in</p>;
if (!isAdmin) return <p>Admin access required</p>;
```

### Protecting Routes
```jsx
const { user, samlUser, loading } = useContext(AuthContext);

useEffect(() => {
    if (!loading && !user && !samlUser?.isAdmin) {
        navigate('/admin-login');
    }
}, [user, samlUser, loading]);
```

---

## Authentication Priority

1. **JWT Token** - Checked first from localStorage
2. **SAML Session** - Checked via API call to `/api/saml/me`
3. **SAML Admin Auto-Promote** - If SAML user is admin and no JWT, creates unified `user`

This allows:
- Legacy admins to continue using username/password
- SSO users to log in without creating legacy accounts
- Both auth methods to work simultaneously

---

## Related Files

- `client/src/services/authService.js` - JWT token management
- `client/src/context/samlAuthContext.jsx` - Standalone SAML context
- `server/src/routes/samlAuthRoutes.js` - SAML API endpoints
- `server/src/middleware/samlAuth.js` - SAML verification middleware

See also: [SAML Integration Documentation](../authentication/saml-integration.md)
