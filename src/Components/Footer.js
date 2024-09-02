import React from 'react';
const Footer = () => {
    return (
        <>
        <>
  {/* Footer */}
  <footer className="text-center text-lg-start bg-black text-muted">
    {/* Section: Social media */}
    <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom" style={{color:"#acce46"}}>
      {/* Left */}
      <div className="me-5 d-none d-lg-block">
        <span>Get connected with us on social networks:</span>
      </div>
      {/* Left */}
      {/* Right */}
      <div>
        <a href="https://www.facebook.com/electronicsclubiitk" className="me-4 link-secondary">
          <i className="fa fa-facebook-f" />
        </a>
        <a href="https://youtube.com/@electronicsclub" className="me-4 link-secondary">
          <i className="fa fa-youtube" />
        </a>
        <a href="https://www.instagram.com/electronicsclub.iitk/" className="me-4 link-secondary">
          <i className="fa fa-instagram" />
        </a>
        <a href="https://in.linkedin.com/company/electronics-club-iit-kanpur" className="me-4 link-secondary">
          <i className="fa fa-linkedin" />
        </a>
        <a href="https://github.com/eclubiitk" className="me-4 link-secondary">
          <i className="fa fa-github" />
        </a>
      </div>
      {/* Right */}
    </section>
    {/* Section: Social media */}
    {/* Section: Links  */}
    <section className="">
      <div className="container text-center text-md-start mt-5" style={{color:"#acce46"}}>
        {/* Grid row */}
        <div className="row mt-3">
          {/* Grid column */}
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            {/* Content */}
            <h6 className="text-uppercase fw-bold mb-4">
              <i className="fa fa-gem me-3 text-secondary" />
              ELECTRONICS CLUB, IIT KANPUR
            </h6>
            <p>
            This is a place where students get an opportunity to think outside the academic curriculum and get practical experience by implementing and applying concepts learnt in various theoretical courses.
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
            <p>
              <a href="/Projects" className="text-reset">
                Projects
              </a>
            </p>
            <p>
              <a href="/Database" className="text-reset">
                Database
              </a>
            </p>
            <p>
              <a href="/Team" className="text-reset">
                Team
              </a>
            </p>
            <p>
              <a href="/Comp" className="text-reset">
                Get Components
              </a>
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
            <p>
            < a className="text-reset" href='https://maps.app.goo.gl/7KecUz57uZVgfD1R8'><i className="fa fa-map-marker me-3 text-secondary" /> Hall 3, IIT KANPUR</a>
            </p>
            <p>
            < a className="text-reset" href='mailto:eclub.iitk@gmail.com'><i className="fa fa-envelope me-3 text-secondary" />
              eclub.iitk@gmail.com</a>
            </p>
            <p>
            < a className="text-reset"href='https://www.instagram.com/electronicsclub.iitk/'><i className="fa fa-instagram me-3 text-secondary" />
              electronicsclub.iitk</a>
            </p>
        
          </div>
          {/* Grid column */}
        </div>
        {/* Grid row */}
      </div>
    </section>
    {/* Section: Links  */}
    {/* Copyright */}
    <div
      className="text-center p-4"
      style={{ backgroundColor: "rgb(172, 206, 70)", color:"black" }}
    >
      © 2024 Copyright:
      &nbsp;&nbsp;&nbsp;<a className="text-reset" href="/">
          EClub IIT KANPUR
      </a>
    </div>
    {/* Copyright */}
  </footer>
  {/* Footer */}
</>

        </>
    );
};
export default Footer;