import "./flightsTransportationPage.css";
import planeIcon from "../../assets/planning-img/plane.png";
import hawaiianAirlineImage from "../../assets/flight-transportation-img/hawaiian-airline.png";
import carIconImage from "../../assets/flight-transportation-img/car-icon.png";
import suvImage from "../../assets/flight-transportation-img/suv.png";
import enterpriseImage from "../../assets/flight-transportation-img/enterprise.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AIRPORT_CODES = {
  honolulu: "HNL",
  hawaii: "HNL",
  waikiki: "HNL",
  oahu: "HNL",
  maui: "OGG",
  kauai: "LIH",
  orlando: "MCO",
  miami: "MIA",
  newyork: "JFK",
  "new york": "JFK",
  losangeles: "LAX",
  "los angeles": "LAX",
  paris: "CDG",
  london: "LHR",
  tokyo: "HND",
  seattle: "SEA",
  chicago: "ORD",
  rome: "FCO",
  barcelona: "BCN",
  sydney: "SYD",
};

const FLIGHT_PRESETS = [
  {
    matches: ["hawaii", "honolulu", "oahu", "waikiki"],
    airline: "Hawaiian Airlines",
    flightNumber: "HA45",
    originCode: "MCO",
    destinationCode: "HNL",
    originTerminal: "Terminal A",
    destinationTerminal: "Terminal A",
    durationMinutes: 692,
    boardingHour: 5,
    boardingMinute: 30,
    departureHour: 6,
    departureMinute: 0,
  },
  {
    matches: ["paris"],
    airline: "Air France",
    flightNumber: "AF11",
    originCode: "JFK",
    destinationCode: "CDG",
    originTerminal: "Terminal 1",
    destinationTerminal: "Terminal 2E",
    durationMinutes: 435,
    boardingHour: 6,
    boardingMinute: 45,
    departureHour: 7,
    departureMinute: 20,
  },
  {
    matches: ["tokyo"],
    airline: "Japan Airlines",
    flightNumber: "JL61",
    originCode: "LAX",
    destinationCode: "HND",
    originTerminal: "Terminal B",
    destinationTerminal: "Terminal 3",
    durationMinutes: 710,
    boardingHour: 8,
    boardingMinute: 10,
    departureHour: 8,
    departureMinute: 55,
  },
  {
    matches: ["london"],
    airline: "British Airways",
    flightNumber: "BA112",
    originCode: "JFK",
    destinationCode: "LHR",
    originTerminal: "Terminal 8",
    destinationTerminal: "Terminal 5",
    durationMinutes: 420,
    boardingHour: 6,
    boardingMinute: 10,
    departureHour: 6,
    departureMinute: 55,
  },
];

const DEFAULT_TRANSPORT_SAMPLE = {
  provider: "Enterprise",
  vehicleType: "Standard SUV",
  pickupTime: "12:00 PM",
  returnTime: "10:00 AM",
};

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const compactText = (value = "") => String(value).toLowerCase().replace(/[^a-z]/g, "");

const titleCase = (value = "") =>
  String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const getTripField = (tripInfo, key) =>
  tripInfo?.[key] || tripInfo?.destination?.[key] || "";

const getTripDateField = (tripInfo, key) =>
  tripInfo?.date?.[key] || tripInfo?.dates?.[key] || tripInfo?.[key] || "";

const parseDate = (value) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const setClock = (date, hour, minute) => {
  const nextDate = new Date(date);
  nextDate.setHours(hour, minute, 0, 0);
  return nextDate;
};

const formatLongDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const formatShortDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatClockTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const formatDuration = (minutes) => {
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  return `${hours}h ${remainder}m`;
};

const getAirportCode = (value, fallback) => {
  const text = String(value || "").trim();

  if (!text) {
    return fallback;
  }

  if (/^[A-Z]{3,4}$/.test(text)) {
    return text;
  }

  const normalized = compactText(text);
  return AIRPORT_CODES[normalized] || text.slice(0, 3).toUpperCase() || fallback;
};

