import React from 'react';
//Import bootstrap classes here
import { Navbar, Nav, NavDropdown, Table, Dropdown, DropdownButton, Offcanvas, Form, InputGroup, FormControl, Button, Container, Stack, Row, Col } from 'react-bootstrap';
//Import react stuff here
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

//import EventManagement from './EventManagement';
//import UserManagement from './UserManagement';
import Admin from './Admin';
import Login from './login';
import Location from './Location';

//Import bootstrap icons here
import { FilePerson, ForwardFill, FilterCircle, Heart, HeartFill } from 'react-bootstrap-icons';

//https://react-bootstrap.github.io/docs/getting-started/introduction
//if you need help on how the react bootstrap code is written ^^

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadGoogleMapsScript = () => {
    if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBJxvnMJMmvjnEuYPbvMIKwUTYp1ZKNArg&libraries=places`;
        script.async = true;
        document.head.appendChild(script);
    }
};

loadGoogleMapsScript();

useEffect(() => {
  // Define the function to be called when the window is about to be unloaded
  const handleBeforeUnload = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
  };

  // Assign the function to the onbeforeunload event
  window.onbeforeunload = handleBeforeUnload;

  // Clean up the event handler when the component unmounts
  return () => {
    window.onbeforeunload = null;
  };
}, []);

function HomeRoute({ setIsLoggedIn, setIsAdmin }) {
  const navigate = useNavigate();
  const tokenExists = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    // Perform the navigation in a useEffect hook
    if (tokenExists) {
      navigate('/location');
    }
  }, [navigate, tokenExists]); // Add dependencies to the dependency array of useEffect

  // If token doesn't exist, render the Login component
  if (!tokenExists) {
    return <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />;
  }

  // Return null while waiting for the useEffect to run
  return null;
}

  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

       {/* <Route path="/EventManagement" element={<ProtectedRoute> <EventManagement /> </ProtectedRoute>} />
<Route path="/UserManagement" element={<ProtectedRoute> <UserManagement /> </ProtectedRoute>} />*/}
<Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>} />
<Route path="/location/:venueId" element={<ProtectedRoute> <Location /> </ProtectedRoute>} />
<Route path="/location" element={<ProtectedRoute> <Location /> </ProtectedRoute>} />
<Route path="/" element={<HomeRoute setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

