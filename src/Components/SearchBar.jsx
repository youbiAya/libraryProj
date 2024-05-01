import React, { useState } from "react";
import axios from "axios";

export default function SearchBar({ setBooks }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`/api/books/search?q=${query}`);
      setBooks(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const KeyWords = [
    'Cruel Prince',
    'The Hobbit',
    'Harry Potter',
    'Silent Patient',
    'It Ends With Us',
    'Alice In Wonderland',
    'Surrounded By Idiots',
    'The Rich Father',
    'The Kite Runner',
    'Gone Girl',
    'The Book Thief',
    'Normal People',
    'Atomic Habbits',
    '1984',
    'All The Light We Cannot See',
    'The Lord Of Rings',
    'A Little Life',
    'Iron Flame',
    'If You Tell',
    'Off The Air',
    'What Grows In The Dark'
  ];

  const filteredResults = KeyWords.filter((keyword) =>
    keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Search-box">
      <div className="row">
        <input
          placeholder="Search"
          type="text"
          id="input-box"
          autoComplete="off"
          value={searchQuery}
          onChange={handleChange}
        />
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      {searchQuery && (
        <div className="result-box">
          <ul>
            {filteredResults.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
