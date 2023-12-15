/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

import React from 'react';
//Import bootstrap classes here
import { Navbar, Nav, NavDropdown, Table, Dropdown, DropdownButton, Offcanvas, Form, InputGroup, FormControl, Button, Container, Stack, Row, Col, ListGroup } from 'react-bootstrap';
//Import react stuff here
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import axios from 'axios';


import './App.css';

//Import bootstrap icons here
import { FilePerson, ForwardFill, FilterCircle, Heart, HeartFill } from 'react-bootstrap-icons';

//https://react-bootstrap.github.io/docs/getting-started/introduction
//if you need help on how the react bootstrap code is written ^^


// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const MapContainer = ({ locations }) => {
//   const mapStyles = {        
//     height: "400px",
//     width: "100%"};

//   const defaultCenter = {
//     lat: 22.3193, lng: 114.1694  // Default Hong Kong's coordinates
//   }

//   return (
//      <LoadScript googleMapsApiKey="AIzaSyBJxvnMJMmvjnEuYPbvMIKwUTYp1ZKNArg">
//        <GoogleMap
//           mapContainerStyle={mapStyles}
//           zoom={13}
//           center={defaultCenter}
//        >
//          {
//            locations.map(item => {
//              return (
//                <Marker key={item.venueId}
//                  position={{lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)}}
//                  onClick={() => window.location.href=`/location/${item.venueId}`}
//                />
//              )
//            })
//          }
//        </GoogleMap>
//      </LoadScript>
//   )
// }

import { GoogleMap, MarkerF } from "@react-google-maps/api";

const MapContainer = ({ locations, selectedVenueCoords, navigate }) => {
  const mapStyles = {        
      height: "400px",
      width: "100%"
  };

  const defaultCenter = {
      lat: 22.3193, lng: 114.1694  // Default Hong Kong's coordinates
  };
  console.log(locations);
  return (
      <div>
          {window.google && (
              <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={selectedVenueCoords || defaultCenter}
              >
                  {locations.map(item => (
                      <MarkerF key={item.venueId}
                          position={{lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)}}
                          onClick={() => navigate(`/location/${item.venueId}`)}
                      />
                  ))}
              </GoogleMap>
          )}
      </div>
  );
};

// const getUserInfo = () => {
//   const userInfo = localStorage.getItem('userInfo');
//   return userInfo ? JSON.parse(userInfo) : null;
// };
// const userInfo = getUserInfo();
function Location() {
  
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [newComment, setNewComment] = useState('');
  useEffect(() => {
    // First, try to get userInfo from localStorage
    let storedUserInfo = localStorage.getItem('userInfo');

    // If not found in localStorage, try to get from sessionStorage
    if (!storedUserInfo) {
        storedUserInfo = sessionStorage.getItem('userInfo');
    }

    // If userInfo is found, update the state
    if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
    }
}, []);
  const [venueComments, setVenueComments] = useState([]);
  const [selectedVenueCoords, setSelectedVenueCoords] = useState(null);
  const navigate = useNavigate();

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
  //For collapsing the events when clicked
  const [collapseOpen, setCollapseOpen] = useState([]);

  const handleCollapseClick = (index) => {
    setCollapseOpen(prevOpen => {
      const newOpen = [...prevOpen];
      newOpen[index] = !newOpen[index];
      return newOpen;
    });
  }


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

