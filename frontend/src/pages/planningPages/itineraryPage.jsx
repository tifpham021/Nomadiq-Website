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
    const [tripLength, setTripLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const [editing, setEditing] = useState(false);
    const [dayData, setDayData] = useState({});
    const MAX_BOXES = 4;

    const handleAddBoxDay = () => {
        if (currentDayBoxes.length >= MAX_BOXES) return;
        const newBoxes = [...currentDayBoxes, { time: '', activity: '', checked: false }];
        updateDayBoxes(newBoxes);
    };

    const handleAddBoxNight = () => {
        if (currentNightBoxes.length >= MAX_BOXES) return;
        const newBoxes = [...currentNightBoxes, { time: '', activity: '', checked: false }];
        updateNightBoxes(newBoxes);
    };

    const handleDeleteLastDayBox = () => {
        const newBoxes = currentDayBoxes.slice(0, -1);
        updateDayBoxes(newBoxes);
    };

    const handleDeleteLastNightBox = () => {
        const newBoxes = currentNightBoxes.slice(0, -1);
        updateNightBoxes(newBoxes);
    };

    const getDateTemp = () => {
        if (!tripInfo) return '';
        const startDate = new Date(tripInfo.date.arrival);
        startDate.setDate(startDate.getDate() + currentPage);
        return startDate.toISOString().split('T')[0];
    }

    const updateDayBoxes = (newBoxes) => {
    setDayData(prev => ({
        ...prev,
        [getDateTemp()]: {
        ...(prev[getDateTemp()] || {}),
        dayBoxes: newBoxes
        }
    }));
    };

    const updateNightBoxes = (newBoxes) => {
    setDayData(prev => ({
        ...prev,
        [getDateTemp()]: {
        ...(prev[getDateTemp()] || {}),
        nightBoxes: newBoxes
        }
    }));
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


    const prevPage = async () => {
        if (currentPage > 0) {
            if (editing) await saveItinerary();
            setCurrentPage((prev) => (prev - 1));
        }
    };

    const nextPage = async () => {
        if (currentPage < tripLength - 1) {
            if (editing) await saveItinerary();
            setCurrentPage((prev) => (prev + 1));
        }
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

    const currentDayBoxes = dayData[getDateTemp()]?.dayBoxes || [];
    const currentNightBoxes = dayData[getDateTemp()]?.nightBoxes || [];


        const loadItinerary = async () => {
            if (!tripInfo) return;
            try {
            const date = getDateTemp();
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?._id || user?.id;
            
            if (!userId) {
                console.error("No user logged in");
                return;
            }

            const res = await fetch(`http://localhost:3000/api/plan-itinerary?userId=${userId}&date=${date}`);
            
            if (!res.ok) {
                console.error("Failed to load itinerary");
                return;
            }

            const data = await res.json();
            console.log("Response from load:", data);

            setDayData(prev => ({
            ...prev,
            [date]: {
                dayBoxes: data.dayBoxes || [],
                nightBoxes: data.nightBoxes || []
            }
            }));

            } catch (err) {
            console.error('No itinerary found for this date:', err);
            }
        };

        const saveItinerary = async () => {
        if (!tripInfo) return;

        try {
            const date = getDateTemp(); // e.g. 2025-07-08
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?._id || user?.id;

            if (!userId) {
            // handle case if no logged in user, maybe redirect to login or show a message
            console.error("No user logged in");
            return;
            }

            const payload = {
            userId,
            date,
            dayBoxes: dayData[date]?.dayBoxes || [],
            nightBoxes: dayData[date]?.nightBoxes || []
            };

            const res = await fetch('http://localhost:3000/api/plan-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("Saved:", data);

            if (data) {
                setDayData(prev => ({
                    ...prev,
                    [date]: {
                        dayBoxes: data.dayBoxes || [],
                        nightBoxes: data.nightBoxes || []
                    }
                }));
            }
            await loadItinerary();
        } catch (err) {
            console.error('Failed to save itinerary:', err);
        }
    };

        useEffect(() => {
            loadItinerary();
        }, [tripInfo, currentPage]);

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
                    <h1 className='day' style={{textTransform: 'uppercase'}}>DAY {currentPage + 1}: {getDateForPage()}</h1>
                    <button className='editing-button' type='submit' 
                    onClick={async () => {
                        if (editing) await saveItinerary();
                        setEditing(prev => !prev);
                    }}> {editing? "SAVE" : "EDIT"}</button>
                </div>
                {editing ? (
                    <div className='itinerary'>
                        <div className='planning-boxes'>
                            <div className='planning-box1'>
                                <h2>Day Time</h2>
                                {currentDayBoxes.map((box, index) => (
                                <div className='check-box-inputs' key={index}>
                                    <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={box.checked}
                                    onChange={(e) => {
                                        const newBoxes = [...currentDayBoxes];
                                        newBoxes[index].checked = e.target.checked;
                                        updateDayBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-time"
                                    placeholder="Time..."
                                    value={box.time || ''}
                                    onChange={(e) => {
                                        const newBoxes = [...currentDayBoxes];
                                        newBoxes[index].time = e.target.value;
                                        updateDayBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-text"
                                    placeholder="Enter activity..."
                                    value={box.activity}
                                    onChange={(e) => {
                                        const newBoxes = [...currentDayBoxes];
                                        newBoxes[index].activity = e.target.value;
                                        updateDayBoxes(newBoxes);
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
                                {currentNightBoxes.map((box, index) => (
                                <div className='check-box-inputs' key={index}>
                                    <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={box.checked}
                                    onChange={(e) => {
                                        const newBoxes = [...currentNightBoxes];
                                        newBoxes[index].checked = e.target.checked;
                                        updateNightBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-time"
                                    placeholder="Time..."
                                    value={box.time || ''}
                                    onChange={(e) => {
                                        const newBoxes = [...currentNightBoxes];
                                        newBoxes[index].time = e.target.value;
                                        updateNightBoxes(newBoxes);
                                    }}
                                    />
                                    <input
                                    type="text"
                                    className="check-box-text"
                                    placeholder="Enter activity..."
                                    value={box.activity}
                                    onChange={(e) => {
                                        const newBoxes = [...currentNightBoxes];
                                        newBoxes[index].activity = e.target.value;
                                        updateNightBoxes(newBoxes);
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
                    </div>): (
                        <>
                        <div className='itinerary'>
                            <div className='planning-boxes'>
                                <div className='planning-box1'>
                                    <h2>Day Time</h2>
                                    {currentDayBoxes.map((box, index) => (
                                    <div className='check-box-inputs' key={index}>
                                        <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={box.checked}
 
                                        onChange={(e) => {
                                            const newBoxes = [...currentDayBoxes];
                                            newBoxes[index].checked = e.target.checked;
                                            updateDayBoxes(newBoxes);
                                        }}
                                        />
                                        <input
                                        type="text"
                                        className="check-box-time"
                                        placeholder="Time..."
                                        value={box.time || ''}
                                        readOnly={!editing} 
                                        onChange={(e) => {
                                            const newBoxes = [...currentDayBoxes];
                                            newBoxes[index].time = e.target.value;
                                            updateDayBoxes(newBoxes);
                                        }}
                                        />
                                        <input
                                        type="text"
                                        className="check-box-text"
                                        placeholder="Enter activity..."
                                        value={box.activity}
                                        readOnly={!editing} 
                                        onChange={(e) => {
                                            const newBoxes = [...currentDayBoxes];
                                            newBoxes[index].activity = e.target.value;
                                            updateDayBoxes(newBoxes);
                                        }}
                                        />
                                    </div>
                                    ))}

                                </div>
                                <div className='planning-box2'>
                                    <h2>Night Time</h2>
                                    {currentNightBoxes.map((box, index) => (
                                    <div className='check-box-inputs' key={index}>
                                        <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={box.checked}
                                        onChange={(e) => {
                                            const newBoxes = [...currentNightBoxes];
                                            newBoxes[index].checked = e.target.checked;
                                            updateNightBoxes(newBoxes);
                                        }}
                                        />
                                        <input
                                        type="text"
                                        className="check-box-time"
                                        placeholder="Time..."
                                        value={box.time || ''}
                                        readOnly={!editing} 
                                        onChange={(e) => {
                                            const newBoxes = [...currentNightBoxes];
                                            newBoxes[index].time = e.target.value;
                                            updateNightBoxes(newBoxes);
                                        }}
                                        />
                                        <input
                                        type="text"
                                        className="check-box-text"
                                        placeholder="Enter activity..."
                                        value={box.activity}
                                        readOnly={!editing} 
                                        onChange={(e) => {
                                            const newBoxes = [...currentNightBoxes];
                                            newBoxes[index].activity = e.target.value;
                                            updateNightBoxes(newBoxes);
                                        }}
                                        />
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className='bottom-buttons'>
                                <button className='arrow' onClick={prevPage} disabled={currentPage===0}><img src={lArrow}/></button>
                                <button>GENERATE ME ONE</button>
                                <button className='arrow' onClick={nextPage} disabled={currentPage === tripLength-1}><img src={rArrow}/></button>
                            </div>
                    </div>
                        </>
                    )
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