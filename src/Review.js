// Review.js

import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import EachReview from './EachReview';
import CreateReview from './CreateReview';

Axios.defaults.withCredentials = true;

const Review = (comment) => {

  // const deleteReview = (id) => {
  //   // Filter reviews to exclude the one with the specified id
  //   setReviews(reviews.filter((item) => item.id !== id));
  // };

  return (
    <div>
      {comment.length > 0 ? (
        comment.map((item, index) => (
          <EachReview
            key={index}
            review={item}

            // handleDelete={() => deleteReview(item.id)}
            
          />
        ))
      ) : (
        <p>No reviews yet</p>
      )}
    </div>
  );
}

export default Review;
