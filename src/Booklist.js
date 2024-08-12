// front-end booklist.js

import React, { useState, useEffect } from "react";
import { useAppContext } from "./appContext";
import Bookcard from "./Bookcard";

const Booklist = ({ books }) => {
  console.log("Books in Booklist:", books);
  
  
  // console.log(books);
  const { favorites, addToFavorites, removeFromFavorites } = useAppContext();


  const [heartStates, setHeartStates] = useState (false); 
  const [favorited, setFavorited] = useState([]);


  // useEffect(() => {
  //   localStorage.setItem("favs", JSON.stringify(heartStates));
  // }, [heartStates]);

  

  useEffect(() => {
    const fetchFavorited = async () => {
      try {
        const response = await fetch("https://capstone-project2-pt29.onrender.com/displayfavorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
  
        const data = await response.json();
        console.log("data", data);
        setFavorited(data.favorites.map((favorite)=> (favorite.book_id) ) );
        
        console.log("favs",data.favorites);
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
  
    fetchFavorited();
  }, []);
  


  const toggleHeartClass = async (id) => {
    const isFavorite = !heartStates[id]; // Calculate new favorite state
    setHeartStates({ ...heartStates, [id]: isFavorite }); // Update single state entry

    const userId=localStorage.getItem('userId');
    try {
      const response = await fetch("https://capstone-project2-pt29.onrender.com/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookId: id, isFavorite:isFavorite})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data",data);

      // Update local favorites state based on server response
      // (assuming server is authoritative)
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert local state change if API call fails
      setHeartStates({ ...heartStates, [id]: !isFavorite }); // Undo state update
    }
  };

  return (
    <div className="list">
      {books.books.map((book, i)=> (
        <div key={i}>
          <Bookcard book={book} />
          {/* send to the backdend heartStates[book.id] to see if it's a favorite.*/}  

          <span
            id={heartStates[book.id] || (favorited.includes(book.id))  ? "like" : "unlike"}
            className={heartStates[book.id] || (favorited.includes(book.id)) ? "bi bi-heart-fill" : "bi bi-heart"}
            onClick={() => toggleHeartClass(book.id)}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Booklist;
