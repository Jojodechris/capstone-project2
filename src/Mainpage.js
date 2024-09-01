import React  from 'react';
import "./App.css"
import Header from "./Header";
import Books from "./Books";
import Axios from "axios";

import Footer from "./footer";


function Mainpage (){
return (
    <div>
        <Header />
        <h2 className="greet">hey  there </h2>
        {/* <h2 className="greet">hey  there, {password}!</h2> */}
        <p className="greet"> Welcome to our book library.</p>
        <Books />
        <Footer/>
    </div>
);
}
export default Mainpage