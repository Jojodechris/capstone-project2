import Axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {useEffect} from  'react'
import "./login.css";
import LogsignHeader from './LogsignHeader';
import { API_BASE_URL } from './Api';


Axios.defaults.withCredentials=true;

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/login`, {
        username: username,
        password: password
      });

      // Check the response for successful login (customize according to your API)
      if (response.data.success) {
        alert(` successful!`)
        localStorage.setItem('userId', response.data.user.id);
        console.log("response",response);
        // Handle successful login, e.g., redirect to another page
        console.log('Login successful');
        navigate("/")
        
      } else {
        // Handle unsuccessful login
        setLoginError('Invalid useridname or password');
      }
    } catch (error) {
      console.error(error);
      setLoginError('Internal server error. Please try again later.');
    }
  };

  useEffect(()=>{
    Axios.get(`${API_BASE_URL}/login`).then ((response)=>{
      console.log(response)
  })
  },[])


  return (
    <div className="bigcontainer">
    <div>
    <LogsignHeader />
    <div className="form-container">
    <form className="form" onSubmit={handleLogin}>
    <h2 className="form-header">Login</h2>
    {loginError && <p className="error-message">{loginError}</p>}
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
      Login
    </button>
  </form>
</div>
</div>
<h1>people like book app</h1>
</div>
  );
}
 
export default LoginForm;
