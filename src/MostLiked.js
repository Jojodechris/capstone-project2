import React, { useState, useEffect } from "react";
import MostLikedCard from "./MostLikedCard";
// import axios from axios;


// const getData=()=>{
//   const savedStates = localStorage.getItem("mstliked");
//   if (savedStates) {
//     return JSON.parse(savedStates);
//   }else{
//     return  [];
//   }
// }



const MostLiked = () => {
  const [mostLiked, setMostLiked] = useState([]);


  // Use a centralized state management solution like Redux for more complex applications
  // Efficiently store heart states for all books


  // useEffect(() => {
  //   localStorage.setItem("mstliked", JSON.stringify(mostLiked));
  // }, [mostLiked]);
  

  useEffect(() => {
    const fetchMostFavorites = async () => {
      try {
        const response = await fetch("https://capstone-project2-pt29.onrender.com/likedBooks", {
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
        setMostLiked(data.books);
        console.log("mostLiked",mostLiked);
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
  
    fetchMostFavorites();
  }, []);
  
  return (
    <div>
      <h2>Favorite Books</h2>
      <ul>
        {mostLiked && mostLiked.length > 0 ? (
          mostLiked.map((liked) => (
            <MostLikedCard id={liked} key={liked} />
          ))
        ) : (
          <p>Most liked books not available yet.</p>
        )}
      </ul>
    </div>
  );
};

export default MostLiked;
