import React from 'react';
//Import bootstrap classes here
import { Navbar, Nav, NavDropdown, Table, Dropdown, DropdownButton, Offcanvas, Form, InputGroup, FormControl, Button, Container, Stack, Row, Col, ListGroup } from 'react-bootstrap';
//Import react stuff here
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

import axios from 'axios';


import './App.css';

//Import bootstrap icons here
import { FilePerson, ForwardFill, FilterCircle, Heart, HeartFill } from 'react-bootstrap-icons';

//https://react-bootstrap.github.io/docs/getting-started/introduction
//if you need help on how the react bootstrap code is written ^^


import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapContainer = ({ locations }) => {
  const mapStyles = {        
    height: "400px",
    width: "100%"};

  const defaultCenter = {
    lat: 22.3193, lng: 114.1694  // Default Hong Kong's coordinates
  }

  return (
     <LoadScript googleMapsApiKey="AIzaSyBJxvnMJMmvjnEuYPbvMIKwUTYp1ZKNArg">
       <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
       >
         {
           locations.map(item => {
             return (
               <Marker key={item.venueId}
                 position={{lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)}}
                 onClick={() => window.location.href=`/location/${item.venueId}`}
               />
             )
           })
         }
       </GoogleMap>
     </LoadScript>
  )
}

