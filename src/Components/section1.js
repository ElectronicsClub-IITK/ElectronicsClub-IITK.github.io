import React, { useState, useEffect } from "react";
import recent from "./recent.jpg"
import './section1.css';
import Recent from "./recent_activities";

const SHEET_ID = "1kjMgQEFPqU8fOqCGaBUk75AQ_4ZymVfo8AwQNh0KpO8";
const API_KEY = "AIzaSyB0KLQPuV6Ud6-d8e_dP-68ODNU_F2ULGA";
const RANGE = "Sheet1!A2:D";

// Static recent activities to always show, as requested
const staticActivities = [];

const Section1 = () => {
   const[activities, setActivities] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
          );
          const data = await response.json();
          console.log("Fetched data:", data);
          if (data.values) {
            const formatted = data.values.map((row) => ({
              eventName: row[0],
              imageUrl: row[1],
              description: row[2],
              link: row[3],
            }));
            setActivities(formatted);
          }
        } catch (error) {
          console.error("Error fetching sheet data:", error);
        }
      };
  
      fetchData();
    }, []);

       return(
       <div className="body">
       <p className="recent">
        Recent Activities
       </p>
       <div className="scroll-container">
        {[...staticActivities, ...activities].map((activity, index) => (
            <Recent
              key={index}
              eventName={activity.eventName}
              imageUrl={activity.imageUrl}
              description={activity.description}
              link={activity.link}
            />
          ))}
      </div>
    </div>
       )
}
export default Section1;