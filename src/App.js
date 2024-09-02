import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from './Components/Team';
import Projects from './Components/Projects';
import Database from './Components/Database';
import Comp from './Components/Comp';
import Footer from './Components/Footer';
import Section1 from './Components/section1';
import Section2 from './Components/section2';
import Section3 from './Components/section3';
import Section4 from './Components/section4';
import Homefinal from './Components/homefinal';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homefinal/>}></Route>
          <Route path="/Projects" element={<Projects/>}></Route>
          <Route path="/Database" element={<Database/>}></Route>
          <Route path="/Team" element={<Team/>}></Route>
          <Route path="/Comp" element={<Comp/>}></Route>
        </Routes> 
      </Router>
      <br></br>
    <Footer/>
  </div>
  );
}

export default App;
