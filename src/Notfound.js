// NotFound.js

import React from 'react';
import './Notfound.css'; // Import your CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! Page not found</p>
        <p>Looks like you're lost in the vastness of the internet.</p>
        {/* <img
          src="https://www.shutterstock.com/image-vector/404-error-page-explorer-man-260nw-2161180329.jpg" // Replace with your custom image URL
          alt="Lost astronaut"
        /> */}
        <p>Let's get you back on track!</p>
      </div>
    </div>
  );
};

export default NotFound;
