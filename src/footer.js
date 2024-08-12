import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
    <p>Right book for you</p>
    <ul>
      <li>
        <a href="/">
        <i class="bi bi-facebook"></i>
        </a>
      </li>
      <li>
        <a href="/">
        <i class="bi bi-twitter"></i>
        </a>
      </li>
      <li>
        <a href="/">
          <i className="bi bi-linkedin"></i>
        </a>
      </li>
      <li>
        <a href="#">
          <i className="bi bi-instagram"></i>
        </a>
      </li>
    </ul>
  </footer>
);
};

export default Footer;
