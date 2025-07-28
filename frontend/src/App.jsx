import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/NavBar.jsx';
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homepage/HomePage.jsx';
import LoginPage from './pages/loginpage/LoginPage.jsx';
import SignUpPage from './pages/signuppage/SignUpPage.jsx';
import EmailResetPage from './pages/resetpages/EmailResetPage.jsx';
import PassResetPage from './pages/resetpages/PassResetPage.jsx';
import NavbarLoggedIn from './components/navbar/NavBar-LoggedIn.jsx';
import React, { useState, useEffect } from 'react';
import LoggedInHomePage from './pages/homepage/LoggedInHomePage.jsx';
import PlanningPage from './pages/planningPages/planningPage.jsx';
import WeatherPage from './pages/planningPages/weatherPage.jsx';
import ItineraryPage from './pages/planningPages/itineraryPage.jsx';
import MapPage from './pages/planningPages/mapPage.jsx';

function App() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/resetting-pass-email" || location.pathname.startsWith("/resetting-pass/");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user:", storedUser);
    setUser(storedUser);
  }, [location]);
  return (
      <>
    
      {!hideNavAndFooter && (user ? <NavbarLoggedIn setUser={setUser}/> : <Navbar/>)}
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetting-pass-email" element={<EmailResetPage />} />
        <Route path="/resetting-pass/:token" element={<PassResetPage />} />
        <Route path="/logged-in-home-page" element={<LoggedInHomePage />} />
        <Route path="/choose-destination-dates" element={<PlanningPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/plan-itinerary" element={<ItineraryPage />} />
        <Route path="/itinerary-map" element={<MapPage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
      </>
  );
}

export default App;