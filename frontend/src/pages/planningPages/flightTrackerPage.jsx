import React from 'react';
import background from "../../assets/planning-img/flight-tracker.png";

const FlightTrackerPage = () => {
    return (
      <div
        className=""
        style={{
          background: `url(${background})`,

          backgroundPosition: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div className="left-tracker"></div>
        <div className="middle-tracker"></div>
        <div className="right-tracker"></div>
      </div>
    );
}

export default FlightTrackerPage;