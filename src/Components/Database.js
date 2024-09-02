import React from 'react';
import FolderCard from './foldercard';
import "./Database.css"
const Database = () => {
    
  return (
    <>
    <div className="background-container">
      <div className="background-image" />
      <div className="text-container1">
        <h1>Resources</h1>
        <p>This page contains all the resources we could gather from the previous webpage.  <br></br>Please make best use of it.<br></br> For any contributions please mail us on eclub.iitk@gmail.com.</p>
      </div>
    </div>
    <FolderCard />
    </>
  );

};
export default Database;