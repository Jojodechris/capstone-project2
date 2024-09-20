import React, {useState, useEffect } from "react";
import { API_BASE_URL} from './Api';
import FavoriteBookCard from "./FavoriteBookCard";
// import axios from axios;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/displayfavorites`, {
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
        setFavorites(data.favorites);
        console.log("favs", favorites);
      } catch (error) {
        console.error(`Error! ${error}`);
      }
    };
  
    fetchFavorites();
  }, []);
  
  return (
    <div>
      <h2>Favorite Books</h2>
      <ul>
        {favorites && favorites.length > 0 ? (
          favorites.map((favorite) => (
            <FavoriteBookCard id={favorite.book_id} key={favorite.id} />
          ))
        ) : (
          <p>No favorite books available.</p>
        )}
      </ul>
    </div>
  );
};

export default Favorites;
