import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from './Api';
// import "bootstrap-icons/font/bootstrap-icons.css";
// import NavBar from "./NavBar";
// import HomeNav from "./HomeNav";

const Logoutform = () => {

      const navigate = useNavigate();
    // const Logout = () => {
        const handleLogout = async () => {
          try {
          
            // Make a request to the server to clear the session
            const response = await fetch(`${API_BASE_URL}/logout`, {
              method: 'POST',
              credentials: 'include', 
            });
      
            if (response.ok) {
              // Redirect to the login page or perform any other actions after successful logout
              navigate('/login');
            } else {
              // Handle error (e.g., show an error message)
              console.error('Logout failed');
            }
          } catch (error) {
            console.error('Error during logout:', error);
          }
        };
  return (
    <div className="logoutcontainer">
        <h1>Logout</h1>
        <div className="btnlogout">
        <button onClick={()=> navigate("/")}>Naah it was a mistake</button>
        <button onClick={handleLogout} >Yes log me out </button>
        </div>
    </div>
  );
};
export default Logoutform;