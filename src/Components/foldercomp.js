// FolderComponent.jsx
import React, { useState } from 'react';
import './FolderComponent.css'; // Import CSS file for styling

const FolderComponent = ({ folderName, folderContents }) => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const toggleFolder = () => {
    setIsFolderOpen(!isFolderOpen);
  };

  return (
    <div className="folder-container">
      <div onClick={toggleFolder} className="folder-name">
        {folderName}
      </div>
      {isFolderOpen && (
        <div className="folder-contents">
          {folderContents.map((content, index) => (
            <div key={index} className="file">
              {content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderComponent;
