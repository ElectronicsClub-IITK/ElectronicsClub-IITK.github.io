import React from "react";
import "./section3.css"
const Card2 = ({ imageUrl, heading, description }) => {
    return (
      <div className="card2">
        <img
          src={imageUrl}
          alt="Card"
          className="image"
        />
        <div className="content">
          <h2 className="head2">{heading}</h2>
          <p className="description2">
            {description}
          </p>
        </div>
      </div>
    );
  };
  
  // Export the Card component
  export default Card2;