import React from 'react';
//Import bootstrap classes here
import { Navbar, Nav, NavDropdown, Table, Dropdown, DropdownButton, Offcanvas, Form, InputGroup, FormControl, Button, Container, Stack, Row, Col } from 'react-bootstrap';
//Import react stuff here
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

//import axios from 'axios';

import './App.css';

import EventManagement from './EventManagement';
import UserManagement from './UserManagement';
import Login from './login';
import Location from './Location';

//Import bootstrap icons here
import { FilePerson, ForwardFill, FilterCircle, Heart, HeartFill } from 'react-bootstrap-icons';

//https://react-bootstrap.github.io/docs/getting-started/introduction
//if you need help on how the react bootstrap code is written ^^

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

          <Route path="/EventManagement" element={<EventManagement />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/location/:venueId" element={<Location />} />
          <Route path="/location" element={<Location />} />
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

