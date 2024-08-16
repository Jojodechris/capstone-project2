// front-end 
// CreateReview.js


import React, { useState,useEffect } from "react";
import axios from "axios";
import HomeNav from "./HomeNav";
import "./App.css";
import { API_BASE_URL } from "./Api";





function CreateReview({id}) {
  // console.log("createID",id)
//   const [rating, setRating] = useState(0);
const [reviews, setReviews] = useState([]);
const [newReview, setNewReview] = useState({ rating: 0, content: '' });
const [showReviews, setShowReviews] = useState(false);

//   const handleRatingChanged = (value) => {
//     setRating(value);
//   };
// useEffect(() => {

//   // Fetch reviews from the server
//   axios.get(`http://localhost:3001/reviews/${id}`)
//     .then(response => setReviews(response.data))
//     .catch(error => console.error('Error fetching reviews:', error));
// }, []);





  // const handleCommentChanged = (e) => {
  //   setComment(e.target.value);

  // };

  useEffect(() => {
    
    fetchreviews() 

},[])

  


    const fetchreviews = async () => {
      try {
        const allreviews = await fetch(`${API_BASE_URL}/reviews/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (!allreviews.ok) {
          throw new Error(`HTTP error! Status: ${allreviews.status}`);
        }
        const data = await allreviews.json();
        console.log("data",data);
        setReviews(data.reviews);
        // setReviews(data.reviews.map((review)=> (review.book_id) ) );
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
  
  //   fetchreviews();
  // }, []);
//   const deleteReview = (id) => {
//     // Filter reviews to exclude the one with the specified id
//     setReviews(reviews.filter((item) => item.id !== id));
//   };


  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log("id",id)
    // console.log("submitted")
    try {
      let response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookId: id, newReview }),
      });
      response=response.json()
      console.log(response.body, "responsebody")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchreviews()
      // console.log("submitted")
      // setReviews([...reviews, response.reviews]);
      // console.log("reviews",reviews)
      // console.log(response, "response")

      // console.log(response.reviews, "responseReviews")
      setNewReview({ rating: 0, content: '' });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };


  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewReview({ ...newReview, [name]: name === 'rating' ? parseInt(value, 10) : value });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    }));
  };

  const handleSeeReviews = (e) => {
    e.preventDefault()
    setShowReviews(true);

  };

  return (
    <div className="review-form">
      <HomeNav/>
      <h1>Review Book</h1>
      {showReviews && (
        <ul>
          {reviews.map((review) => (
      
            <li key={review}>
              <strong>Rating:</strong> {review.rating} stars - review:{review.content} from  user: {review.username}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="title">rate this book on a scale of 1 to 5 :</label>
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={newReview.rating}
          onChange={handleInputChange}
          min="1"
          max="5"
        />
        <br/>
        <label htmlFor="title">review this book:</label>
        <textarea
          name="content"
          placeholder="Review Content"
          value={newReview.content}
          onChange={handleInputChange}
        />
        <br/>
        <button type="submit">Add Review</button>
      </form>
      <button type="button" onClick={handleSeeReviews}>
        See reviews
      </button>
    </div>
    
  );
}

export default CreateReview;
