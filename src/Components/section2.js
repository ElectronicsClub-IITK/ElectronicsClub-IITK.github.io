import React, { useState } from "react";
import about_image from "./about_image.png";
import "./section2.css";

const Section2 = () => {
  const [showMore, setShowMore] = useState(false);

  const handleReadMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="about_body">
      <div className="heading">About Us</div>
      <div className="aboutflex">
        <div className="imageflex">
          <img className="aboutimage" src={about_image} alt="About" />
        </div>
        <div className="abouttext">
          Electronics Club, earlier started as a hobby group has now expanded into a students’ organisation with the objective of inculcating a spirit of developing innovative, cutting edge technology solutions to real life problems.
          <p className="greentext">
            We provide a platform to the students’ body where any individual with an idea can approach the club freely to grasp the necessary technical skills required to turn that idea into a reality.
          </p>
        </div>
      </div>
      {showMore && (
            <div>
              <p className="aboutheading">
              What We Provide
            </p>
            <p className="additionaltext">
            This is a place where students get an opportunity to think outside the academic curriculum and get practical experience by implementing and applying concepts learnt in various theoretical courses. We conduct a plethora of lectures, workshops, projects as well as competitions throughout the year concerning both analog as well as digital electronics keep the calendar busy and the participants, learning.
            </p>
            <p className="aboutheading">
            About our projects
            </p>
            <p className="additionaltext">
            Our summer projects are indeed a stepping stone for many freshers to develop interest in a particular field which help them in their future projects/internships/startups. We have not restricted ourselves to any specific domains but our branches span across various domains like embedded systems and IOT, VLSI, signal processing,ML and AI. Over the past few years, we have taken up various Industrial projects offered to us by well-known Indian research organisations like DRDO, BARC INDIA (Broadcast Audience Research Council), BETIC.
            </p>
            <p>
            <a href="/Projects"><button className="learnmore" >
               Learn More
              </button></a>
            </p>
            </div>
          )}
      <div className="readbutton">
        <button className="read_more_about" onClick={handleReadMoreClick}>
          {showMore ? "Read less" : "Read more"}
        </button>
      </div>
    </div>
  );
};

export default Section2;
