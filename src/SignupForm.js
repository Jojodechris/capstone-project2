import Axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./login.css";
import LogsignHeader from './LogsignHeader';
import { API_BASE_URL } from './Api';


function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [signupStatus, setSignupStatus] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
    setIsInvalid(value === '');
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isInvalid) {
      // Display feedback when input fields are blank
      setSignupStatus('Fields cannot be blank.');
      return;
    }

    try {
      const response = await Axios.post(`${API_BASE_URL}/signup`, formData);
      console.log(response);
      if (response.data.message) {
        // send a feedback to the user to let him know he successfully signed up
        alert(`Signup successful! You can now login ${formData.username}.`);
        setFormData({ username: '', password: '' });
        navigate('/login');
      } else {
        setSignupStatus('Failed to sign up.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bigcontainer">
      <LogsignHeader />
      <div className="form-container">
        <form className="form" onSubmit={handleSignup}>
          <h2 className="form-header">Signup</h2>
          <div className="error-message">{signupStatus}</div>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              className="form-input"
              type="text"
              name="username"
              value={formData.username}
              autoComplete="on"
              onChange={handleChange}
            />
          </div>
          {isInvalid && <div className="invalid-feedback">Username cannot be blank☹️.
</div>}
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              autoComplete="on"
              onChange={handleChange}
            />
          </div>
          {isInvalid && <div className="invalid-feedback ">Password cannot be blank☹️.</div>}
          <button className="form-button" type="submit">
            Signup
          </button>
        </form>
        <p className='textsignup'>Already a user? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default SignupForm;
