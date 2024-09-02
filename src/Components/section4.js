import React from "react";
import './section1.css';
import { Card } from "./Team";
import data from'../database/data.json';
const Section4 = () => {
       return(
       <div className="dark">
       <div className="body">
       <p className="recent" style={{ color: 'white' }}>
        Our Team
       </p>
      <p>
        <br/><br/>
      <Card title="Coordinators" items={data.coordi} />
      </p>
    </div>
    <a href="./Team"><button className="learnmore"style={{ color: 'white', marginTop:'20px' }} >
               Know Our Full Team
              </button></a>
    </div>
       )
}
export default Section4;