const getFlightPreset = (tripInfo) => {
  const destinationText = [
    getTripField(tripInfo, "city"),
    getTripField(tripInfo, "state"),
    getTripField(tripInfo, "country"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    FLIGHT_PRESETS.find(({ matches }) =>
      matches.some((match) => destinationText.includes(match))
    ) || FLIGHT_PRESETS[0]
  );
};

const formatTerminal = (value, fallback) => {
  const text = String(value || fallback || "").trim();
  if (!text) return "";
  return /terminal/i.test(text) ? text : `Terminal ${text}`;
};

const hasMeaningfulTravelData = (record, keys) =>
  Boolean(record && keys.some((key) => String(record?.[key] || "").trim()));

const getTransportModeLabel = (transportationValue) => {
  const value = String(transportationValue || "").trim().toLowerCase();

  if (value === "car") return "Rental Car";
  if (value === "train") return "Train Transfer";
  if (value === "other") return "Local Transport";
  if (value === "plane") return "Airport Transfer";
  return DEFAULT_TRANSPORT_SAMPLE.vehicleType;
};

const buildFlightSummary = (tripInfo, storedFlightInfo) => {
  const preset = getFlightPreset(tripInfo);
  const hasSavedFlight = hasMeaningfulTravelData(storedFlightInfo, [
    "airline",
    "flightNumber",
    "originCode",
    "destinationCode",
    "originCity",
    "destinationCity",
  ]);
  const tripArrival = parseDate(getTripDateField(tripInfo, "arrival"));
  const sampleDate = tripArrival || addDays(new Date(), 18);
  const departureTime =
    parseDate(storedFlightInfo?.departureTime) ||
    setClock(sampleDate, preset.departureHour, preset.departureMinute);
  const boardingTime =
    parseDate(storedFlightInfo?.boardingTime) ||
    setClock(sampleDate, preset.boardingHour, preset.boardingMinute);
  const destinationValue =
    storedFlightInfo?.destinationCode ||
    storedFlightInfo?.destinationCity ||
    storedFlightInfo?.destination ||
    getTripField(tripInfo, "city");
  const originValue =
    storedFlightInfo?.originCode ||
    storedFlightInfo?.originCity ||
    storedFlightInfo?.origin ||
    preset.originCode;

  return {
    isPlaceholder: !hasSavedFlight,
    statusLabel: hasSavedFlight ? "Saved Flight" : "Sample Flight",
    helperText: hasSavedFlight
      ? "Using your saved booking details."
      : "You haven't filled this out yet. Showing sample info.",
    airline: storedFlightInfo?.airline || preset.airline,
    flightNumber: storedFlightInfo?.flightNumber || preset.flightNumber,
    originCode: getAirportCode(originValue, preset.originCode),
    destinationCode: getAirportCode(destinationValue, preset.destinationCode),
    originTerminal: formatTerminal(storedFlightInfo?.originTerminal, preset.originTerminal),
    destinationTerminal: formatTerminal(
      storedFlightInfo?.destinationTerminal,
      preset.destinationTerminal
    ),
    dateLabel: formatLongDate(departureTime),
    boardingLabel: formatClockTime(boardingTime),
    departureLabel: formatClockTime(departureTime),
    durationLabel: formatDuration(
      storedFlightInfo?.durationMinutes || preset.durationMinutes
    ),
  };
};

const buildTransportationSummary = (tripInfo, transportationInfo) => {
  const hasSavedTransportation = hasMeaningfulTravelData(transportationInfo, [
    "provider",
    "pickupDate",
    "returnDate",
    "pickupLocation",
    "returnLocation",
    "vehicleType",
    "mode",
  ]);
  const transportationChoice =
    transportationInfo?.mode || transportationInfo?.transportationMode || tripInfo?.transportation;
  const arrivalDate = parseDate(transportationInfo?.pickupDate) ||
    parseDate(getTripDateField(tripInfo, "arrival")) ||
    addDays(new Date(), 18);
  const departureDate = parseDate(transportationInfo?.returnDate) ||
    parseDate(getTripDateField(tripInfo, "departure")) ||
    addDays(arrivalDate, 4);
  const destinationLabel = titleCase(
    transportationInfo?.pickupLocation ||
      transportationInfo?.location ||
      getTripField(tripInfo, "city") ||
      "Honolulu Airport"
  );
  const returnLocationLabel = titleCase(
    transportationInfo?.returnLocation || destinationLabel
  );

  return {
    isPlaceholder: !hasSavedTransportation,
    statusLabel: hasSavedTransportation ? "Saved Transportation" : "Sample Transportation",
    helperText: hasSavedTransportation
      ? "Using your saved transportation details."
      : "You haven't filled this out yet. Showing sample info.",
    pickupDateLabel: formatLongDate(arrivalDate),
    returnDateLabel: formatLongDate(departureDate),
    pickupTime:
      transportationInfo?.pickupTime ||
      transportationInfo?.pickupHour ||
      DEFAULT_TRANSPORT_SAMPLE.pickupTime,
    returnTime:
      transportationInfo?.returnTime ||
      transportationInfo?.returnHour ||
      DEFAULT_TRANSPORT_SAMPLE.returnTime,
    pickupLocation: destinationLabel,
    returnLocation: returnLocationLabel,
    modeLabel:
      transportationInfo?.vehicleType ||
      transportationInfo?.modeLabel ||
      getTransportModeLabel(transportationChoice),
    provider: transportationInfo?.provider || DEFAULT_TRANSPORT_SAMPLE.provider,
    dateRangeLabel: `${formatShortDate(arrivalDate)} - ${formatShortDate(departureDate)}`,
  };
};

const FlightsTransportationPage = () => {
  const navigate = useNavigate();
  const [tripInfo, setTripInfo] = useState(null);
  const [flightInfo, setFlightInfo] = useState(null);
  const [transportationInfo, setTransportationInfo] = useState(null);

  useEffect(() => {
    setTripInfo(parseStoredJson("plan"));
    setFlightInfo(parseStoredJson("flightInfo"));
    setTransportationInfo(parseStoredJson("transportationInfo"));
  }, []);

  const flightSummary = buildFlightSummary(tripInfo, flightInfo);
  const transportationSummary = buildTransportationSummary(tripInfo, transportationInfo);
  const airlineLogoIsBrand = /hawaiian/i.test(flightSummary.airline);
  const providerUsesLogo =
    transportationSummary.isPlaceholder ||
    /enterprise/i.test(transportationSummary.provider);

  return (
    <div className="flights-transportation-page">
      <div className="flights-transportation-shell">
        <div className="transport-booking-grid">
          <section className="transport-booking-card flight-booking-card">
            <div className="booking-status-row">
              <span
                className={`booking-status-chip ${
                  flightSummary.isPlaceholder ? "sample" : "saved"
                }`}
              >
                {flightSummary.statusLabel}
              </span>
              <p>{flightSummary.helperText}</p>
            </div>

            <div className="airline-row">
              <div className={`airline-logo-badge ${airlineLogoIsBrand ? "has-brand" : ""}`}>
                <img
                  src={airlineLogoIsBrand ? hawaiianAirlineImage : planeIcon}
                  alt=""
                  className={`airline-logo-image ${
                    airlineLogoIsBrand ? "airline-logo-image--brand" : ""
                  }`}
                />
              </div>
              <div className="airline-copy">
                <h1>{flightSummary.airline}</h1>
              </div>
            </div>

            <div className="flight-route-row">
              <div className="booking-airport-column">
                <h2>{flightSummary.originCode}</h2>
                <p>{flightSummary.originTerminal}</p>
              </div>

              <div className="booking-route-connector">
                <span className="booking-route-line" />
                <img src={planeIcon} alt="" className="booking-route-plane-icon" />
              </div>

              <div className="booking-airport-column">
                <h2>{flightSummary.destinationCode}</h2>
                <p>{flightSummary.destinationTerminal}</p>
              </div>
            </div>

            <p className="flight-date-label">{flightSummary.dateLabel}</p>

            <div className="booking-divider" />

            <p className="flight-duration">
              <strong>Duration:</strong> {flightSummary.durationLabel}
            </p>

            <div className="flight-times-row">
              <p>
                <strong>Boarding:</strong> {flightSummary.boardingLabel}
              </p>
              <p>
                <strong>Departure:</strong> {flightSummary.departureLabel}
              </p>
            </div>

            <button
              type="button"
              className="booking-primary-button"
              onClick={() => navigate("/track-flight")}
            >
              View Details
            </button>
          </section>

          <section className="transport-booking-card transport-summary-card">
            <div className="booking-status-row">
              <span
                className={`booking-status-chip ${
                  transportationSummary.isPlaceholder ? "sample" : "saved"
                }`}
              >
                {transportationSummary.statusLabel}
              </span>
              <p>{transportationSummary.helperText}</p>
            </div>

            <div className="transport-icon-wrap">
              <div className="transport-icon-ring">
                <img src={carIconImage} alt="" className="transport-icon-image" />
              </div>
            </div>

            <div className="transport-detail-split">
              <div className="transport-detail-column">
                <h2>Pickup</h2>
                <p>{transportationSummary.pickupDateLabel}</p>
                <strong>{transportationSummary.pickupTime}</strong>
                <span>{transportationSummary.pickupLocation}</span>
              </div>

              <div className="transport-detail-divider" />

              <div className="transport-detail-column">
                <h2>Return</h2>
                <p>{transportationSummary.returnDateLabel}</p>
                <strong>{transportationSummary.returnTime}</strong>
                <span>{transportationSummary.returnLocation}</span>
              </div>
            </div>

            <h3 className="transport-mode-title">{transportationSummary.modeLabel}</h3>

            <div className="transport-vehicle-display">
              <img src={suvImage} alt="" className="transport-vehicle-image" />
            </div>

            <div className="transport-provider-row">
              <span
                className={`transport-provider-badge ${
                  providerUsesLogo ? "has-logo" : ""
                }`}
              >
                {providerUsesLogo ? (
                  <img
                    src={enterpriseImage}
                    alt={transportationSummary.provider}
                    className="transport-provider-brand"
                  />
                ) : (
                  transportationSummary.provider
                )}
              </span>
              <p>{transportationSummary.dateRangeLabel}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FlightsTransportationPage;
