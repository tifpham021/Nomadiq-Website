import earthIcon from '../../assets/home-img/earth-icon.png';
import '../navbar/navbarLoggedIn.css';
import React, {useEffect, useRef, useState} from 'react';
import downArrow from '../../assets/home-img/down-arrow.png';
import upArrow from '../../assets/home-img/up-arrow.png';
import pin from '../../assets/home-img/nb-pin.png';
import building from '../../assets/home-img/nb-building.png';
import suitcase from '../../assets/home-img/nb-suitcase.png';
import plane from '../../assets/home-img/nb-plane.png';
import shirt from '../../assets/home-img/nb-shirt.png';
import takeoff from '../../assets/home-img/nb-takeoff.png';
import mic from '../../assets/home-img/nb-mic.png';
import cloud from '../../assets/home-img/nb-cloud.png';
import map from '../../assets/home-img/nb-map.png';
import checklist from '../../assets/home-img/nb-checklist.png';
import user from '../../assets/home-img/nb-user.png';
import exit from '../../assets/home-img/nb-running.png';
import { useNavigate } from 'react-router-dom';

function NavbarLoggedIn({header, elements, isOpen, onToggle, onItemClick}) {
    return (
        <div className='navbar-item'>
            <div className='nav-header' onClick={onToggle}>      
                <h2>{header}</h2>
                <img src={isOpen? upArrow : downArrow} className='arrow-img'/>
            </div>
            {isOpen && (
                <div className={`dropdown-wrapper dropdown-${header.toLowerCase()}`}>
                    {elements.map((item, index) => (
                        <a key={index} 
                        href={item.navigate ? `/${item.navigate}` : '#'} 
                        className={`dropdown dropdown-${item.iconClass}`}
                        onClick={(event) => {
                            item.onClick?.(event);
                            onItemClick?.();
                        }}>
                            <img src={item.icon} draggable="false" className={`dropdown-icon ${item.iconClass}`}/>
                            <p>{item.label}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
        );
    }

export default function LoggedInNav({setUser}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/"); // go back to home page
    };

    const handleToggle = (header) => {
        setOpenDropdown((prev) => (prev === header ? null : header));
    };

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!navRef.current?.contains(event.target)) {
                setOpenDropdown(null);
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, []);

    const handleDropdownItemClick = () => {
        setOpenDropdown(null);
        setMenuOpen(false);
    };

    return (
        <nav className='navbar-login' ref={navRef}>
            <a href={"/logged-in-home-page"}>
                <img src={earthIcon} draggable="false" alt="earth-icon" className="earth-icon"/>
            </a>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>
            <div className={`navbar-links ${menuOpen ? 'open': ''}`}>
                <NavbarLoggedIn
                    
                    header="Plan"
                    elements={[
                        {label: "Choose Destination + Dates", icon: pin, iconClass: "pin", navigate:"choose-destination-dates"},
                        {label:"Check the Weather", icon: cloud, iconClass: "cloud", navigate:"weather"},
                        {label:"Plan your Itinerary", icon: checklist, iconClass: "checklist", navigate:"plan-itinerary"},
                        {label:"Track your Flight", icon: plane, iconClass: "plane", navigate:"track-flight"} ,
                        {label:"Learn more", icon: map, iconClass: "nav-map", navigate:"learn-more"}
                    ]}
                    isOpen={openDropdown === "Plan"}
                    onToggle={() => handleToggle("Plan")}
                    onItemClick={handleDropdownItemClick}
                />
                <NavbarLoggedIn
                    header="Pack"
                    elements={[
                        {label:"Packing List", icon: suitcase, iconClass: "suitcase", navigate:"packing-list"},
                        {label:"Outfit Suggestions", icon: shirt, iconClass: "shirt", navigate:"outfit-suggestions"},
                    ]}
                    isOpen={openDropdown === "Pack"}
                    onToggle={() => handleToggle("Pack")}
                    onItemClick={handleDropdownItemClick}
                />
                <NavbarLoggedIn
                    header="Bookings"
                    elements={[
                        {label:"Flights + Transportation", icon: takeoff, iconClass: "takeoff", navigate:"flights-transportation"},
                        {label:"Accomodations", icon: building, iconClass: "building", navigate:"accomodations"},
                        {label:"Activities + Experiences", icon: mic, iconClass: "mic", navigate:"activities-experiences"},
                        ]}
                    isOpen={openDropdown === "Bookings"}
                    onToggle={() => handleToggle("Bookings")}
                    onItemClick={handleDropdownItemClick}
                />
                <NavbarLoggedIn
                    header="Profile"
                    elements={[
                        {label:"My Account", icon: user , iconClass: "user", navigate:"my-account"},
                       {label: "Logout", icon: exit, iconClass: "logout", onClick: handleLogout},
                        ]}
                    isOpen={openDropdown === "Profile"}
                    onToggle={() => handleToggle("Profile")}
                    onItemClick={handleDropdownItemClick}
                />
            </div>
        </nav>
    );
}
