import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); //remove if no need

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      if (response.data.user) {
        setIsLoggedIn(true);
        if (response.data.user.isAdmin) {
          setIsAdmin(true);
        }
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password, email });
      console.log(response.data.message);
      // plz add redirect the user to the login page after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <Form>
        {/* Username input */}
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        {/* Password input */}
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/* Login register */}
        <Button variant="primary" type="button" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="primary" type="button" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Login;
