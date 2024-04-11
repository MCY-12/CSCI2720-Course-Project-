import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');  // State to store the error message

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear any existing errors
    try {
      await axios.post('/api/users/signup', userData);
      // Handle successful signup, e.g., redirect or update UI
  } catch (error) {
      setError(error.response?.data?.message || 'An unknown error occurred.');
  }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" />
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
