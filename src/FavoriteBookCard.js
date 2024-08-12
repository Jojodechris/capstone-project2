import React, { useState, useEffect } from "react";
import Bookcard from "./Bookcard";
import BookDetails from "./BookDetails";
import Axios from "axios";



const FavoriteBookCard = ({ id }) => {
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true);
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((res) => res.json())
      .then((res) => {   
        setBook(res);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]); // Run this effect only once when the component mounts

  return (
    <div>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <Bookcard book={book}/>
      )}
    </div>
  );
};

export default FavoriteBookCard;
