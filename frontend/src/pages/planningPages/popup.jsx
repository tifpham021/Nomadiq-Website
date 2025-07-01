import '../planningPages/popup.css';
import image from  '../../assets/planning-img/popup.png';
import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect} from 'react';

const Popup = ({onClose}) => {
    const [location, setLocation] = useState('')

    const navigate = useNavigate();
    useEffect(() => {
            const storedPlan = JSON.parse(localStorage.getItem("plan"));
            if (storedPlan && storedPlan.destination) {
                const[city] = storedPlan.destination.split(',').map(part => part.trim());
                setLocation(city);
            }
      }, []);
    return (
        <div className='popup-overlay'>
            <div className="popup">
                <div className="popup-content">
                    <div className='left'>
                        <img src={image}/>
                    </div>
                    <div className='right'>
                        <h2>Let's Start Planning for Your Trip to </h2>
                        <h1 style={{ textTransform: "uppercase "}}>{location}</h1>
                        <button className='lets-go' onClick={() => navigate('/weather')}>Let's Go</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;