import { useEffect, useRef, useState } from "react";
import "../planningPages/mapPage.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken =
  "pk.eyJ1IjoidGlmMDIxIiwiYSI6ImNtZG1rMHM1OTFtYTMybnB1Nmw5a3k4eXUifQ.i-YIqbLH2ZZj00uz6oa4gw";

const MapPage = ({itinerary}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const navigate = useNavigate();
    const [location, setLocation] = useState("");

    useEffect(() => {
      const storedPlan = JSON.parse(localStorage.getItem("plan"));
      if (storedPlan && storedPlan.city) {
        setLocation(
          `${storedPlan.city}, ${storedPlan.state}, ${storedPlan.country}`
        );
      }
    }, []);

    const getCoordinates = async (placeName) => {
      const mapboxToken = mapboxgl.accessToken;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      } else {
        throw new Error("Location not found");
      }
    };

  useEffect(() => {
    if (!location) return;
    getCoordinates(location)
      .then(({ lat, lng }) => {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [lng, lat],
          zoom: 10,
        });

        if (itinerary && itinerary.length > 0) {
          itinerary.forEach((loc) => {
            new mapboxgl.Marker()
              .setLngLat([loc.lng, loc.lat])
              .setPopup(new mapboxgl.Popup().setText(loc.name))
              .addTo(map.current);
          });
        }
      })
      .catch(console.error);
  }, [location, itinerary]);
    return (
      <div className="map-content">
        <div ref={mapContainer} style={{ height: "100vh", width: "200vh" }} />
        <button onClick={() => navigate("/plan-itinerary")}>Back</button>
      </div>
    );
}



export default MapPage;