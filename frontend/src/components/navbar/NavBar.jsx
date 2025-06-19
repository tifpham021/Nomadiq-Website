import earthIcon from '../../assets/home-img/earth-icon.png';
import '../navbar/navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
     <a href="/">
         <img src={earthIcon} draggable="false" alt="earth-icon" className="earth-icon"/>
     </a>
      <div className="right">
        <a href = "#">Login</a>
        <a href = "#">Sign Up</a>
      </div>
    </div>
  );
};

export default Navbar;