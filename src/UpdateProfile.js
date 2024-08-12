// UpdateProfileForm component 

import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./login.css";
import LogsignHeader from './LogsignHeader';

function UpdateProfileForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    try {
      const response = await Axios.put('https://capstone-project2-pt29.onrender.com/update-profile', {
        username: username, 
        password: password
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
  
      if (response.data.message) {
        setUpdateStatus('Profile updated successfully.');
      } else {
        setUpdateStatus('Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
    }
  };






  

  return (
    <div className="bigcontainer">
      <LogsignHeader />
      <div className="form-container">
        <form className="form" onSubmit={handleUpdateProfile}>
          <h2 className="form-header">Update Profile</h2>
          <div className="error-message">{updateStatus}</div>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              className="form-input"
              type="text"
              value={username}
              autoComplete="on"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              value={password}
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="form-button" type="submit">
            Update Profile
          </button>
        </form>
        <p>Back to <Link to="/">Home</Link></p>
      </div>
    </div>
  );
}

export default UpdateProfileForm;
