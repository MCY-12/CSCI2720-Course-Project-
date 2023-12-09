import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

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

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/user/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <form>
        <label>Username:</label>
        <input type="text" name="username" value={newUser.username} onChange={handleInputChange} />
        <label>Password:</label>
        <input type="password" name="password" value={newUser.password} onChange={handleInputChange} />
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

export default UserManagement;