const handleLocationFetch = () => {
  fetch(`http://localhost:3001/location/${venueId}`)
  .then(response => response.json())
  .then(data => setLocationData(data))
  .catch(error => console.error(error));
};
  
  //by 1155174712
  const [isLoggedIn, setIsLoggedIn] = useState(false); //set initial state based on user authentication)
  const [isAdmin, setIsAdmin] = useState(false); //admin authentication)
  
  const handlePriceFilterSelect = (eventKey) => {
    setPriceFilterTitle(eventKey);
    if (!priceInput || !locationData.venue.venueId) return;

    let queryUrl = `http://localhost:3001/events/price/${eventKey.toLowerCase()}/${priceInput}/${locationData.venue.venueId}`;

    fetch(queryUrl)
    .then(response => response.json())
    .then(filteredEvents => {
        setLocationData({ ...locationData, events: filteredEvents });
    })
    .catch(error => console.error('Error fetching filtered events:', error));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    navigate('/'); // Redirect to the login page
  };
    
  const handleAddComment = () => {
        // First, try to get userInfo from localStorage
        let token = localStorage.getItem('token');

        // If not found in localStorage, try to get from sessionStorage
        if (!token) {
          token = sessionStorage.getItem('token');
        }
    const commentData = {
      content: newComment,
      venueId: venueId
    };

    fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token // Include the token in the Authorization header
      },
      body: JSON.stringify(commentData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setNewComment('');
      // Refresh comments or update UI here
      fetchComments();
    })
    .catch(error => {
      if (error.name === "SyntaxError") {
        console.error("Response not in JSON format:", error);
      } 
      else {
        console.error('Error adding comment:', error);
      }
    });
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

  // useEffect(() => {
  //   fetch(`http://localhost:3001/venue/${venueId}/comments`)
  //       .then(response => response.json())
  //       .then(data => {
  //           setVenueComments(data); // Assuming you have a state variable for this
  //       })
  //       .catch(error => console.error('Error fetching comments:', error));
  // }, [venueId]);

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
    } 
    else {
      setNavSearchResult([]);
    }
  }, [navSearchTerm]);
  

  const [favourites, setFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const userId = userInfo.id; // Get user ID from userInfo
      fetch(`http://localhost:3001/user/favorites?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
        const isFav = data.favorites.some(favVenue => favVenue.venueId == venueId);
        setFavourites(data.favorites);
        setIsFavourite(isFav);
      })
      .catch(error => console.error(error));
    }
  }, [venueId, userInfo]);

  // const handleFavouriteClick = () => {
  //   const options = isFavourite
  //       ? { method: 'DELETE' }
  //       : { method: 'POST' };

  //   fetch(`http://localhost:3001/user/favorites/${venueId}`, options)
  //       .then(response => response.json())
  //       .then(data => {
  //           setFavourites(data.favorites);
  //           setIsFavourite(!isFavourite);
  //       })
  //       .catch(error => console.error(error));
  // };

  const handleFavouriteClick = () => {
    const userId = userInfo.id; // Retrieve user ID from userInfo
    const url = isFavourite 
      ? `http://localhost:3001/user/favorites/${venueId}?userId=${userId}`
      : `http://localhost:3001/user/favorites/${venueId}`;

    const options = {
      method: isFavourite ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId }) // Include user ID in the body for POST request
    };

    // For DELETE request, remove body
    if (isFavourite) delete options.body;

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      setFavourites(data.favorites);
      setIsFavourite(!isFavourite);
    })
    .catch(error => console.error(error));
  };

  const unfavoriteVenue = (venueId) => {
    const userId = userInfo.id;
    fetch(`http://localhost:3001/user/favorites/${venueId}?userId=${userId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
      setFavourites(data.favorites); // Update the state with the new favorites list
      setIsFavourite(false); // Update the favorite status
    })
    .catch(error => console.error(error));
  };

  const fetchComments = () => {
    // Check if venueId is valid before fetching comments
    if (!venueId || venueId === "") {
      console.log('No valid venueId provided');
      return; // Exit the function if venueId is not valid
    }

    fetch(`http://localhost:3001/venue/${venueId}/comments`)
    .then(response => response.json())
    .then(data => {
      setVenueComments(data);
    })
    .catch(error => console.error('Error fetching comments:', error));
  };

  useEffect(() => {
    fetchComments();
  }, [venueId]); // Fetch comments when venueId changes and is valid

  const [priceInput, setPriceInput] = useState('');
  useEffect(() => {
    // Check if priceInput is set, and locationData.venue exists and has a venueId
    if (!priceInput || !locationData.venue || !locationData.venue.venueId) return;

    let queryUrl = `http://localhost:3001/events/price/${priceFilterTitle.toLowerCase()}/${priceInput}/${locationData.venue.venueId}`;

    fetch(queryUrl)
        .then(response => response.json())
        .then(filteredEvents => {
            setLocationData({ ...locationData, events: filteredEvents });
        })
        .catch(error => console.error('Error fetching filtered events:', error));
}, [priceInput, priceFilterTitle, locationData.venue?.venueId]); // Use optional chaining for venueId

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
                    <Link
                      to={`http://localhost:3000/location/${item.venueId}`}
                      onClick={() => {
                        setSelectedVenueCoords({ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) });
                        handleClose();
                        handleLocationFetch();
                      }}>
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
          <h5>Username: {userInfo ? userInfo.username : 'Guest'}</h5>
          <h3>Favourites</h3>
          <ListGroup>
            {Array.isArray(favourites) && favourites.map((favourite, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {favourite.venueNameE} {/* Assuming venueNameE is the name field */}
                <Button variant="outline-danger" size="sm" onClick={() => unfavoriteVenue(favourite.venueId)}>
                  Unfavorite
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
      
      <Container fluid className='my-3'>
        <MapContainer locations={venuesData} selectedVenueCoords={selectedVenueCoords} navigate={navigate} />
      </Container>
      <Container fluid className="mx-3 pb-4 bg-light">
          {locationData && locationData.venue && locationData.events && (
            <div>
              <div style={{ display: 'flex', alignItems:'center' }}>
                <h2 className="my-2 pt-2 fw-bold">{locationData.venue.venueNameE}</h2>
                <Button className="mt-2 mx-3" variant="outline-danger" onClick={handleFavouriteClick} >
                  {isFavourite ? <HeartFill size={24} /> : <Heart size={24} />}
                </Button>
              </div>
              <h4 className="mt-4 fw-bold">Events:</h4>
              <Stack direction="horizontal" gap={3}>
                <InputGroup className="my-2 mx-3" style={{maxWidth: "500px"}}>
                  <InputGroup.Text className='fw-bold'>Price:</InputGroup.Text>
                  <DropdownButton variant="success" title={priceFilterTitle} id="price-filter-dropdown" onSelect={handlePriceFilterSelect}>
                    <Dropdown.Item eventKey="Under">Under</Dropdown.Item>
                    <Dropdown.Item eventKey="Over">Over</Dropdown.Item>
                    <Dropdown.Item eventKey="Exactly">Exactly</Dropdown.Item>
                  </DropdownButton>
                  <FormControl 
                    placeholder="$" 
                    aria-label="price-filter-input-field"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                  />
                </InputGroup>
              </Stack>
              {locationData.events.map((event, index) => (
                <Container className="mt-2 ms-3" key={index}>   
                  <Button className='fw-bolder'
                    variant="outline-success"
                    onClick={() => handleCollapseClick(index)}
                    aria-controls="collapse-text"
                    aria-expanded={collapseOpen[index]}
                  >
                    {event.titleE}
                  </Button>
                  {collapseOpen [index] && (
                    <Container className="ms-2">    
                      <p className='mt-2'><strong>Venue:</strong> {locationData.venue.venueNameE}</p>
                      <p><strong>Date & Time:</strong> {event.date}</p>
                      <p><strong>Description:</strong> {event.descriptionE}</p>
                      <p><strong>Presenter:</strong> {event.presenterE}</p>
                      <p><strong>Price:</strong> {event.price}</p>
                    </Container>
                  )}
                </Container>
              ))}
              <Container fluid className="mt-3 border bg-secondary text-light">
                <h2 className="mt-3 mb-2 fw-bold">Comments</h2>
                <hr />
                <Form className='ms-2'>
                  <Form.Group>
                    <Form.Label className='fw-bold'>Add a Comment: </Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={newComment} 
                      placeholder="Enter your comment here"
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button className="mt-2 mb-4 fw-bold" variant='success' onClick={handleAddComment}>Submit Comment</Button>
                </Form>
                <Row>
                  <h5 className="mt-2 ms-3">{venueComments.length} Comments</h5>
                  <hr />
                  {venueComments && venueComments.map(comment => (
                    <Row key={comment._id}>
                        <p className='ms-5'><strong>{comment.user.username}:</strong> {comment.content}</p>
                    </Row>
                  ))}
                </Row>
              </Container>
            </div>
          )}
      </Container>
    </div>
  );
}

export default Location;
