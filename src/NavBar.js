// import React, { useState } from "react";
// import "./NavBar.css";
// import { NavLink } from "react-router-dom";
// import { Navbar, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
// import Search from "./Search";

// function NavBar() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <div className="float-container">
//       <Navbar expand="md">
//         <NavLink exact to="/" className="side">
//           Home <i className="bi bi-house"></i>
//         </NavLink>
//         <NavLink exact to="/favorites" className="side">
//           Favorite Books
//         </NavLink>
//         <Dropdown className="side" isOpen={dropdownOpen} toggle={toggleDropdown}>
//           <DropdownToggle nav caret>
//             Profile
//           </DropdownToggle>
//           <DropdownMenu className="Menu">
//             {/* Populate the dropdown items with your book categories */}
//             <DropdownItem className="options">
//               <div>
//                 <NavLink to="/category/Fiction">Edit info</NavLink>
//                 <NavLink to="/login">sign out </NavLink>
//               </div>
//             </DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//         <NavLink exact to="/likedbooks" className="side">
//           Most liked books
//         </NavLink>
//       </Navbar>
//     </div>
//   );
// }

// export default NavBar;
