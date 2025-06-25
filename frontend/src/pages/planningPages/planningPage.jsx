import '../planningPages/planningPage.css';
import background from '../../assets/planning-img/waves.png';
import car from '../../assets/planning-img/car.png';
import plane from '../../assets/planning-img/plane.png';
import train from '../../assets/planning-img/train.png';
import bike from '../../assets/planning-img/other.png';
import arrow from '../../assets/planning-img/arrow.png';
import Calendar from 'react-calendar';
import React, {useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import Popup from './popup.jsx';

const PlanningPage = () => {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [arrivalDate, departureDate] = dateRange;
    const [showPopup, setShowPopup] = useState(false);

    const formatDateForInput = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',   
            year: 'numeric',   
            month: 'long',     
            day: 'numeric'     
        });
    };

    const handleInputChange = (e) => {
        const newDate = new Date(e.target.value);
        if (isNaN(newDate)) return;

        if (type === 'arrival') {
            setDateRange([newDate, departureDate]);
        } else if (type === 'departure') {
            setDateRange([arrivalDate, newDate]);
    }

    const confirmationPopup = () => {
        
    }
    };
    return (
        <div
            className="planning-page-wrapper"
                        style={{
                            background: `url(${background})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '100vh',
                            width:'100vw',
                            
                        }}
                        >
            {showPopup && <Popup onClose={() => setShowPopup(false)} />}
            <div className='top-box'>
                <h3>Your Destination:</h3>
                <input placeholder="Where you're going..."/>
            </div>
            <div className='inner-box'>
                <div className='inner-box-items'>
                    <div className='calendar'>
                        <Calendar
                            prevLabel={<span>◀</span>}
                            nextLabel={<span>▶</span>}
                            next2Label={null}
                            prev2Label={null}
                            minDate={new Date()}
                            maxDate={new Date(2030, 12, 31)}
                            selectRange={true}
                            value={dateRange}
                            onChange={(range) => setDateRange(range)}
                        />
                    </div>
                    <div className='dates'>
                        <h3>Date of Arrival</h3>
                        <input value={formatDateForInput(arrivalDate)}
                               />
                        <h3>Date of Departure</h3>
                        <input value={formatDateForInput(departureDate)}
                            />
                    </div>
                    <div className='confirm-details'>
                            <button className='arrow-bg' onClick={() => setShowPopup(true)}>
                                <img src={arrow}/>
                            </button>
                    </div>
                </div>
            </div>
            <div className='bottom-box'>
                <h3>Mode of Transportation</h3>
                <div className='transportation'>
                    <div className='box1'>
                        <img src={car} width="35px" height="26px"/>
                        <p>Car</p>
                    </div>
                    <div className='box2'>
                        <img src={plane} width="30px" height="26px"/>
                        <p>Plane</p>
                    </div>
                    <div className='box3'>
                        <img src={train} width="26px" height="26px"/>
                        <p>Train</p>
                    </div>
                    <div className='box4'>
                        <img src={bike} width="35px" height="26px"/>
                        <p>Other</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlanningPage;