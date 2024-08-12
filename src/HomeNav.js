import "./login.css";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';


function HomeNav(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowAboutInfo, setIsShowAboutInfo] = useState(false); // State for showing info

  const toggle = () => setIsOpen(!isOpen);

  const handleAboutClick = () => {
    setIsShowAboutInfo(!isShowAboutInfo); // Toggle info display on click
  };


    return (
      <div>
        <Navbar>
        <Navbar expand="md">
        <Nav className="me-auto" navbar>
          <NavbarBrand href="/">Right BOOK 4 you app </NavbarBrand>
          </Nav>
          </Navbar>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
          <Navbar expand="md">
          <Nav className="me-auto" navbar>
             <NavLink exact to="/profile" className="side">
                Profile
                </NavLink>
             <NavLink exact to="/likedbooks" className="side">
                Most liked books
                </NavLink>
                <NavLink exact to="/" className="side">
                Home <i className="bi bi-house"></i>
                </NavLink>
                <NavLink exact to="/favorites" className="side">
                Favorite Books
                </NavLink>
                <NavLink exact to="/logout" className="side">
                log out
                </NavLink>
             </Nav>
        
             {/* <NavbarBrand href="/">right book app</NavbarBrand> */}
             <NavbarBrand href="/"><i class="bi bi-journal-bookmark-fill"></i>
        <i class="bi bi-journal-richtext"></i></NavbarBrand>
        </Navbar>
        
          </Collapse>
        </Navbar>
        
      </div>
    );
  }
  
  export default HomeNav;