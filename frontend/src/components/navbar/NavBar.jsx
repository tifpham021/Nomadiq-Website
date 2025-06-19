import earthIcon from '../../assets/home-img/earth-icon.png';
import '../navbar/navbar.css';
import React, {useState} from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
     <a href="/">
         <img src={earthIcon} draggable="false" alt="earth-icon" className="earth-icon"/>
     </a>

     <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      
      <div className={`right ${menuOpen ? 'open' : ''}`}>
        <a href = "#">Login</a>
        <a href = "#">Sign Up</a>
      </div>
  
    </nav>
  );
};

export default Navbar;