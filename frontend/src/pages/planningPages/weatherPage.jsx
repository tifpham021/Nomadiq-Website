import '../planningPages/weather.css';
import background from '../../assets/planning-img/weather.png';
import {useNavigate} from 'react-router-dom';
import sun from '../../assets/planning-img/sun.png';
import rain from '../../assets/planning-img/rain.png';
import thunder from '../../assets/planning-img/thunder.png';
import wind from'../../assets/planning-img/wind.png';
import lArrow from'../../assets/planning-img/left-arrow.png';
import rArrow from'../../assets/planning-img/right-arrow.png';
import { useEffect, useState } from 'react';

const WeatherPage = () => {

    const [location, setLocation] = useState('');
    const [forecast, setForecast] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const storedPlan = JSON.parse(localStorage.getItem("plan"));
        if (storedPlan && storedPlan.city) {
            setLocation(storedPlan.city);
            fetchWeather(storedPlan.city);
        }
    }, []);

    
    const fetchWeather = async (city) => {
        try {
            const res = await fetch(
              `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`
            );
            const data = await res.json();
            setForecast(data);
        } catch (err) {
            console.error('Failed to fetch weather:', err);
        }
    };

    const getGradientColor = (temp) => {
    if (temp <= 32) {
        return 'linear-gradient(to right, #00c6ff, #0072ff)'; // icy blue
    } else if (temp <= 50) {
        return 'linear-gradient(to right, #89f7fe, #66a6ff)'; // light blue
    } else if (temp <= 70) {
        return 'linear-gradient(to right,rgb(231, 225, 135),rgb(239, 203, 105), rgb(237, 190, 73))'; // yellowish
    } else if (temp <= 85) {
        return 'linear-gradient(to right,rgb(234, 179, 142),rgb(235, 114, 49), rgb(250, 23, 57))'; // warm orange-pink
    } else {
        return 'linear-gradient(to right, #ff512f,rgb(226, 9, 9))'; // red/purple hot
    }
    };


    return (
        <div className="weather-wrapper"
        style={{
            background: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '93vh',
            width:'100vw',
        }}>
            <div className='buttons-top'>
                <button onClick={() => navigate('/choose-destination-dates')}>Back</button>
                <button onClick={() => navigate('/plan-itinerary')}>Plan Itinerary</button>
            </div>
            <div className='all-weather-content'>
                <h1 className='location'>{location}</h1>
                {forecast ? (
                <div className='weather-content'>
                    <div className='arrow-weather-left'>
                        <img src={lArrow}/>
                    </div>
                    {forecast?.forecast?.forecastday?.slice(0, 4).map((day, index) => {
                        const conditionText = day.day.condition.text.toLowerCase();
                        const temp = day.day.avgtemp_f;
                        let tempGradient= getGradientColor(temp);
                        let icon;

                        if (conditionText==="sunny" || conditionText==="clear") {
                            icon = sun;
                        } else if (conditionText.includes("rain")) {
                            icon = rain;
                        } else if (conditionText==="windy") {
                            icon = wind;
                        } else if (conditionText ==="thunderstorm") {
                            icon = thunder;
                        }
                        return (
                        <div>
                            <div key={index} className={`box${index + 1}-w`}>
                                <img className='icon' src={icon} alt={day.day.condition.text} />
                                <p className='temp-weather'>{day.day.mintemp_f}° - {day.day.maxtemp_f}°F</p>
                                <div style={{backgroundImage: tempGradient}} className="gradient"> </div>
                                <div className='notes-weather'>
                                    <p><b>Sunrise: </b> {day.astro.sunrise}</p>
                                    <p><b>Sunset: </b> {day.astro.sunset}</p>
                                    <p><b>Chance of Rain:</b> {day.day.daily_chance_of_rain}%</p>
                                </div>
                                <div className='date-bg'>
                                    <h2 className='date-weather'>{new Date(day.date).toLocaleDateString('en-US', 
                                        { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h2>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    <div className='arrow-weather-right'>
                        <img src={rArrow}/>
                    </div>
                </div>) : (
                    <p style={{ color: 'white' }}>Loading weather...</p>
                )}
            </div>
        </div>
    )
}

export default WeatherPage;