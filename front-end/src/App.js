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
  //For the Index offcanvas menu
  // const [isOpen, setIsOpen] = useState(false);
  // const handleClose = () => setIsOpen(false);
  // const handleShow = () => setIsOpen(true);

  // //For the Profile offcanvas menu
  // const [profileIsOpen, setProfileIsOpen] = useState(false);
  // const handleProfileClose = () => setProfileIsOpen(false);
  // const handleProfileShow = () => setProfileIsOpen(true);

  // //For the price filter dropdown
  // const [priceFilterTitle, setPriceFilterTitle] = useState("Under");

  // //For Index offcanvas table number of events sort
  // const [indexData, setIndexData] = useState([]);

  // //Fetch locations data to show in index table
  // useEffect(() => {
  //   fetch('http://localhost:3001/locations')
  //     .then(response => response.json())
  //     .then(data => setIndexData(data))
  //     .catch(error => console.error(error));
  // }, []);
  //   //data here..
  //   //backend people link this to your database somehow


  // const [indexNumberOfEventsSortConfig, setIndexNumberOfEventsSortConfig] = useState({ key: 'eventCount', direction: 'ascending' });
  // const [indexSearchTerm, setIndexSearchTerm] = useState(''); 

  // const sortedIndexData = [...indexData].sort((a, b) => {
  //   if (a[indexNumberOfEventsSortConfig.key] < b[indexNumberOfEventsSortConfig.key]) {
  //     return indexNumberOfEventsSortConfig.direction === 'ascending' ? -1 : 1;
  //   }
  //   if (a[indexNumberOfEventsSortConfig.key] > b[indexNumberOfEventsSortConfig.key]) {
  //     return indexNumberOfEventsSortConfig.direction === 'ascending' ? 1 : -1;
  //   }
  //   return 0;
  // });

  // const filteredIndexData = sortedIndexData.filter(item => 
  //   item.venueNameE.toLowerCase().includes(indexSearchTerm.toLowerCase()));

  // const handleIndexNumberOfEventsSort = (key) => {
  //   let direction = 'ascending';
  //   if (indexNumberOfEventsSortConfig.key === key && indexNumberOfEventsSortConfig.direction === 'ascending') {
  //     direction = 'descending';
  //   }
  //   setIndexNumberOfEventsSortConfig({ key, direction });
  // };  


  // //by 1155174712
  // const [locationData, setLocationData] = useState([]); //not used
  // const { venueId } = useParams();
  // console.log(venueId);

  // useEffect(() => {
  //   fetch(`http://localhost:3001/location/${venueId}`)
  //     .then(response => response.json())
  //     .then(data => setLocationData(data))
  //     .catch(error => console.error(error));
  // }, [venueId]);

  // const [isLoggedIn, setIsLoggedIn] = useState(false); //set initial state based on user authentication)
  // const [isAdmin, setIsAdmin] = useState(false); //admin authentication)
  
  // const handlePriceFilterSelect = (eventKey) => {
  //   setPriceFilterTitle(eventKey);
  //   //I don't have enough time to implement: fetch and display events based on the selected price filter


  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   setIsAdmin(false);
  // };

  // // Render based on user authentication
  // const renderContent = () => {
  //   if (isLoggedIn) {
  //     if (isAdmin) {
  //       return (
  //         <div>
  //           <EventManagement />
  //           <UserManagement />
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div>
  //           <h1>User(Below done by James)</h1>
  //         </div>
  //       );
  //     }
  //   } else {
  //     // Render login form for non-authenticated user
  //     return (
  //       <div>
  //         <Login />
  //       </div>
  //     );
  //   }
  // };


  // //By 1155189480
  // //To fix the width of the offcanvas and take up entire screen at some point
  // const [indexWidth, setIndexWidth] = useState();
  // const [profileWidth, setProfileWidth] = useState();

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < window.screen.width * 0.35)
  //       setProfileWidth('100%');
  //     else
  //       setProfileWidth(window.screen.width * 0.35);

  //     if (window.innerWidth < window.screen.width * 0.75)
  //       setIndexWidth('100%');
  //     else
  //       setIndexWidth(window.screen.width * 0.75);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   handleResize();

  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);
  

 //after login. if user not admin then return this:

  //should be logout instead of login, as user need auth. to view the content, when they see this page, they already login
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

          <Route path="/EventManagement" element={<EventManagement />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/location/:venueId" element={<Location />} />
          <Route path="/location" element={<Location />} />
          <Route path="/" element={<Login />} />
          
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

