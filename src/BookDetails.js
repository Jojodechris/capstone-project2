// Bookdetails.js
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import Header from "./Header";
import Message from "./Message";
import Review from "./Review";
import CreateReview from "./CreateReview";




const BookDetails = () => {
  const [book, setBook] = useState({});
  const { id } = useParams();
  console.log(id,"id")

  const [isLoading, setIsLoading] = useState(true)
  const[isReviewing,setIsReviewing]=useState(false)
  const[rating,setRating]=useState(0)
  const [userReview, setUserReview] = useState({
    text: '',
    rating: 0,
  });
  




  useEffect(() => {
    setIsLoading(true)
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((res) => res.json())
      .then((res)=>{
      setBook(res);
      setIsLoading(false)
        console.log(res.data)
      })
      .catch((err) => console.log(err));
  }, [id]);
  console.log("idsss",id)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if(isReviewing){
    return(
      // e.preventDefault(),
      <div>
    {/* <BookDetails/> */}
    <div>
    <CreateReview id={id}/>
    {/* <textarea class="textBox largeTextBox reviewUserText js-reviewUserText"
    id="review_review_usertext" maxlength="18800" name="review[review]" 
    placeholder="Enter your review (optional)" 
    rows="12"></textarea>
    <br />
    Rating:
    <div class="star-rating">
    <input type="radio" id="star1" name="rating" value="1"></input>
    <label for="star2" onClick={() => setRating(1)}>☆</label>
    <input type="radio" id="star2" name="rating" value="2"></input>
    <label for="star2" onClick={() => setRating(2)}>☆</label>
    <input type="radio" id="star3" name="rating" value="3"></input>
    <label for="star3" onClick={() => setRating(3)}>☆</label>
    <input type="radio" id="star4" name="rating" value="4"></input>
    <label for="star4" onClick={() => setRating(4)}>☆</label>
    <input type="radio" id="star5" name="rating" value="5"></input>
    <label for="star5" onClick={() => setRating(5)}>☆</label>

</div> */}
    </div>
    {/* <button onClick={()=><Review/>}> Submit Review </button> */}
    </div>
    
    );
  }



  
  

  const { volumeInfo } = book;

  if (!volumeInfo) {
    return <Message/>
  }

  const authors = volumeInfo.authors || [];
  const publisher = volumeInfo.publisher || '';
  const title = volumeInfo.title || '';
  const imageLinks = volumeInfo.imageLinks || {};
  const description = volumeInfo.description || '';


  return (
    <div className="book-details">
      <Header/>
      <img src={imageLinks.smallThumbnail} alt={title} />
      <h3>{title}</h3>
      <p>Author: {authors}</p>
      <p>Publisher: {publisher}</p>
      <h2>Description</h2>
      <p>{description}</p>
      {/* when the user clicks on order book guide him on Amazon website to order that book */}
      <button onClick={() => window.location.href=`https://www.amazon.com/s?k=book+${title}`}>Order book</button>
      <button onClick={()=>setIsReviewing(true)}>Review book</button> 
      {/* on click display an area and stars to rate the book*/}
      
    </div>

  );
};

export default BookDetails;
