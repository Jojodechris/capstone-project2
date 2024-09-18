import "./login.css";
import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';


function Example(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShowAboutInfo, setIsShowAboutInfo] = useState(false); // State for showing info

  const toggle = () => setIsOpen(!isOpen);

  const handleAboutClick = () => {
    setIsShowAboutInfo(!isShowAboutInfo); // Toggle info display on click
  };


    return (
      <div>
        <Navbar {...args}>
          <NavbarBrand href="/">Right book 4 you 
          App </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
            <NavLink onClick={handleAboutClick}>
                About us
              </NavLink>
              {isShowAboutInfo && ( // Conditionally render info
                <div className="about-info">
                  {/* Place your "About us" information here */}
                  <p className="blabla">Welcome to right book 4 you, your one-stop shop for all things books!We're passionate about the power of storytelling and the joy of finding the perfect book for every reader.</p>
                  <p>Mission:Here at right book for you, we believe that everyone deserves to experience the magic of books. We strive to make book discovery, ordering, and reviewing a seamless and enjoyable experience for users of all ages and interests.</p>
                  <p>How we do?</p>
                    <ul>
                    <li>Extensive Book Database: We offer a comprehensive database of books, encompassing various genres, authors, and publication dates.</li>
                    <li>User-Friendly Search: Our intuitive search tools help you find your next favorite read by filtering by genre, author, title, and other criteria.</li>
                    <li>Streamlined Ordering: Enjoy a hassle-free ordering process, allowing you to purchase books directly through our platform.</li>
                    <li>Engaging Review System: Share your thoughts and experiences with other readers through our user-friendly review system.</li>
                    </ul>
                </div>
              )}
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                 our book categories
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>phylosophy</DropdownItem>
                  <DropdownItem>History</DropdownItem>
                  <DropdownItem>Geography</DropdownItem>
                  <DropdownItem>biology</DropdownItem>
                  <DropdownItem>religion</DropdownItem>
                  <DropdownItem>sports</DropdownItem>
                  <DropdownItem>movies</DropdownItem>
                  <DropdownItem>Business</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* <NavbarText>Simple Text</NavbarText>  */}
          </Collapse>
        </Navbar>
      </div>
    );
  }
  
  export default Example;