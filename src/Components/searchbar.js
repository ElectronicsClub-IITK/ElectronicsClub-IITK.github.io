import React, { useState } from 'react';
//import './SearchBar.css'; // Import CSS file for styling

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const elementsWithText = document.querySelectorAll(':not(script):not(style)');
    const results = [];

    elementsWithText.forEach((element) => {
      const text = element.innerText.toLowerCase();
      if (text.includes(searchTerm.toLowerCase())) {
        const links = element.querySelectorAll('a');
        if (links.length > 0) {
          links.forEach((link) => {
            const linkText = link.textContent.trim();
            if (linkText.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                text: linkText,
                href: link.href,
              });
            }
          });
        }
      }
    });

    setSearchResults(results);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <p>{result.text}</p>
                <a href={result.href} target="_blank" rel="noopener noreferrer">
                  {result.href}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
