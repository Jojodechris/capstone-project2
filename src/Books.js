// Books

import React, { useState, useEffect, useCallback } from "react";
import Search from "./Search";
import Booklist from "./Booklist";
import Axios from "axios";
import "./Spinner.css";
import Message from "./Message";
import Noresults from "./Noresults";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("none");


  // const [heartStates, setHeartStates] = useState ({});
  
   // Initial sort option


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate an asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, []);

  useEffect(() => {
    console.log("Books after setting state:", books);
  }, [books]);

  // const [heartStates, setHeartStates] = useState ({});
  const saveToLocalStorage = (heartStates) => {
    // localStorage.setItem("favs", JSON.stringify(heartStates));
    localStorage.getItem("favs");
  };
  // useEffect(() => {
  //   localStorage.setItem("favs", JSON.stringify(heartStates));
  // }, [heartStates]);
  
  // // Load initial favorite states from localStorage
  // useEffect(() => {
  //   const savedStates = localStorage.getItem("favs");
  //   if (savedStates) {
  //     setHeartStates(JSON.parse(savedStates));
  //   }
  // }, []);

  const searchBook = useCallback(
    async (e) => {
      setIsLoading(true);
      e.preventDefault();
      saveToLocalStorage();
      // don't empty local storage
      // localStorage.getItem("favs");
  
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}&maxResults=40`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const items = data.items;
  
        if (Array.isArray(items)) {
          setBooks(items);
          console.log("Books after setting state:", items);
        } else {
          setBooks([]);
          console.log("Books after setting state: []");
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    [searchValue, isLoading]
  );


 

  
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  const cleanData = (data) => {
    return data.map((book) => {
      if (!book.volumeInfo.hasOwnProperty("publishedDate")) {
        book.volumeInfo.publishedDate = "0000";
      }
      if (!book.volumeInfo.hasOwnProperty("imageLinks")) {
        book.volumeInfo["imageLinks"] = {
          thumbnail: "https://vignette.wikia.nocookie.net/pandorahearts/",
        };
      }
      return book;
    });
  };

  const sortedBooks = useCallback(() => {
    // Sort books based on selected sort option
    if (sort === "Newest") {
      return books.sort((a, b) => {
        return parseInt(b.volumeInfo.publishedDate.substring(0, 4)) - parseInt(a.volumeInfo.publishedDate.substring(0, 4));
      });
    } else if (sort === "Oldest") {
      return books.sort((a, b) => {
        return parseInt(a.volumeInfo.publishedDate.substring(0, 4)) - parseInt(b.volumeInfo.publishedDate.substring(0, 4));
      });
    } else {
      // No sorting, return original array
      return books;
    }
  }, [books, sort]);

  return (
    <div>
      <Search search={searchBook} handleSearch={handleSearch} handleSort={handleSort} sort={sort} />
      <div>
        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : books.length > 0 ? (
          <Booklist books={{books}} /> // Use sortedBooks function for sorting
        ) : (
          <Noresults/>
        //   <div className="no-results">
         
        //  </div>
        )}
      </div>
    </div>
  );
};

export default Books;
