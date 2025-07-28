import "../planningPages/planningPage.css";
import background from "../../assets/planning-img/waves.png";
import car from "../../assets/planning-img/car.png";
import plane from "../../assets/planning-img/plane.png";
import train from "../../assets/planning-img/train.png";
import bike from "../../assets/planning-img/other.png";
import arrow from "../../assets/planning-img/arrow.png";
import Calendar from "react-calendar";
import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import Popup from "./popup.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSaveInfo } from "./planning-linking.js";

const PlanningPage = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [arrivalDate, departureDate] = dateRange;
  const [transportation, setTransportation] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const saveInfo = useSaveInfo((state) => state.saveInfo);
  const [user, setUser] = useState(null);

  const notifySuccess = (msg) => toast.success(msg, { autoClose: 3000 });
  const notifyError = (msg) => toast.error(msg, { autoClose: 3000 });

  const formatDateForInput = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSelect = (mode) => {
    setTransportation(mode);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      notifyError("User not logged in.");
      return;
    }

    const userId = user.id;

    if (!city || !country || !transportation || !dateRange) {
      notifyError("Please fill out all fields.");
      return;
    }

    const res = await saveInfo({
      userId: user.id,
      destination: {
        city,
        state: state || null,
        country,
      },
      date: { arrival: arrivalDate, departure: departureDate },
      transportation,
    });
    console.log("Save Info Result:", res);

    if (res.success) {
      if (res.plan) {
        localStorage.setItem("plan", JSON.stringify(res.plan));
      }
      notifySuccess(res.message);
      setShowPopup(true);
    } else {
      notifyError(res.message);
    }
  };

  return (
    <div
      className="planning-page-wrapper"
      style={{
        background: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <form onSubmit={handleSubmit}>
        {showPopup && <Popup onClose={() => setShowPopup(false)} />}

        <div className="top-box">
          <h3>Your Destination:</h3>
          <div className="location-inputs">
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city"
            />
            <input
              placeholder="State/Province (optional)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="state"
            />
            <input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="country"
            />
          </div>
        </div>
        <div className="inner-box">
          <div className="inner-box-items">
            <div className="calendar">
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
            <div className="dates">
              <h3>Date of Arrival</h3>
              <input value={formatDateForInput(arrivalDate)} readOnly />
              <h3>Date of Departure</h3>
              <input value={formatDateForInput(departureDate)} readOnly />
            </div>
            <div className="confirm-details">
              <button className="arrow-bg" type="submit">
                <img src={arrow} />
              </button>
            </div>
          </div>
        </div>
        <div className="bottom-box">
          <h3>Mode of Transportation</h3>
          <div className="transportation">
            <div>
              <button
                type="button"
                className={`box1 ${transportation === "Car" ? "active" : ""}`}
                onClick={() => handleSelect("Car")}
              >
                <img src={car} width="35px" height="26px" alt="Car" />
                <p>Car</p>
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`box2 ${transportation === "Plane" ? "active" : ""}`}
                onClick={() => handleSelect("Plane")}
              >
                <img src={plane} width="30px" height="26px" alt="Plane" />
                <p>Plane</p>
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`box3 ${transportation === "Train" ? "active" : ""}`}
                onClick={() => handleSelect("Train")}
              >
                <img src={train} width="26px" height="26px" alt="Train" />
                <p>Train</p>
              </button>
            </div>
            <div>
              <button
                type="button"
                className={`box4 ${transportation === "Other" ? "active" : ""}`}
                onClick={() => handleSelect("Other")}
              >
                <img src={bike} width="35px" height="26px" alt="Other" />
                <p>Other</p>
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default PlanningPage;
