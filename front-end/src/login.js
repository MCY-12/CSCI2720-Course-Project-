/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

import React, { useState } from 'react';
import { Container, Row, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleRememberMeChange = (e) => {
      setRememberMe(e.target.checked);
  };
  const handleLogin = (username, password) => {
    axios.post('http://localhost:3001/login', { username, password })
    .then(response => {
        setMessage(response.data.message);
        if (response.data.token) {
            // If 'Remember Me' is checked, use localStorage
            if (rememberMe) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            } else {
              // If not, use sessionStorage
              sessionStorage.setItem('token', response.data.token);
              sessionStorage.setItem('userInfo', JSON.stringify(response.data.user));
            }
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
      <Container fluid >
        <Row >
          <h1 className='text-center fw-bold'>User Login</h1>
        </Row>
        {message && <Alert variant={error ? 'danger' : 'success'}>{message}</Alert>}
        <Row className='text-center justify-content-center' md={4}>
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
              <Form.Check className='mx-auto' 
                type="checkbox" 
                label="Remember me" 
                checked={rememberMe} 
                onChange={handleRememberMeChange} 
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
        </Row>
      </Container>
     </div>
  );
};

export default Login;

