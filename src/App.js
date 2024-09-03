// App.js
import React from "react";
import "./App.css";
import {  Route,Routes } from 'react-router';
import { BrowserRouter } from "react-router-dom";
import BookDetails from "./BookDetails";
import Home from "./Home";
import SignupForm from "./SignupForm";
import LoginForm from './LoginForm'
import Favorites from "./Favorites";
import AppContextProvider from "./appContext";
import MostLiked from "./MostLiked";
import Logout from "./Logout";
import NotFound from "./Notfound";
import UpdateProfileForm from "./UpdateProfile";
import Mainpage from "./Mainpage";
import axios from 'axios';

axios.defaults.withCredentials = true

const App = () => {

  return (
    <div className="App">

        <BrowserRouter>
        <Routes>
        <Route exact path = "/bookdetails/:id" element={<BookDetails/>} />
    

        <Route exact path = "/" element={<Home/>} /> 

        <Route exact path = "/app" element={<Mainpage/>} />

        <Route exact path = "/signup" element={<SignupForm/>} />


        <Route exact path = "/login" element={<LoginForm/>} />


        <Route exact path = "/favorites" element={<Favorites/>} />


        <Route exact path = "/likedbooks" element={<MostLiked/>} />


        <Route exact path = "/logout" element={<Logout/>} />

        <Route exact path = "/Profile" element={<UpdateProfileForm/>} />

        <Route exact path = "*" element={<NotFound/>} />
        </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
