import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
// import NavBar from "./NavBar";
import Example from "./LogsignNav";


const LogsignHeader = () => {
  return (
    <div >
    <header>
      
      <h1>
        {" "}
        Right book 4 you <i class="bi bi-journal-bookmark-fill"></i>
        <i class="bi bi-journal-richtext"></i>
      </h1>
      {/* <LogsignNavbar/> */}
    </header>
    <Example />
    {/* <Home /> */}
    </div>
  );
};
export default LogsignHeader;
