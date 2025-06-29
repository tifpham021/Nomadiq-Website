import '../planningPages/weather.css';
import background from '../../assets/planning-img/weather.png';
import {useNavigate} from 'react-router-dom';
import sun from '../../assets/planning-img/sun.png';
import rain from '../../assets/planning-img/rain.png';
import thunder from '../../assets/planning-img/thunder.png';
import wind from'../../assets/planning-img/wind.png';

const WeatherPage = () => {
    const navigate = useNavigate();
    return (
        <div className="weather-wrapper"
        style={{
            background: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width:'100vw',
        }}>
            <div className='buttons-top'>
                <button onClick={() => navigate('/choose+destination+dates')}>Back</button>
                <button onClick={() => navigate('/plan+itinerary')}>Plan Itinerary</button>
            </div>
            {/* location name */}
            <h1 style={{
                textTransform: 'uppercase',
                color: 'white',
                fontSize: '6rem',
                marginTop: '-1%',
            }}>Hawaii</h1>
            <div className='weather-content'>
                <div className='box1-w'>
                    <img/>
                    <h2>Temp</h2>
                </div>
                <div className='box2-w'>
                    <img/>
                    <h2>Temp</h2>
                </div>
                <div className='box3-w'>
                    <img/>
                    <h2>Temp</h2>
                </div>
                <div className='box4-w'>
                    <img/>
                    <h2>Temp</h2>
                </div>
            </div>
        </div>
    )
}

export default WeatherPage;