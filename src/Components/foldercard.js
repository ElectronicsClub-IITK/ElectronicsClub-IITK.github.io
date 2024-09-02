import React, { useState } from 'react';
import './FolderCard.css';
import Database from './../database/database.json';

const FolderCard = () => {
  const [showMore, setShowMore] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredFolders, setFilteredFolders] = useState([]);

  const toggleShowMore = (folderIndex) => {
    setShowMore((prevState) => ({
      ...prevState,
      [folderIndex]: !prevState[folderIndex],
    }));
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();

    const filteredFolders = Database.Database.filter((folder) => {
      const folderNameMatch = folder.FolderName.toLowerCase().includes(searchQuery);
      const authorMatch = folder.Author.toLowerCase().includes(searchQuery);
      const descriptionMatch = folder.Description.toLowerCase().includes(searchQuery);
      const fileDisplayNamesMatch = folder.Files.some(
        (file) => file.DisplayName.toLowerCase().includes(searchQuery)
      );

      return folderNameMatch || authorMatch || descriptionMatch || fileDisplayNamesMatch;
    });

    setSearchText(searchQuery);
    setFilteredFolders(filteredFolders);
  };

  const foldersToDisplay = searchText ? filteredFolders : Database.Database;

  return (
    <div className='Center'>
      <div className='Searchbar'>
      <input
        type='text'
        placeholder='Type Arduino,Image Processing,...'
        value={searchText}
        onChange={handleSearch}
        className='search-bar'
      />
      </div>
      {foldersToDisplay.map((folder, index) => (
        <div key={index} className='foldercard'>
          <div className='Top'>
            <h4 className='folder-name'>{folder.FolderName}</h4>
            <h2 className='author'>Author: {folder.Author}</h2>
          </div>
          <p className='description'>Description: {folder.Description}</p>

          <div className='button'>
            <button onClick={() => toggleShowMore(index)} className='acc'>
              {showMore[index] ? 'Show Less' : 'Show More'}
            </button>
          </div>
          {showMore[index] && (
            <div className='files'>
              {folder.Files.map((file, fileIndex) => (
                <a key={fileIndex} href={file.Link} className='file-link'>
                  <div className='file'>
                    <h6 className='file-name'>
                      {fileIndex + 1}.{file.DisplayName}
                    </h6>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderCard;
