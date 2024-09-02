import React from "react";
import './section3.css';
import Card2 from "./Cards";

import "./section3.css"
const Section3 = () => {
       return(
       <>
       <p className="recent">
        Club Activities
       </p>
       <div className="horizontal23">
       
       <Card2
        imageUrl="project.jpg"
        heading="Projects"
        description="Every year Electronics club coducts projects during summer under Science and Techonology Council."
      />
      <Card2
        imageUrl="workshop.jpg"
        heading="Workshops"
        description="Various workshops are organised over the year to give a hands-on experience in various fields."
      />
      <Card2
        imageUrl="techkriti.jpg"
        heading="Techkriti"
        description="The club participates in the annual Technological and Entrepreneurial festival of IIT Kanpur."
      />
      
      <Card2
        imageUrl="takneek.jpg"
        heading="Takneek"
        description="A competition in which all the halls participate with one aim in mind, winning the coveted Takneek trophy."
      /> 
      <Card2
        imageUrl="wintercamp.png"
        heading="Winter Camp"
        description="Various workshops are organised over the year to give a hands-on experience in various fields."
      />
      <Card2
        imageUrl="lectures.jpg"
        heading="Lectures"
        description="Electronics club conducts lectures round the year covering various topics of electronics."
      />
      <div className="container">
  <div className="row">
    <div className="col">
      <iframe
        className="fb"
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Felectronicsclubiitk%2F&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
        title="Iframe"
      />
    </div>
    <div className="col">
      <iframe className="fb" src="HandBook.pdf" title="Iframe" />
    </div>
  </div>
</div>

       </div>
      
       </>
       )
}
export default Section3;