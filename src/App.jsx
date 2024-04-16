import React, { useState, useEffect } from "react";
import "./App.css";
import Backgroundf from "./Backgroundf";
import Navbar from "./Navbar";
import Heart from "./Heart";
import axios from "axios";

const favoritesPerPage = 4; //nombre des livres par page

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get("/api/favorites")
      .then(response => {
        const fetchedFavorites = response.data.map((item, index) => ({
          ...item,
          transform: (index % favoritesPerPage) * 30 // l'espace entre les livres
        }));
        setFavorites(fetchedFavorites);
        setTotalPages(Math.ceil(fetchedFavorites.length / favoritesPerPage));
      })
      .catch(error => {
        console.error("Error fetching favorites:", error);
      });
  }, []);

  function handleFavorite(bookId) {
    const newFavorites = favorites.map((item) => {
      return item.book_id === bookId
        ? { ...item, favorite_id: item.favorite_id === 1 ? 0 : 1 }
        : item;
    });
    setFavorites(newFavorites);
  }

  const handleRemoveBook = (bookId) => {
    const newFavorites = favorites
      .filter((item) => item.book_id !== bookId)
      .map((item, index) => ({
        ...item,
        transform: (index % favoritesPerPage) * 30 // l'espace
      }));
    setFavorites(newFavorites);
    setTotalPages(Math.ceil(newFavorites.length / favoritesPerPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <body>
      <div>
        <div>
          <Backgroundf />
        </div>
        <div className="Rectangle">
          <h1 className="Title">Favorites</h1>
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input placeholder="Search" type="search" className="input" />
          </div>
          <div>
            <Navbar />
          </div>
          <div className="Books">
            {favorites.length === 0 ? (
              <p className="noBooks">No favorite books yet.</p>
            ) : (
              favorites
                .slice(
                  (currentPage - 1) * favoritesPerPage,
                  currentPage * favoritesPerPage
                )
                .map((item, index) => (
                  <div
                    key={item.book_id}
                    className={`Booksbox${index + 1}`}
                    style={{ transform: `translateX(${item.transform}%)` }}
                  >
                    <div className={`Cadre${index + 1}`}>
                      <span className="BookTitle">{item.title}</span>
                    </div>
                    <div onClick={() => handleFavorite(item.book_id)}>
                      <Heart />
                    </div>
                    <div onClick={() => handleRemoveBook(item.book_id)}>
                      <Heart />
                    </div>
                  </div>
                ))
            )}
          </div>
          <div className="pagination">
            {currentPage > 1 && (
              <button className="prevButton" onClick={handlePrevPage}>
                Previous
              </button>
            )}
            {currentPage < totalPages && (
              <button className="nextButton" onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </body>
  );
}


