import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users/login', credentials);
      // localStorage.setItem('token', response.data.token); // Store the token
      localStorage.setItem('token', response.data.token); // Save the token to local storage
    } catch (error) {
      setError(error.response?.data?.message || 'An unknown error occurred.');
      // Handle login failure, e.g., showing an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username" />
      <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default Login;
