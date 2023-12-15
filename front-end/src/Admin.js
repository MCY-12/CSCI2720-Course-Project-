/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';

const Admin = () => {
  // State for events
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    EventId: '',
    titleE: '',
    venueId: '',
    date: '',
    descriptionE: '',
    presenterE: '',
    price: '',
  });

  // State for users
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });

  // State for venues
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({
    venueId: '',
    venueNameE: '',
    latitude: '',
    longitude: '',
  });


  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchVenues();
  }, []);


  const navigate = useNavigate();

  const handleLogout = () => {
    //setIsLoggedIn(false);
    //setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    navigate('/'); // Redirect to the login page
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Token from storage:", token); // for debugging
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      console.error("Token not found in storage");
      return {};
    }
  };




  // Event management methods
  // Read
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/showevents', { headers: getAuthHeader() });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
    }
  };

  const handleInputEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  // Create
  const handleCreateEvent = async () => {
    try {
      await axios.post('http://localhost:3001/admin/showevent', newEvent, { headers: getAuthHeader() });
      fetchEvents();
      setNewEvent({
        EventId: '',
        titleE: '',
        venueId: '',
        date: '',
        descriptionE: '',
        presenterE: '',
        price: '',
      });
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
    }
  };


  // Update
  const handleUpdateEvent = async (eventId) => {
    try {
      await axios.put(`http://localhost:3001/admin/showevent/${eventId}`, newEvent, { headers: getAuthHeader() });
      fetchEvents();
      setNewEvent({
        EventId: '',
        titleE: '',
        venueId: '',
        date: '',
        descriptionE: '',
        presenterE: '',
        price: '',
      });
    } catch (error) {
      console.error('Error updating event:', error.response?.data || error.message);
    }
  };

  // Delete
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/showevent/${eventId}`, { headers: getAuthHeader() });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
    }
  };

  // User management methods
  // Read
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/users', { headers: getAuthHeader() });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  const handleInputUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Create
  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:3001/admin/user', newUser, { headers: getAuthHeader() });
      fetchUsers();
      setNewUser({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
    }
  };

  // Update
  const handleUpdateUser = async (userId) => {
    try {
      await axios.put(`http://localhost:3001/admin/user/${userId}`, newUser, { headers: getAuthHeader() });
      fetchUsers();
      setNewUser({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
    }
  };

  // Delete
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/user/${userId}`, { headers: getAuthHeader() });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
    }
  };

  // Venues
  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admin/shows', { headers: getAuthHeader() });
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };
  const handleInputVenueChange = (e) => {
    const { name, value } = e.target;
    setNewVenue((prevVenue) => ({
      ...prevVenue,
      [name]: value,
    }));
  };
  const handleCreateVenue = async () => {
    try {
      await axios.post('http://localhost:3001/admin/show', newVenue, { headers: getAuthHeader() });
      fetchVenues();
      setNewVenue({
        venueId: '',
        venueNameE: '',
        latitude: '',
        longitude: '',
      });
    } catch (error) {
      console.error('Error creating venue:', error);
    }
  };
  const handleUpdateVenue = async (venueId) => {
    try {
      await axios.put(`http://localhost:3001/admin/show/${venueId}`, newVenue, { headers: getAuthHeader() });
      fetchVenues();
      setNewVenue({
        venueId: '',
        venueNameE: '',
        latitude: '',
        longitude: '',
      });
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };
  const handleDeleteVenue = async (venueId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/show/${venueId}`, { headers: getAuthHeader() });
      fetchVenues();
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };





  // Component render
  return (
    <Container fluid className="py-4">
      <Row className="mb-2">
        <Col className='d-flex justify-content-end'>
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </Col>
        <Col className=''>
          <h3 className='fw-bold'>Admin Page</h3>
        </Col>
      </Row>
      <hr />

      <Card className="mb-4">
        <Card.Body>
          <Card.Title className='fw-bold fs-3'>Event Management</Card.Title>
          <Form className='pt-3 ps-3'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Event ID:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="EventId" value={newEvent.EventId} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Title:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="titleE" value={newEvent.titleE} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Venue ID:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="venueId" value={newEvent.venueId} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Date:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="date" value={newEvent.date} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Description:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="descriptionE" value={newEvent.descriptionE} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Presenter:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="presenterE" value={newEvent.presenterE} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Price:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="price" value={newEvent.price} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Button variant="success" className="mt-3 fw-bold" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Title</th>
                <th>Venue ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Presenter</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.EventId}</td>
                  <td>{event.titleE}</td>
                  <td>{event.venueId}</td>
                  <td>{event.date}</td>
                  <td>{event.descriptionE}</td>
                  <td>{event.presenterE}</td>
                  <td>{event.price}</td>
                  <td>
                    <Button variant="primary" className="mb-1" onClick={() => handleUpdateEvent(event._id)}>Update</Button>
                    <Button variant="outline-danger" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title className='fw-bold fs-3 pb-2'>User Management</Card.Title>
          <Form className='ms-3'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Username:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="username" value={newUser.username} onChange={handleInputUserChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Password:</Form.Label>
              <Col sm={10}>
                <Form.Control type="password" name="password" value={newUser.password} onChange={handleInputUserChange} />
              </Col>
            </Form.Group>
            <Button variant="success" className="mt-2 fw-bold" onClick={handleCreateUser}>
              Create User
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button variant="primary" className="me-1" onClick={() => handleUpdateUser(user._id)}>Update</Button>
                    <Button variant="outline-danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title className='fw-bold fs-3'>Venue Management</Card.Title>
          <Form className='pt-3 ps-3'>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Venue ID:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="venueId" value={newVenue.venueId} onChange={handleInputVenueChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Venue Name:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="venueNameE" value={newVenue.venueNameE} onChange={handleInputVenueChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Latitude:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="latitude" value={newVenue.latitude} onChange={handleInputVenueChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>Longitude:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" name="longitude" value={newVenue.longitude} onChange={handleInputVenueChange} />
              </Col>
            </Form.Group>
            <Button variant="success" className="mt-3 fw-bold" onClick={handleCreateVenue}>
              Create Venue
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Venue ID</th>
                <th>Name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr key={venue._id}>
                  <td>{venue.venueId}</td>
                  <td>{venue.venueNameE}</td>
                  <td>{venue.latitude}</td>
                  <td>{venue.longitude}</td>
                  <td>
                    <Button variant="primary" className="mb-1" onClick={() => handleUpdateVenue(venue._id)}>Update</Button>
                    <Button variant="outline-danger" onClick={() => handleDeleteVenue(venue._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
