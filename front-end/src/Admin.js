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

  useEffect(() => {
    fetchEvents();
    fetchUsers();
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

  // Component render
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Event Management</Card.Title>
          <Form>
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
                <Form.Control type="text" name="price" value={newEvent.price} onChange={handleInputEventChange} onChange={handleInputEventChange} />
              </Col>
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={handleCreateEvent}>
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
                    <Button variant="primary" onClick={() => handleUpdateEvent(event._id)}>Update</Button>
                    <Button variant="danger" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>User Management</Card.Title>
          <Form>
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
            <Button variant="success" className="mt-3" onClick={handleCreateUser}>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleUpdateUser(user._id)}>Update</Button>
                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
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
