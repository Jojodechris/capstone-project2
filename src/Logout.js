import React from 'react';
import { API_BASE_URL } from './Api';
import Footpage from './Footpage';
import Logoutform from './Logoutform';
import LogsignHeader from './LogsignHeader';
import Headerdesign from './Headerdesign';
import Footer from "./footer";


const Logout=()=>{
  
    return (
      <div>
        <LogsignHeader />
        <Headerdesign/>
        <div className='containerlog'>
        <Logoutform/>
        </div>
        <Footpage/>
        <Footer/>
      </div>
    );
  }
  
  export default Logout;