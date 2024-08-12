// Bookcard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Bookcard = ({ book }) => {

  const navigate = useNavigate();
  const { volumeInfo } = book;
  const { id } = book;
  const { title, authors, publisher, imageLinks} = volumeInfo;


  const thumbnailSrc = imageLinks?.smallThumbnail || "default_thumbnail.jpg";

  // };

  return (
    <div className="book-card" id={id}>
      <img
        src={thumbnailSrc}
        alt={title}
        onClick={() => navigate(`/bookdetails/${id}`)}
      />
      <h3>{title}</h3>
      <p>Author: {authors}</p>
      <p>Publisher: {publisher}</p>

    </div>
  );
};

export default Bookcard;
