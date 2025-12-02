import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/authContext';

const HYDRA_BASE_URL = import.meta.env.VITE_HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';

const Login = () => {
  const { user, samlUser, loading, isAdmin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-redirect if already authenticated as admin
  useEffect(() => {
    if (!loading && (user || (samlUser && samlUser.isAdmin))) {
      navigate('/admin-panel');
    }
  }, [user, samlUser, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response);
      navigate('/admin-panel');
      window.location.reload();
    } catch (err) {
      console.error('Login Error:', err.message);
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleSSOLogin = () => {
    window.location.href = `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(window.location.origin + '/admin-panel')}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-stone-800">Admin Login</h1>

        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* SSO Login Button - Primary */}
        <button
          onClick={handleSSOLogin}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Sign in with New Paltz SSO
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or use legacy login</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium text-stone-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Login with Username
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          Staff and whitelisted users can use SSO to access the admin panel directly.
        </p>
      </div>
    </div>
  );
};

export default Login;
