import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventManagement = () => {
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

  useEffect(() => {
    fetchEvents();
  }, []);

  //read
  const fetchEvents = async () => {
    try {
      const response = await axios.get('/admin/showevents');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  //create
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

  //update
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

  //delete
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/admin/showevent/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
      <h2>Event Management</h2>
      <form>
        <label>Event ID:</label>
        <input type="text" name="EventId" value={newEvent.EventId} onChange={handleInputChange} />
        <label>Title:</label>
        <input type="text" name="titleE" value={newEvent.titleE} onChange={handleInputChange} />
        <label>Venue ID:</label>
        <input type="text" name="venueId" value={newEvent.venueId} onChange={handleInputChange} />
        <label>Date:</label>
        <input type="text" name="date" value={newEvent.date} onChange={handleInputChange} />
        <label>Description:</label>
        <input type="text" name="descriptionE" value={newEvent.descriptionE} onChange={handleInputChange} />
        <label>Presenter:</label>
        <input type="text" name="presenterE" value={newEvent.presenterE} onChange={handleInputChange} />
        <label>Price:</label>
        <input type="text" name="price" value={newEvent.price} onChange={handleInputChange} />

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
    </div>
  );
};

export default EventManagement;
