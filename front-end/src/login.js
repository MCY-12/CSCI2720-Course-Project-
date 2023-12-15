import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    axios.post('http://localhost:3001/login', { username, password })
    .then(response => {
        setMessage(response.data.message);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            setIsLoggedIn(true);
            if (response.data.user.isAdmin) {
                setIsAdmin(true);
                navigate('/admin'); // Navigate to Admin page for admins
            } else {
                navigate('/location'); // Navigate to Location page for regular users
            }
        } else {
            setError(true);
        }
    })
    .catch(error => {
        setError(true);
        const errorMessage = error.response?.data?.message || error.message;
        setMessage("Error during login: " + errorMessage);
    });
};


  
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      setMessage(response.data.message);
      // navigate('/login');
    } catch (err) {
      setError(true);
      setMessage("Error during registration: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
      <container fluid>
        <row>
          <h1 className='text-center fw-bold'>User Login</h1>
        </row>
        {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
        <row className='text-center'>
          <Form>
            {/* Username input */}
            <Form.Group className="mb-3" controlId="formBasicUsername">
              
                <Form.Label>Username:</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{textAlign: "center"}}
                />
              
            </Form.Group>

            {/* Password input */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{textAlign: "center"}}
              />
            </Form.Group>

            {/* Login register */}
            <Button className='mx-1' onClick={() => handleLogin(username, password)}>
              Login
            </Button>
            <Button className='mx-1' variant="primary" type="button" onClick={handleRegister}>
              Register
            </Button>
          </Form>
        </row>
      </container>
    </div>
  );
};

export default Login;

