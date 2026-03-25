import "./learnMorePage.css";
import routePlane from "../../assets/planning-img/plane.png";
import planeTicketImage from "../../assets/learn-more-img/plane-ticket_3127363 1.png";
import cashImage from "../../assets/learn-more-img/cash_2698390 1.png";
import wordMouthImage from "../../assets/learn-more-img/word-mouth_3391055 1.png";
import wallClockImage from "../../assets/learn-more-img/wall-clock 1 (1).png";
import saveWorldImage from "../../assets/learn-more-img/save-world_9096452 1.png";
import sirenImage from "../../assets/learn-more-img/siren_709114 1.png";
import saladImage from "../../assets/learn-more-img/salad_12705555 1.png";
import ikuraImage from "../../assets/learn-more-img/ikura-sushi_3978714 1.png";
import veganFoodImage from "../../assets/learn-more-img/vegan-food_894898 1.png";
import helloImage from "../../assets/learn-more-img/hello_5619906 (1) 2.png";
import { useEffect, useState } from "react";

const GUIDE_PRESETS = [
  {
    matches: ["hawaii", "honolulu", "waikiki", "oahu", "maui"],
    destination: "Hawaii",
    currency: "USD",
    languages: "English",
    timeZone: "HST; 6 hours behind EST",
    phrase: "Aloha",
    phraseMeaning: "Hello, goodbye",
    foods: ["Malasada", "Poke", "Spam Musubi"],
  },
  {
    matches: ["tokyo", "japan"],
    destination: "Tokyo",
    currency: "JPY",
    languages: "Japanese",
    timeZone: "JST; 13 hours ahead of EST",
    phrase: "Arigato",
    phraseMeaning: "Thank you",
    foods: ["Sushi", "Ramen", "Taiyaki"],
  },
  {
    matches: ["paris", "france"],
    destination: "Paris",
    currency: "EUR",
    languages: "French",
    timeZone: "CET; 6 hours ahead of EST",
    phrase: "Bonjour",
    phraseMeaning: "Hello",
    foods: ["Croissant", "Crepes", "Macarons"],
  },
  {
    matches: ["london", "england", "uk", "united kingdom"],
    destination: "London",
    currency: "GBP",
    languages: "English",
    timeZone: "GMT/BST; 5 hours ahead of EST",
    phrase: "Cheers",
    phraseMeaning: "Thanks",
    foods: ["Tea", "Fish and Chips", "Scones"],
  },
];

const DEFAULT_GUIDE = {
  destination: "Your Destination",
  currency: "Local currency",
  languages: "English",
  timeZone: "Check local time",
  phrase: "Hello",
  phraseMeaning: "Common greeting",
  foods: ["Local dish", "Street snack", "Signature dessert"],
};

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getGuide = (tripInfo) => {
  const destinationText = [tripInfo?.city, tripInfo?.state, tripInfo?.country]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    GUIDE_PRESETS.find(({ matches }) =>
      matches.some((match) => destinationText.includes(match))
    ) || DEFAULT_GUIDE
  );
};

const titleCase = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const formatPlaceLabel = (value = "") => {
  const text = String(value).trim();

  if (/^[A-Z]{2,4}$/.test(text)) {
    return text;
  }

  return titleCase(text);
};

const getOriginLabel = (flightInfo) => {
  const rawOrigin =
    flightInfo?.originCity || flightInfo?.originCode || flightInfo?.origin || "Home";
  return formatPlaceLabel(rawOrigin);
};

const getDestinationLabel = (tripInfo, flightInfo, guide) => {
  const rawDestination =
    flightInfo?.destinationCity ||
    tripInfo?.city ||
    tripInfo?.country ||
    guide.destination;
  return formatPlaceLabel(rawDestination);
};

const LearnMorePage = () => {
  const [tripInfo, setTripInfo] = useState(null);
  const [flightInfo, setFlightInfo] = useState(null);

  useEffect(() => {
    setTripInfo(parseStoredJson("plan"));
    setFlightInfo(parseStoredJson("flightInfo"));
  }, []);

  const guide = getGuide(tripInfo);
  const fromLabel = getOriginLabel(flightInfo);
  const toLabel = getDestinationLabel(tripInfo, flightInfo, guide);

  return (
    <div className="learn-more-page">
      <div className="learn-more-shell">
        <aside className="learn-more-sidebar">
          <div className="summary-ticket">
            <div className="summary-ticket-top" />

            <div className="summary-visual-shell">
              <div className="summary-visual-circle">
                <img
                  className="summary-visual-image"
                  src={planeTicketImage}
                  alt=""
                />
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-route">
              <div className="summary-route-block">
                <span className="summary-route-label">From</span>
                <strong>{fromLabel}</strong>
              </div>
              <div className="summary-route-plane">
                <img src={routePlane} alt="" />
              </div>
              <div className="summary-route-block">
                <span className="summary-route-label">To</span>
                <strong>{toLabel}</strong>
              </div>
            </div>

            <div className="summary-info">
              <div className="summary-info-row">
                <div className="summary-info-copy">
                  <span className="summary-info-label">Currency:</span>
                  <span>{guide.currency}</span>
                </div>
                <span className="summary-info-badge">
                  <img src={cashImage} alt="" />
                </span>
              </div>

              <div className="summary-info-row">
                <div className="summary-info-copy">
                  <span className="summary-info-label">Languages Spoken:</span>
                  <span>{guide.languages}</span>
                </div>
                <span className="summary-info-badge">
                  <img src={wordMouthImage} alt="" />
                </span>
              </div>

              <div className="summary-info-row">
                <div className="summary-info-copy">
                  <span className="summary-info-label">Time Zone:</span>
                  <span>{guide.timeZone}</span>
                </div>
                <span className="summary-info-badge">
                  <img src={wallClockImage} alt="" />
                </span>
              </div>
            </div>

            <div className="summary-ticket-bottom" />
          </div>
        </aside>

        <main className="learn-more-main">
          <div className="learn-more-card-grid">
            <article className="learn-more-card culture-card">
              <h2>Respect The Culture</h2>
              <div className="learn-more-visual image-visual">
                <img src={saveWorldImage} alt="" />
              </div>
              <button type="button" className="learn-more-button">
                View More
              </button>
            </article>

            <article className="learn-more-card emergency-card">
              <h2>Emergency Information</h2>
              <div className="learn-more-visual image-visual">
                <img src={sirenImage} alt="" />
              </div>
              <button type="button" className="learn-more-button">
                View More
              </button>
            </article>
            <article className="learn-more-card flavors-card">
              <h2>Try Local Flavors</h2>
              <div className="flavor-grid">
                <div className="flavor-item">
                  <img src={saladImage} alt="" />
                </div>
                <div className="flavor-item">
                  <img src={ikuraImage} alt="" />
                </div>
                <div className="flavor-item">
                  <img src={veganFoodImage} alt="" />
                </div>
              </div>
              <button type="button" className="learn-more-button">
                View More
              </button>
            </article>

            <article className="learn-more-card local-card">
              <h2>Speak Like A Local</h2>
              <div className="local-visual">
                <img src={helloImage} alt="" />
              </div>
              <p className="local-phrase">
                {guide.phrase}: {guide.phraseMeaning}
              </p>
              <button type="button" className="learn-more-button">
                View More
              </button>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearnMorePage;
