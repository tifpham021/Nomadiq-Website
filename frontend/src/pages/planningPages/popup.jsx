import '../planningPages/popup.css';
import image from  '../../assets/planning-img/popup.png';
import {useNavigate} from 'react-router-dom';

const Popup = ({onClose}) => {
    const navigate = useNavigate();
    return (
        <div className='popup-overlay'>
            <div className="popup">
                <div className="popup-content">
                    <div className='left'>
                        <img src={image}/>
                    </div>
                    <div className='right'>
                        <h2>Let's Start Planning for Your Trip to </h2>
                        <h1>HAWAII </h1>
                        <button className='lets-go' onClick={() => navigate('/weather')}>Let's Go</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;