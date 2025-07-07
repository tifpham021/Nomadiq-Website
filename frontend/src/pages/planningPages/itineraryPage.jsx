import '../planningPages/itineraryPage.css';
import background from '../../assets/planning-img/itinerary.png';
import lArrow from '../../assets/planning-img/left-arrow.png';
import rArrow from '../../assets/planning-img/right-arrow.png';
import map from '../../assets/planning-img/map.png';
import add from '../../assets/planning-img/add.png';
import trash from '../../assets/planning-img/trash.png';
import {useEffect, useState} from 'react';
const ItineraryPage = () => {
    const [tripInfo, setTripInfo] = useState(null);
    const [tripLength, setTripLength] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [temp, setTemp] = useState(null);
    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const [editing, setEditing] = useState(false);
    const [deleteBox, setDeleteBox] = useState(false);
    const [inputDayBoxes, setInputDayBoxes] = useState([]);
    const [inputNightBoxes, setInputNightBoxes] = useState([]);
    const MAX_BOXES = 4;

    const handleAddBoxDay = () => {
        if (inputDayBoxes.length >= MAX_BOXES) return;
        setInputDayBoxes((prev) => [...prev, { time: '', text: '', checked: false }]);
    };

    const handleAddBoxNight = () => {
        if (inputNightBoxes.length >= MAX_BOXES) return;
        setInputNightBoxes((prev) => [...prev, { time: '', text: '', checked: false }]);
    };

    const handleDeleteLastDayBox = () => {
        setInputDayBoxes((prev) => prev.slice(0, -1)); // removes last item
    };

    const handleDeleteLastNightBox = () => {
        setInputNightBoxes((prev) => prev.slice(0, -1)); // removes last item
    };

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
        if (tripInfo && tripInfo.destination ) {
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

        const formatted = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
        return formatted;
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
                    <button type='submit' onClick={() => setEditing(prev => !prev)}> {editing? "SAVE" : "EDIT"}</button>
                </div>
                {editing ? (
                    <div className='itinerary'>
                        <div className='planning-boxes'>
                            <div className='planning-box1'>
                                <h2>Day Time</h2>
                                {inputDayBoxes.map((box, index) => (
                                <div className='check-box-inputs' key={index}>
                                    <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={box.checked}
                                    onChange={(e) => {
                                        const newBoxes = [...inputDayBoxes];
                                        newBoxes[index].checked = e.target.checked;
                                        setInputDayBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-time"
                                    placeholder="Time..."
                                    value={box.time}
                                    onChange={(e) => {
                                        const newBoxes = [...inputDayBoxes];
                                        newBoxes[index].time = e.target.value;
                                        setInputDayBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-text"
                                    placeholder="Enter activity..."
                                    value={box.text}
                                    onChange={(e) => {
                                        const newBoxes = [...inputDayBoxes];
                                        newBoxes[index].text = e.target.value;
                                        setInputDayBoxes(newBoxes);
                                    }}
                                    />
                                </div>
                                ))}

                                <div className='editing-buttons'>
                                <button onClick={handleAddBoxDay}><img src={add} /></button>
                                <button onClick={handleDeleteLastDayBox}><img src={trash} /></button>
                                </div>
                            </div>
                            <div className='planning-box2'>
                                <h2>Night Time</h2>
                                {inputNightBoxes.map((box, index) => (
                                <div className='check-box-inputs' key={index}>
                                    <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={box.checked}
                                    onChange={(e) => {
                                        const newBoxes = [...inputNightBoxes];
                                        newBoxes[index].checked = e.target.checked;
                                        setInputNightBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-time"
                                    placeholder="Time..."
                                    value={box.time}
                                    onChange={(e) => {
                                        const newBoxes = [...inputNightBoxes];
                                        newBoxes[index].time = e.target.value;
                                        setInputNightBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-text"
                                    placeholder="Enter activity..."
                                    value={box.text}
                                    onChange={(e) => {
                                        const newBoxes = [...inputNightBoxes];
                                        newBoxes[index].text = e.target.value;
                                        setInputNightBoxes(newBoxes);
                                    }}
                                    />
                                </div>
                                ))}
                                <div className='editing-buttons'>
                                <button onClick={handleAddBoxNight}><img src={add} /></button>
                                <button onClick={handleDeleteLastNightBox}><img src={trash} /></button>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-buttons'>
                            <button className='arrow' onClick={prevPage} disabled={currentPage===0}><img src={lArrow}/></button>
                            <button>GENERATE ME ONE</button>
                            <button className='arrow' onClick={nextPage} disabled={currentPage === tripLength-1}><img src={rArrow}/></button>
                        </div>
                    </div>):
                    <div className='itinerary'>
                        <div className='planning-boxes'>
                            <div className='planning-box1'>
                                <h2>Day Time</h2>
                            </div>
                            <div className='planning-box2'>
                                <h2>Night Time</h2>
                            </div>
                        </div>
                        <div className='bottom-buttons'>
                            <button className='arrow' onClick={prevPage} disabled={currentPage===0}><img src={lArrow}/></button>
                            <button>GENERATE ME ONE</button>
                            <button className='arrow' onClick={nextPage} disabled={currentPage === tripLength-1}><img src={rArrow}/></button>
                        </div>
                    </div>
                }
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