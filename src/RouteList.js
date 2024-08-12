// RouteList.js

import {
    Routes,
    Route,
    Navigate
  } from 'react-router-dom';
  import BookDetails from './BookDetails';
  import Home from './Home';

  
  function RouteList() {

    return (
      <Routes>
        <Route
          path="/"
          element={<Home/>}
        />
  
        {/* <Route
          path="/:id"
          element={<BookDetails/>} /> */}

        {/* <Route
          path="/profile"
          element={< Profile profile ={profile} />}
        />   */}
        {/* <Route
          path="/*"
          element={ <navigate to="/" />}
        /> */}
      </Routes>
    );
  }
  
  export default RouteList;
  
  
