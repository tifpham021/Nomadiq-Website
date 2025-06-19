import '../homepage/homepage.css';
import bridgeImg from '../../assets/home-img/wooden-bridge.png';
import townImg from '../../assets/home-img/buildings-sky.png';
import greenImg from '../../assets/home-img/greenery-town.png';
import pin from '../../assets/home-img/hp-pin.png';
import plane from '../../assets/home-img/hp-plane.png';
import sun from '../../assets/home-img/hp-sun.png';
import shirt from '../../assets/home-img/hp-shirt.png';
import list from '../../assets/home-img/hp-list.png';
import money from '../../assets/home-img/hp-money.png';
import itinerary from '../../assets/home-img/hp-itinerary.png';
import ppl from '../../assets/home-img/hp-ppl.png';
import bell from '../../assets/home-img/hp-bell.png';
import earth from '../../assets/home-img/hp-earth.png';
import book from '../../assets/home-img/hp-book.png';
import house from '../../assets/home-img/hp-house.png';
import FAQ from './AccordionItem.jsx';

const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <div className="second-navbar">
                <a href="#home">HOME</a>
                <a href="#about">ABOUT</a>
                <a href="#faqs">FAQs</a>
            </div>

            <div id="home" className='home-part'>
                <div className='text-on-left'>
                    <div className='top-text'>
                        <h2>WELCOME</h2>
                        <h2>TO</h2>
                    </div>
                    <h1 className='main-text'>NOMADIQ</h1>
                    <h3 className='descript-text'>Your Travel Planning Companion</h3>
                </div>
                <div className='images'>
                    <img src={bridgeImg} className='bridgeImg'/>
                    <div className='stacked-img'>
                        <img src={greenImg} className='greenImg'/>
                        <img src={townImg} className='townImg'/>
                    </div>
                </div>
            </div>

            <div id="about" className='about'>
                <h1 className='about-header'>ABOUT</h1>
                <p className='about-descript'>Nomadiq is your go-to travel planner—designed to simplify 
                    trip planning and enhance your travel experience. 
                    Through Nomadiq, you’ll be able to: 
                </p>
                <div className='all-boxes'>
                        <div className="plan-w-confidence">
                                <h3>Plan with Confidence</h3>
                                <div className="top-row">
                                    <div className="first-box">
                                        <div className="box-pink">
                                            <img src={pin} alt="pin" className="img-one-pink"/>
                                        </div>
                                        <p>Plan destinations & travel dates</p>
                                    </div>
                                    <div className="second-box">
                                        <div className="box-pink">
                                            <img src={plane} alt="plane" className="img-two-pink"/>
                                        </div>
                                        <p>Track flights & get check-in reminders</p>
                                    </div>
                                    <div className="third-box">
                                        <div className="box-pink">
                                            <img src={sun} alt="sun" className="img-three-pink"/>
                                        </div>
                                        <p>Receive weather updates</p>
                                    </div>
                                </div>
                                <div className="bottom-row">
                                    <div className="fourth-box">
                                        <div className="box-pink">
                                            <img src={list} alt="list" className="img-four-pink"/>
                                        </div>
                                        <p>
                                            Be informed about travel visas, documents, etc</p>
                                    </div>
                                    <div className="fifth-box">
                                        <div className="box-pink">
                                            <img src={shirt} alt="shirt" className="img-five-pink"/>
                                        </div>
                                        <p>
                                            Receive personalized packing lists and outfits</p>
                                    </div>
                                    <div className="sixth-box">
                                        <div className="box-pink">
                                            <img src={money} alt="money" className="img-six-pink"/>
                                        </div>
                                        <p>
                                            Plan with a travel budget planner</p>
                                    </div>
                                </div>
                        </div>
                        <div className="travel-smarter-together">
                            <h3>Travel Smarter Together</h3>
                            <div className="top-row">
                                <div className="first-box">
                                    <div className="box-green">
                                        <img src={itinerary} alt="itinerary" className="img-one-green"/>
                                    </div>
                                    <p>
                                        Receive a curated itinerary</p>
                                </div>
                                <div className="second-box">
                                    <div className="box-green">
                                        <img src={ppl} alt="people" className="img-two-green"/>
                                    </div>
                                    <p>
                                        Collaborate with friends on plans and packing</p>
                                </div>
                                <div className="third-box">
                                    <div className="box-green">
                                        <img src={bell} alt="bell" className="img-three-green"/>
                                    </div>
                                    <p>
                                        Stay informed with travel alerts</p>
                                </div>
                            </div>
                            <div className="bottom-row">
                                <div className="fourth-box">
                                    <div className="box-green">
                                        <img src={earth} alt="earth" className="img-four-green"/>
                                    </div>
                                    <p>
                                        Learn local information</p>
                                </div>
                                <div className="fifth-box">
                                    <div className="box-green">
                                        <img src={book} alt="book" className="img-five-green"/>
                                    </div>
                                    <p>
                                        Read and write reviews</p>
                                </div>
                            <div className="sixth-box">
                                <div className="box-green">
                                    <img src={house} alt="house" className="img-six-green"/>
                                </div>
                                <p>
                                Book hotels and accommodations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="faqs" className="faqs-section">
                <h1 className='faqs-header'>FAQs</h1>
                <FAQ />
            </div>
        </div>
    );
};

export default HomePage; 