import React from "react";
import './section1.css';

const Recent = (props) => {
  const { imageUrl, eventName, description } = props;

  return (
    <div className="horizontal-section">
      <div>
        <p className="eventname">{eventName}</p>
      </div>
      <div className="horizontal">
        <div className="image-container">
          <img src={imageUrl} alt="Event" />
        </div>
        <div className="text-container">
          <p>{description}</p>
        </div>
        <div>
            <button className="read_more">
                Read More
            </button>
        </div>
      </div>

    </div>
  );
}

export default Recent;
