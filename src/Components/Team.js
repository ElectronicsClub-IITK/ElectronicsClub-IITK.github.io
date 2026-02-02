// App.js
import React from 'react';

import './team.css';
import data from'../database/data.json'; // Your JSON data here
const Card = ({ title, items }) => {
  return (
    <div>
      <h2>{title}</h2>
      <div className="card-container">
        {items.map(item => (
          <div className="col-sm-6 col-lg-3" key={item.id}>
            <div className="box shadow-sm p-4">
              <div className="image-wrapper mb-3">
                <img className="img-fluid" src={item.image} alt="..." />
              </div>
              <div className="box-desc">
                <b><h4>{item.name}</h4></b>
                <h5>{item.vertical}</h5>

               <ul id="ul" className="social">
  <li>
    <a href={item.facebook} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-instagram"></i>
    </a>
  </li>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <li>
    <a href={`mailto:${item.email}`} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-envelope"></i>
    </a>
  </li>
</ul>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="card bg-light mb-3 mx-auto rounded-4 w-180" style={{ maxWidth: "80%" }}>
        <div className="card-body">
          <h3 className="card-title"><b>Meet Our Team</b></h3>
          <p className="card-text">
            You can access information about the current members of the Electronics Club team through the below links. From these links, you can find contact information for each team member, allowing you to reach out to the appropriate person based on your needs. This information can be helpful in connecting with the Electronics Club team and accessing their resources and support.
          </p>
        </div>
      </div>
      <Card title="Coordinators" items={data.coordi} />
      <Card title="Coordinators 24-25" items={data.pastcoordi} />
      <Card title="Secretaries" items={data.manager} />
    </>
      );
}

export default App;
export { Card };