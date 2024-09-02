import React from "react";
import recent from "./recent.jpg"
import './section1.css';
import Recent from "./recent_activities";
const Section1 = () => {
       return(
       <div className="body">
       <p className="recent">
        Recent Activities
       </p>
       <Recent
        imageUrl={recent}
        eventName="Winter Camp"
        description="We are thrilled to wrap up an exhilarating winter camp where our team poured their knowledge into guiding and mentoring our enthusiastic Y23. From getting hands-on experience with circuits to diving into IoT, PCB, Computer Vision, and its applications, this camp was an immersive journey through the heart of electronics. Here's to the power of knowledge sharing, camaraderie, and igniting the passion for innovation! #electronics #eclub #tech #iitk #iit #eclub"
       />
       
      

    </div>
       )
}
export default Section1;