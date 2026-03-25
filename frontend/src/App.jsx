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
import FlightTrackerPage from "./pages/planningPages/flightTrackerPage.jsx";
import FlightsTransportationPage from "./pages/planningPages/flightsTransportationPage.jsx";
import AccomodationsPage from "./pages/planningPages/accomodationsPage.jsx";
import ActivitiesExperiencesPage from "./pages/planningPages/activitiesExperiencesPage.jsx";
import ProfilePage from "./pages/planningPages/profilePage.jsx";
import LearnMorePage from "./pages/planningPages/learnMorePage.jsx";
import PackingListPage from "./pages/planningPages/packingListPage.jsx";
import PackingListDetailPage from "./pages/planningPages/packingListDetailPage.jsx";
import OutfitSuggestionsPage from "./pages/planningPages/outfitSuggestionsPage.jsx";
import OutfitFavoritesPage from "./pages/planningPages/outfitFavoritesPage.jsx";

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
      {!hideNavAndFooter &&
        (user ? <NavbarLoggedIn setUser={setUser} /> : <Navbar />)}
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
        <Route path="/track-flight" element={<FlightTrackerPage />} />
        <Route path="/flights-transportation" element={<FlightsTransportationPage />} />
        <Route path="/accomodations" element={<AccomodationsPage />} />
        <Route path="/activities-experiences" element={<ActivitiesExperiencesPage />} />
        <Route path="/my-account" element={<ProfilePage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/packing-list" element={<PackingListPage />} />
        <Route path="/packing-list/:categoryKey" element={<PackingListDetailPage />} />
        <Route path="/outfit-suggestions" element={<OutfitSuggestionsPage />} />
        <Route path="/outfit-suggestions/favorites" element={<OutfitFavoritesPage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
