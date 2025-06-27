import Axios from "axios";
import React, { useState } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import "./login.css";
import LogsignHeader from "./LogsignHeader";
import { API_BASE_URL } from "./Api";
import Noresults from "./Noresults";

Axios.defaults.withCredentials = true;

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/login`, {
        username: username,
        password: password,
      });

      // Check the response for successful login (customize according to your API)
      if (response.data.success) {
        alert(` successful!`);
        // localStorage.setItem('userId', response.data.user.id);
        console.log("response", response);
        // Handle successful login, e.g., redirect to another page
        console.log("Login successful");
        navigate("/");
      } else {
        // Handle unsuccessful login
        setLoginError("Invalid useridname or password");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Invalid username or password");
    }
  };

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/login`, { withCredentials: true })
      .then((response) => {
        console.log("Session check:", response.data);
      })
      .catch((error) => {
        console.error("Session check failed:", error);
      });
  }, []);

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
            <p className='textsignup'>Are you a new user? <Link to="/signup">signup</Link></p>
          </form>
          {/* <Noresults/> */}
        </div>
        {/* <Noresults/> */}
      </div>
    </div>
  );
}

export default LoginForm;
