import '../planningPages/planningPage.css';
import background from '../../assets/planning-img/waves.png';
import car from '../../assets/planning-img/car.png';
import plane from '../../assets/planning-img/plane.png';
import train from '../../assets/planning-img/train.png';
import bike from '../../assets/planning-img/other.png';
import arrow from '../../assets/planning-img/arrow.png';
const PlanningPage = () => {

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
            <div className='top-box'>
                <h3>Your Destination:</h3>
                <input placeholder="Where you're going..."/>
            </div>
            <div className='inner-box'>
                <div className='inner-box-items'>
                    <div className='calendar'>
                        
                    </div>
                    <div className='dates'>
                        <h3>Date of Arrival</h3>
                        <input type="date"/>
                        <h3>Date of Departure</h3>
                        <input type="date"/>
                    </div>
                    <div className='confirm-details'>
                        <h2>Confirm Details</h2>
                        <div className='arrow-bg'>
                            <img src={arrow}/>
                        </div>
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