function Location() {
  //For the Index offcanvas menu
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleShow = () => setIsOpen(true);

  //For the Profile offcanvas menu
  const [profileIsOpen, setProfileIsOpen] = useState(false);
  const handleProfileClose = () => setProfileIsOpen(false);
  const handleProfileShow = () => setProfileIsOpen(true);

  //For the price filter dropdown
  const [priceFilterTitle, setPriceFilterTitle] = useState("Under");

  //For Index offcanvas table number of events sort
  const [indexData, setIndexData] = useState([]);



  const [venuesData, setVenuesData] = useState([]);

  // Fetching the processed data when the component loads
  useEffect(() => {
    axios.get('http://localhost:3001/update-data')
      .then(() => axios.get('http://localhost:3001/locations'))
      .then(response => {
        setVenuesData(response.data);
        setIndexData(response.data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  //Fetch locations data to show in index table
  /*useEffect(() => {
    fetch('http://localhost:3001/locations')
      .then(response => response.json())
      .then(data => setIndexData(data))
      .catch(error => console.error(error));
  }, []);*/
    //data here..
    //backend people link this to your database somehow


  const [indexNumberOfEventsSortConfig, setIndexNumberOfEventsSortConfig] = useState({ key: 'eventCount', direction: 'ascending' });
  const [indexSearchTerm, setIndexSearchTerm] = useState(''); 

  const sortedIndexData = [...indexData].sort((a, b) => {
    if (a[indexNumberOfEventsSortConfig.key] < b[indexNumberOfEventsSortConfig.key]) {
      return indexNumberOfEventsSortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[indexNumberOfEventsSortConfig.key] > b[indexNumberOfEventsSortConfig.key]) {
      return indexNumberOfEventsSortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredIndexData = sortedIndexData.filter(item => 
    item.venueNameE.toLowerCase().includes(indexSearchTerm.toLowerCase()));

  const handleIndexNumberOfEventsSort = (key) => {
    let direction = 'ascending';
    if (indexNumberOfEventsSortConfig.key === key && indexNumberOfEventsSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setIndexNumberOfEventsSortConfig({ key, direction });
  };  


  
  //by 1155174712
  const [isLoggedIn, setIsLoggedIn] = useState(false); //set initial state based on user authentication)
  const [isAdmin, setIsAdmin] = useState(false); //admin authentication)
  
  const handlePriceFilterSelect = (eventKey) => {
      setPriceFilterTitle(eventKey);
      //I don't have enough time to implement: fetch and display events based on the selected price filter
      
      
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
    };
    

  
  //By 1155189480
  //To fix the width of the offcanvas and take up entire screen at some point
  const [indexWidth, setIndexWidth] = useState();
  const [profileWidth, setProfileWidth] = useState();
  
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < window.screen.width * 0.35)
          setProfileWidth('100%');
        else
        setProfileWidth(window.screen.width * 0.35);
    
    if (window.innerWidth < window.screen.width * 0.75)
        setIndexWidth('100%');
    else
    setIndexWidth(window.screen.width * 0.75);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
    }, []);

    //To fetch location data by venueId
    const [locationData, setLocationData] = useState([]); //using for location
    const { venueId } = useParams();
    //   console.log(venueId);

    useEffect(() => {
        fetch(`http://localhost:3001/location/${venueId}`)
        .then(response => response.json())
        .then(data => setLocationData(data))
        .catch(error => console.error(error));
    }, [venueId]);

//Nav Bar Search based on back-end search-venues
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [navSearchResult, setNavSearchResult] = useState([]);

  const handleNavLinkClick = () => setNavSearchTerm('');

  useEffect(() => {
    if (navSearchTerm) {
        fetch(`http://localhost:3001/search-venues?keyword=${navSearchTerm}`)
            .then(response => response.json())
            .then(data => setNavSearchResult(data))
            .catch(error => console.error(error));
    } else {
        setNavSearchResult([]);
    }
  }, [navSearchTerm]);
  

  const [favourites, setFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/user/favorites')
        .then(response => response.json())
        .then(data => {
            setFavourites(data.favorites);
            setIsFavourite(data.favorites.includes(venueId));
        })
        .catch(error => console.error(error));
  }, []);

  const handleFavouriteClick = () => {
    const options = isFavourite
        ? { method: 'DELETE' }
        : { method: 'POST' };

    fetch(`http://localhost:3001/user/favorites/${venueId}`, options)
        .then(response => response.json())
        .then(data => {
            setFavourites(data.favorites);
            setIsFavourite(!isFavourite);
        })
        .catch(error => console.error(error));
  };

 //after login. if user not admin then return this:

  //should be logout instead of login, as user need auth. to view the content, when they see this page, they already login
  return (
    <div className="Location">

      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="ms-3" href="#" onClick={handleShow}>☰☰</Navbar.Brand>
        <Form inline className="me-auto" style={{width: "52%", minWidth: "250px", maxWidth: "600px"}}>
          <FormControl type="text" placeholder="Search" className="me-sm-2" value={navSearchTerm} onChange={e => setNavSearchTerm(e.target.value)}/>
          {/*Show the search result in a list after entering a keyword, click the location to navagate */}
          <ListGroup style={{ position: 'absolute', zIndex:10}}>
            {navSearchResult.map((result, index) => (
                <Link to={`http://localhost:3000/location/${result.venueId}`} key={index} onClick={handleNavLinkClick}>
                    <ListGroup.Item>{result.venueNameE}</ListGroup.Item>
                </Link>
            ))}
          </ListGroup>
        </Form>
        <Nav className="">
          <Button className="me-2" variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </Nav>
        <Nav className="">
          <Button className="me-3" variant="outline-dark" onClick={handleProfileShow}>
            <FilePerson size={24} />
          </Button>
        </Nav>
      </Navbar>

      <Offcanvas show={isOpen} onHide={handleClose} style={{width: indexWidth}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Index</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form className="d-flex mb-3">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={e => setIndexSearchTerm(e.target.value)}
            />
          </Form>
          Can someone help me add in the feature where if the window is sm or smaller then the offcanvas will take up the whole screen instead of 75%? Thanks.
          <Table hover striped>
            <thead>
              <tr>
                <th>Location</th>
                <th>
                  Number of Events &nbsp;
                  <FilterCircle size={24} onClick={() => handleIndexNumberOfEventsSort('events')}/></th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndexData.map((item, index) => (
                <tr key={index}>
                  <td>{item.venueNameE}</td>
                  <td>{item.eventCount}</td>
                  <td>
                    <Link to={`http://localhost:3000/location/${item.venueId}`} onClick={handleClose}>
                      <ForwardFill size={24} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={profileIsOpen} onHide={handleProfileClose} placement={'end'} style={{width: profileWidth}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>Username: (someone make it so that this will show their username please)</h5>
          <h3>Favourites</h3>
          {/* <p>List the favourites here</p> */}
          {/* Trying to create the favourite list, needed to be done */}
          <ListGroup>   
            {Array.isArray(favourites) && favourites.map((favourite, index) => (
                <ListGroup.Item key={index}>{favourite.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      <Stack direction="horizontal" gap={3}>
        <DropdownButton
          id="location-filter"
          variant="secondary"
          title="Location Filter"
          className="my-2 ms-3"
        >
          <Dropdown.Item href="#/action-1" active>Location 1 (change these)</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Location 2</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#/action-3">Location 3</Dropdown.Item>
          <Dropdown.Item href="#/action-4">Location 4</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="my-2 me-3" style={{maxWidth: "500px"}}>
          <InputGroup.Text>Price:</InputGroup.Text>
          <DropdownButton variant="secondary" title={priceFilterTitle} id="price-filter-dropdown" onSelect={handlePriceFilterSelect}>
            <Dropdown.Item eventKey="Under">Under</Dropdown.Item>
            <Dropdown.Item eventKey="Over">Over</Dropdown.Item>
            <Dropdown.Item eventKey="Exactly">Exactly</Dropdown.Item>
          </DropdownButton>
          <FormControl placeholder="$" aria-label="price-filter-input-field"/>
        </InputGroup>
      </Stack>
      
      <Container fluid>
          <MapContainer locations={venuesData} />
      </Container>
      <Container fluid className="mx-3 pb-4 bg-light">
          {locationData && locationData.venue && locationData.events && (
            <div>
              <h3 className="my-2 pt-2 fw-bold">{locationData.venue.venueNameE}</h3>
              <Button className="mx-3" variant="outline-danger" onClick={handleFavouriteClick} >
                 {isFavourite ? <HeartFill size={24} /> : <Heart size={24} />}
              </Button>
              <p>Description of location here</p>
              <p>someone set up the google maps api please</p>
              <p>Someone help me put the favorite icon in a better position^</p>
                {locationData.events.map((event, index) => (
                    <Container className="ms-3" key={index}>
                        <h4 className="mt-4 fw-bold">Events:</h4>
                        <Container className="ms-2">
                            <p>Title: {event.titleE}</p>
                            <p>Venue: {locationData.venue.venueNameE}</p>
                            <p>Date & Time: {event.date}</p>
                            <p>Description: {event.descriptionE}</p>
                            <p>Presenter: {event.presenterE}</p>
                            <p>Price: {event.price}</p>
                        </Container>
                    </Container>

                ))}
              <Container fluid>
                <Container fluid className="border bg-secondary text-light">
                  <Row>
                    <h4 className="my-2 fw-bold">Comments:</h4>
                    <p>This bg color kinda ugly ngl, and bootstrap color options kinda sucks</p>
                    <p>Maybe I'll change the color manually using css later</p>
                    <p>Everyone feel free to experiment and find a color u like :)</p>
                  </Row>
                </Container>
                
            
              </Container>
              
            </div>
          )}
      </Container>
    </div>
  );
}

export default Location;
