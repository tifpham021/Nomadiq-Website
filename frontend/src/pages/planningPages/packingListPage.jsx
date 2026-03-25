import "./packingListPage.css";
import weatherSunImage from "../../assets/packing-img/sun (1) 1.png";
import avgTempImage from "../../assets/packing-img/sun_2698194 1.png";
import rainImage from "../../assets/packing-img/rain_3248331 1.png";
import sunscreenImage from "../../assets/packing-img/sunscreen_11014994 1.png";
import humidityImage from "../../assets/packing-img/humidity_4148388 1.png";
import windImage from "../../assets/packing-img/wind_1164960 1.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PACKING_CATEGORIES } from "./packingListData.js";

const DEFAULT_WEATHER = {
  description: "Mostly sunny with occasional clouds",
  avgTemp: "84° / 70° F",
  rainChance: "20%",
  uvIndex: "High",
  humidity: "Moderate",
  wind: "Light Breeze",
};

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const toSentenceCase = (value = "") => {
  const text = String(value).trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const getUvLabel = (uvValue) => {
  const uv = Number(uvValue);

  if (!Number.isFinite(uv)) {
    return DEFAULT_WEATHER.uvIndex;
  }

  if (uv >= 8) {
    return "Very High";
  }

  if (uv >= 6) {
    return "High";
  }

  if (uv >= 3) {
    return "Moderate";
  }

  return "Low";
};

const getHumidityLabel = (humidityValue) => {
  const humidity = Number(humidityValue);

  if (!Number.isFinite(humidity)) {
    return DEFAULT_WEATHER.humidity;
  }

  if (humidity >= 75) {
    return "Humid";
  }

  if (humidity >= 45) {
    return "Moderate";
  }

  return "Dry";
};

const getWindLabel = (windValue) => {
  const windMph = Number(windValue);

  if (!Number.isFinite(windMph)) {
    return DEFAULT_WEATHER.wind;
  }

  if (windMph >= 20) {
    return "Windy";
  }

  if (windMph >= 10) {
    return "Breezy";
  }

  if (windMph >= 4) {
    return "Light Breeze";
  }

  return "Calm";
};

const buildWeatherSummary = (forecastData) => {
  const forecastDay = forecastData?.forecast?.forecastday?.[0];
  const day = forecastDay?.day;

  if (!day) {
    return DEFAULT_WEATHER;
  }

  return {
    description: toSentenceCase(day.condition?.text || DEFAULT_WEATHER.description),
    avgTemp: `${Math.round(day.maxtemp_f)}° / ${Math.round(day.mintemp_f)}° F`,
    rainChance: `${day.daily_chance_of_rain ?? 0}%`,
    uvIndex: getUvLabel(day.uv),
    humidity: getHumidityLabel(day.avghumidity),
    wind: getWindLabel(day.maxwind_mph),
  };
};

const WeatherStatIcon = ({ type }) => {
  if (type === "avg") {
    return <img src={avgTempImage} alt="" />;
  }

  if (type === "rain") {
    return <img src={rainImage} alt="" />;
  }

  if (type === "wind") {
    return <img src={windImage} alt="" />;
  }

  if (type === "uv") {
    return <img src={sunscreenImage} alt="" />;
  }

  return <img src={humidityImage} alt="" />;
};

const PackingListPage = () => {
  const [weatherSummary, setWeatherSummary] = useState(DEFAULT_WEATHER);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlan = parseStoredJson("plan");
    const city = storedPlan?.city;

    if (!city) {
      return;
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch weather");
        }

        const data = await response.json();
        setWeatherSummary(buildWeatherSummary(data));
      } catch (error) {
        console.error("Failed to fetch packing weather:", error);
      }
    };

    fetchWeather();
  }, []);

  const statRows = [
    { key: "avg", label: "Avg Temp", value: weatherSummary.avgTemp },
    { key: "rain", label: "Chance of Rain", value: weatherSummary.rainChance },
    { key: "uv", label: "UV Index", value: weatherSummary.uvIndex },
    { key: "humidity", label: "Humidity", value: weatherSummary.humidity },
    { key: "wind", label: "Wind", value: weatherSummary.wind },
  ];

  return (
    <div className="packing-list-page">
      <div className="packing-list-shell">
        <aside className="packing-weather-panel">
          <div className="weather-cloud weather-cloud-top" />
          <div className="weather-cloud weather-cloud-bottom" />

          <h2>Weather</h2>
          <p className="packing-weather-copy">{weatherSummary.description}</p>

          <div className="packing-weather-scene">
            <img src={weatherSunImage} alt="" className="packing-weather-icon" />
          </div>

          <div className="packing-weather-stats">
            {statRows.map((row) => (
              <div key={row.key} className="packing-weather-stat">
                <div className={`packing-weather-stat-icon ${row.key}`}>
                  <WeatherStatIcon type={row.key} />
                </div>
                <p>
                  <strong>{row.label}:</strong> {row.value}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <main className="packing-main">
          <h1>Here's What You Should Pack</h1>

          <div className="packing-card-grid">
            {PACKING_CATEGORIES.map((category) => (
              <button
                key={category.key}
                type="button"
                className="packing-card"
                onClick={() => navigate(`/packing-list/${category.key}`)}
              >
                <h2>{category.title}</h2>
                <div className="packing-card-bubble">
                  <img
                    src={category.image}
                    alt=""
                    className="packing-card-illustration-image"
                  />
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PackingListPage;
