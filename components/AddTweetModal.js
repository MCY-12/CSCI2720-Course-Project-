import React, { useState } from 'react';
import axios from 'axios';

const AddTweetModal = ({ onClose }) => {
  const [tweetContent, setTweetContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Retrieve token
      await axios.post('/api/messages', { content: tweetContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error posting tweet', error);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <textarea value={tweetContent} onChange={(e) => setTweetContent(e.target.value)} placeholder="What's happening?" />
        <button type="submit">Tweet</button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default AddTweetModal;
