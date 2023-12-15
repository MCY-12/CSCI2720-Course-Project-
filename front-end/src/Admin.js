// Admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



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
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/'); // Redirect to the login page
  };


  // Event management methods
  // Read
  const fetchEvents = async () => {
    try {
      const response = await axios.get('/admin/showevents');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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
      await axios.post('/admin/showevent', newEvent);
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
      console.error('Error creating event:', error);
    }
  };


  // Update
  const handleUpdateEvent = async (eventId) => {
    try {
      await axios.put(`/admin/showevent/${eventId}`, newEvent);
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
      console.error('Error updating event:', error);
    }
  };

  // Delete
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/admin/showevent/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // User management methods
  // Read
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      await axios.post('/admin/user', newUser);
      fetchUsers();
      setNewUser({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Update
  const handleUpdateUser = async (userId) => {
    try {
      await axios.put(`/admin/user/${userId}`, newUser);
      fetchUsers();
      setNewUser({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/user/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Component render
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h2>Event Management</h2>
      <form>
        <label>Event ID:</label>
        <input type="text" name="EventId" value={newEvent.EventId} onChange={handleInputEventChange} />
        <label>Title:</label>
        <input type="text" name="titleE" value={newEvent.titleE} onChange={handleInputEventChange} />
        <label>Venue ID:</label>
        <input type="text" name="venueId" value={newEvent.venueId} onChange={handleInputEventChange} />
        <label>Date:</label>
        <input type="text" name="date" value={newEvent.date} onChange={handleInputEventChange} />
        <label>Description:</label>
        <input type="text" name="descriptionE" value={newEvent.descriptionE} onChange={handleInputEventChange} />
        <label>Presenter:</label>
        <input type="text" name="presenterE" value={newEvent.presenterE} onChange={handleInputEventChange} />
        <label>Price:</label>
        <input type="text" name="price" value={newEvent.price} onChange={handleInputEventChange} />

        <button type="button" onClick={handleCreateEvent}>
          Create Event
        </button>
      </form>
      <table>
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
                <button type="button" onClick={() => handleUpdateEvent(event._id)}>
                  Update
                </button>
                <button type="button" onClick={() => handleDeleteEvent(event._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <h2>User Management</h2>
      <form>
        <label>Username:</label>
        <input type="text" name="username" value={newUser.username} onChange={handleInputUserChange} />
        <label>Password:</label>
        <input type="password" name="password" value={newUser.password} onChange={handleInputUserChange} />
        <button type="button" onClick={handleCreateUser}>
          Create User
        </button>
      </form>
      <table>
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
                <button type="button" onClick={() => handleUpdateUser(user._id)}>
                  Update
                </button>
                <button type="button" onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
