import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <>
      <nav className="sticky navbar">
    <div className="brand  display__logo">
      <a href="#top" className="nav__link">
        
        <span className="logo"><img src="logo.png" height={58} width={58}/> <p className="heading_name"> &nbsp; ELECTRONICS CLUB</p></span>
      </a>
    </div>
    <input type="checkbox" id="nav" className="hidden" />
    <label htmlFor="nav" className="nav__open">
      <i />
      <i />
      <i />
    </label>
    <div className="nav">
          <ul className="nav__items">
            <li className="nav__item">
              <Link to="/" id={isActive("/") ? "active" : ""} className="nav__link">
                Home
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Projects" id={isActive("/Projects") ? "active" : ""} className="nav__link">
                Projects
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Database" id={isActive("/Database") ? "active" : ""} className="nav__link">
                Database
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Articles" id={isActive("/Articles") ? "active" : ""} className="nav__link">
                Articles
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/RecentCompetitions" id={isActive("/RecentCompetitions") ? "active" : ""} className="nav__link">
                Recent Competitions
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Team" id={isActive("/Team") ? "active" : ""} className="nav__link">
                Team
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/Comp" id={isActive("/Comp") ? "active" : ""} className="nav__link">
                Get Components
              </Link>
            </li>
            <li className="nav__item">
               <Link to="/Challenge" id={isActive("/Challenge") ? "active" : ""} className="nav__link">
                 Monthly Challenge
                 </Link>
            </li>
            <li className="nav__item">
                 <Link to="/Leaderboard" id={isActive("/Leaderboard") ? "active" : ""} className="nav__link">
                   Leaderboard
                   </Link>
             </li>
            <li className="nav__item">
                 <Link to="/Gallery" id={isActive("/Gallery") ? "active" : ""} className="nav__link">
                   Gallery
                   </Link>
             </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;