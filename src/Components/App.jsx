import React, { useState, useEffect } from "react";
import "./App.css";
import Backgroundf from "./Backgroundf";
import Navbar from "./Navbar";
import Heart from "./Heart";
import axios from "axios";
import SearchBar from "./SearchBar";

const favoritesPerPage = 4; //nombre des livres par page

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get("/api/favorites")
      .then((response) => {
        const fetchedFavorites = response.data.map((item, index) => ({
          ...item,
          transform: (index % favoritesPerPage) * 30, // l'espace entre les livres
        }));
        setFavorites(fetchedFavorites);
        setTotalPages(Math.ceil(fetchedFavorites.length / favoritesPerPage));
      })
      .catch((error) => {
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
        transform: (index % favoritesPerPage) * 30, // l'espace
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
          <SearchBar />
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
                <a
                  key={item.book_id}
                  href={`/book/${item.book_id}`}
                  className="bookLink"
                >
                  <div
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
                </a>
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
    </body>
  );
}
