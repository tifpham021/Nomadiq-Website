import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/NavBar.jsx';
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homepage/HomePage.jsx';
import LoginPage from './pages/loginpage/LoginPage.jsx';
import SignUpPage from './pages/signuppage/SignUpPage.jsx';
import EmailResetPage from './pages/resetpages/EmailResetPage.jsx';
import PassResetPage from './pages/resetpages/PassResetPage.jsx';
function App() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/resetting-pass-email" || location.pathname.startsWith("/resetting-pass/");

  return (
      <>
    
      {!hideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetting-pass-email" element={<EmailResetPage />} />
        <Route path="/resetting-pass/:token" element={<PassResetPage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
      </>
  );
}

export default App;