import '../planningPages/itineraryPage.css';
import background from '../../assets/planning-img/itinerary.png';
import lArrow from '../../assets/planning-img/left-arrow.png';
import rArrow from '../../assets/planning-img/right-arrow.png';
import map from '../../assets/planning-img/map.png';
import {useEffect, useState} from 'react';
const ItineraryPage = () => {
    const [tripInfo, setTripInfo] = useState(null);
    const [tripLength, setTripLength] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [temp, setTemp] = useState(null);
    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    useEffect(() => {
        const storedPlan = JSON.parse(localStorage.getItem("plan"));
        console.log("Stored Plan:", storedPlan);
        if (storedPlan){
            setTripInfo(storedPlan);
        }

    }, []);

    useEffect(() => {
        if (tripInfo?.date?.arrival && tripInfo?.date?.departure) {
        const start = new Date(tripInfo.date.arrival);
        const end = new Date(tripInfo.date.departure);
        const diffInTime = end - start;
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
        console.log("Trip length (days):", diffInDays);
        setTripLength(diffInDays);
        }
    }, [tripInfo])

    useEffect(() => {
        if (tripInfo.destination ) {
            const date = getDateTemp();
            fetchWeather(tripInfo.destination, date);
            console.log(date);
        }
    }, [tripInfo, currentPage]);

    const prevPage = () => {
        setCurrentPage((prev) => (prev > 0 ? prev-1: prev));
    };

    const nextPage = () => {
        setCurrentPage((prev) => (prev < tripLength - 1 ? prev + 1: prev));
    }

    const getDateForPage = () => {
        if (!tripInfo) return '';
        const startDate = new Date(tripInfo.date.arrival);
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + currentPage);
        return currentDate.toISOString().split('T')[0];
    };

    const getDateTemp = () => {
        if (!tripInfo) return '';
        const startDate = new Date(tripInfo.date.arrival);
        startDate.setDate(startDate.getDate() + currentPage);
        return startDate.toISOString().split('T')[0];
    }

    const fetchWeather = async (city, dateStr) => {
        try {
            const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&dt=${dateStr}`);
            const data = await res.json();
            const forecast = data.forecast.forecastday.find(day => day.date === dateStr);
            if (forecast) {
                setTemp(forecast.day.avgtemp_f);
            }
        } catch (err) {
            console.error('Failed to fetch weather:', err);
        }
    };

    return (
        <div className='itinerary-wrapper'
            style={{
                background: `url(${background})`,
                
                backgroundPosition: 'center',
                height: '87.5vh',
                width:'100vw',}}
                >
            <div className='left-boxes'>
                <div className='heading'>
                    <h3>Avg Temp: {temp}°</h3>
                    <h1 style={{textTransform: 'uppercase'}}>DAY {currentPage + 1}: {getDateForPage()}</h1>
                    <button type='submit'>EDIT</button>
                </div>
                <div className='three-boxes'>
                    <div className='morning'>
                        <h2>MORNING</h2>
                    </div>
                    <div className='afternoon'>
                        <h2>AFTERNOON</h2>
                    </div>
                    <div className='evening'>
                        <h2>EVENING</h2>
                    </div>
                </div>
                <div className='bottom-buttons'>
                    <button className='arrow' onClick={prevPage} disabled={currentPage===0}><img src={lArrow}/></button>
                    <button>GENERATE ME ONE</button>
                    <button className='arrow' onClick={nextPage} disabled={currentPage === tripLength-1}><img src={rArrow}/></button>
                </div>
            </div>
            <div className='right-boxes'>
                <div className='map-box'>
                    <img src={map} className='map'/>
                    <button>View More</button>
                </div>
                <div className='suggestions-box'>
                    <h2>What You May Like</h2>
                    <div className='suggestions-bottom'>
                        <button className='plus'>+</button>
                        <button className='view-more'>View More</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItineraryPage;