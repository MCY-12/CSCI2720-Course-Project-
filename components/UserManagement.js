import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      setError('Error deleting user');
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      {error && <p>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.email})
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
