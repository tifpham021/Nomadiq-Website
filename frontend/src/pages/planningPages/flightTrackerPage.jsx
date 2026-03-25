import "./flightTrackerPage.css";
import background from "../../assets/planning-img/flight-tracker.png";
import plane from "../../assets/planning-img/plane.png";
import { useEffect, useState } from "react";

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
    originGate: "10",
    destinationGate: "12",
    originTerminal: "A",
    destinationTerminal: "A",
    durationMinutes: 692,
    tsaWaitMinutes: 30,
    precheckAvailable: false,
  },
  {
    matches: ["paris"],
    airline: "Air France",
    flightNumber: "AF11",
    originCode: "JFK",
    destinationCode: "CDG",
    originGate: "5",
    destinationGate: "K34",
    originTerminal: "1",
    destinationTerminal: "2E",
    durationMinutes: 435,
    tsaWaitMinutes: 26,
    precheckAvailable: true,
  },
  {
    matches: ["tokyo"],
    airline: "Japan Airlines",
    flightNumber: "JL61",
    originCode: "LAX",
    destinationCode: "HND",
    originGate: "157",
    destinationGate: "112",
    originTerminal: "B",
    destinationTerminal: "3",
    durationMinutes: 710,
    tsaWaitMinutes: 38,
    precheckAvailable: true,
  },
  {
    matches: ["london"],
    airline: "British Airways",
    flightNumber: "BA112",
    originCode: "JFK",
    destinationCode: "LHR",
    originGate: "6",
    destinationGate: "B46",
    originTerminal: "8",
    destinationTerminal: "5",
    durationMinutes: 420,
    tsaWaitMinutes: 24,
    precheckAvailable: true,
  },
];

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasMeaningfulFlightData = (record) =>
  Boolean(
    record &&
      [
        "airline",
        "flightNumber",
        "originCode",
        "destinationCode",
        "originCity",
        "destinationCity",
      ].some((key) => String(record?.[key] || "").trim())
  );

const compactText = (value = "") => value.toLowerCase().replace(/[^a-z]/g, "");

const getAirportCode = (city, fallback = "HNL") => {
  if (!city) return fallback;

  const normalized = compactText(city);
  return AIRPORT_CODES[normalized] || city.slice(0, 3).toUpperCase() || fallback;
};

const getPreset = (tripInfo) => {
  const destinationText = [tripInfo?.city, tripInfo?.state, tripInfo?.country]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    FLIGHT_PRESETS.find(({ matches }) =>
      matches.some((match) => destinationText.includes(match))
    ) || FLIGHT_PRESETS[0]
  );
};

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

const getTimeZoneAbbreviation = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
  });
  const timezonePart = formatter
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName");

  return timezonePart?.value || "";
};

const formatClockTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const formatDayLabel = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const formatDuration = (minutes) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;

  return `${hours}h ${remainder}m`;
};

const formatCountdown = (minutes) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;

  if (hours === 0) {
    return `${remainder}m`;
  }

  return `${hours}h ${remainder}m`;
};

const buildFallbackFlight = (tripInfo, referenceTime) => {
  const preset = getPreset(tripInfo);
  const departureTime = addMinutes(referenceTime, 90);
  const boardingTime = addMinutes(referenceTime, 45);
  const arrivalTime = addMinutes(departureTime, preset.durationMinutes);
  const destinationCode = tripInfo?.city
    ? getAirportCode(tripInfo.city, preset.destinationCode)
    : preset.destinationCode;

  return {
    airline: preset.airline,
    flightNumber: preset.flightNumber,
    originCode: preset.originCode,
    destinationCode,
    originGate: preset.originGate,
    destinationGate: preset.destinationGate,
    originTerminal: preset.originTerminal,
    destinationTerminal: preset.destinationTerminal,
    departureTime: departureTime.toISOString(),
    boardingTime: boardingTime.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    durationMinutes: preset.durationMinutes,
    tsaWaitMinutes: preset.tsaWaitMinutes,
    precheckAvailable: preset.precheckAvailable,
    destinationCity: tripInfo?.city || "Honolulu",
    originCity: "Orlando",
    checklist: [
      `Arrive at airport by ${formatClockTime(addMinutes(departureTime, -120))}`,
      "Review baggage policy and carry-on size",
      "Keep ID, passport, chargers, and headphones ready",
      "Download your boarding pass before security",
    ],
  };
};

const buildFlightData = (tripInfo, storedFlightInfo, referenceTime) => {
  const fallback = buildFallbackFlight(tripInfo, referenceTime);
  const merged = {
    ...fallback,
    ...(storedFlightInfo || {}),
  };

  const rawDepartureTime = new Date(merged.departureTime);
  const rawBoardingTime = new Date(merged.boardingTime);
  const rawArrivalTime = new Date(merged.arrivalTime);
  const departureTime = isValidDate(rawDepartureTime)
    ? rawDepartureTime
    : new Date(fallback.departureTime);
  const boardingTime = isValidDate(rawBoardingTime)
    ? rawBoardingTime
    : new Date(fallback.boardingTime);
  const arrivalTime = isValidDate(rawArrivalTime)
    ? rawArrivalTime
    : new Date(fallback.arrivalTime);

  return {
    ...merged,
    originCode: (merged.originCode || fallback.originCode).toUpperCase(),
    destinationCode: (merged.destinationCode || fallback.destinationCode).toUpperCase(),
    departureTime,
    boardingTime,
    arrivalTime,
    durationMinutes:
      merged.durationMinutes ||
      Math.max(0, Math.round((arrivalTime - departureTime) / 60000)),
  };
};

const getStatusDetails = (flightData, currentTime) => {
  const now = currentTime.getTime();
  const boarding = flightData.boardingTime.getTime();
  const departure = flightData.departureTime.getTime();
  const arrival = flightData.arrivalTime.getTime();

  if (now < boarding) {
    return {
      label: "ON TIME",
      tone: "good",
      detail: `Boards in ${formatCountdown((boarding - now) / 60000)}`,
    };
  }

  if (now < departure) {
    return {
      label: "BOARDING",
      tone: "warning",
      detail: `Departs in ${formatCountdown((departure - now) / 60000)}`,
    };
  }

  if (now < arrival) {
    return {
      label: "IN AIR",
      tone: "sky",
      detail: `Lands in ${formatCountdown((arrival - now) / 60000)}`,
    };
  }

  return {
    label: "LANDED",
    tone: "muted",
    detail: `Arrived ${formatCountdown((now - arrival) / 60000)} ago`,
  };
};

const FlightTrackerPage = () => {
  const [tripInfo, setTripInfo] = useState(null);
  const [storedFlightInfo, setStoredFlightInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [referenceTime] = useState(() => new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);

  useEffect(() => {
    setTripInfo(parseStoredJson("plan"));
    setStoredFlightInfo(parseStoredJson("flightInfo"));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const flightData = buildFlightData(tripInfo, storedFlightInfo, referenceTime);
  const hasSavedFlight = hasMeaningfulFlightData(storedFlightInfo);
  const statusDetails = getStatusDetails(flightData, currentTime);
  const timezoneLabel = getTimeZoneAbbreviation(currentTime);
  const arrivalTimezoneLabel = getTimeZoneAbbreviation(flightData.arrivalTime);
  const departureDateLabel = formatDayLabel(currentTime);

  useEffect(() => {
    setChecklistItems(
      (flightData.checklist || []).map((item) =>
        typeof item === "string" ? { label: item, checked: false } : item
      )
    );
  }, [tripInfo, storedFlightInfo, referenceTime]);

  return (
    <div
      className="flight-tracker-page"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="flight-tracker-shell">
        <div className="flight-tracker-actions">
          {!hasSavedFlight ? (
            <div className="flight-sample-note">
              <span className="flight-sample-chip">Sample Flight</span>
              <p>You haven't filled this out yet. Showing sample info.</p>
            </div>
          ) : null}

          <button
            type="button"
            className={`notify-button ${notificationsEnabled ? "enabled" : ""}`}
            onClick={() => setNotificationsEnabled((prev) => !prev)}
          >
            {notificationsEnabled ? "Notifications Enabled" : "Enable Notifications"}
          </button>
        </div>

        <div className="flight-tracker-grid">
          <section className="tracker-card route-card">
            <div className="route-header">
              <div className="airline-badge">
                {flightData.airline.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2>{flightData.airline}</h2>
                <p>{flightData.flightNumber}</p>
              </div>
            </div>

            <div className="route-line">
              <div>
                <h3>{flightData.originCode}</h3>
                <p>Gate {flightData.originGate}</p>
              </div>
              <div className="route-plane">
                <img src={plane} alt="Plane" />
              </div>
              <div>
                <h3>{flightData.destinationCode}</h3>
                <p>Gate {flightData.destinationGate}</p>
              </div>
            </div>

            <div className="route-footer">
              Duration of Flight: {formatDuration(flightData.durationMinutes)}
            </div>
          </section>

          <section className="tracker-card clock-card">
            <div className="clock-ring" />
            <div className="clock-content">
              <div className="clock-time-row">
                <h2>{formatClockTime(currentTime)}</h2>
                <span>{timezoneLabel}</span>
              </div>
              <p>{departureDateLabel}</p>
            </div>
          </section>

          <section className="tracker-card airport-card">
            <h2 className="tracker-title">Airport Details</h2>
            <div className="detail-panel">
              <div className="detail-row">
                <span className="detail-label">TSA Wait time:</span>
                <span>{flightData.tsaWaitMinutes} mins</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">PreCheck Available?</span>
                <span
                  className={`pill ${flightData.precheckAvailable ? "yes" : "no"}`}
                >
                  {flightData.precheckAvailable ? "Yes" : "No"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Boarding Group:</span>
                <span>{storedFlightInfo?.boardingGroup || "Group 2"}</span>
              </div>
            </div>
          </section>

          <section className="tracker-card map-card">
            <div className="map-surface">
              <svg
                className="map-route"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M20 72 C35 42, 65 38, 85 76"
                  pathLength="100"
                />
              </svg>
              <img src={plane} alt="" className="map-plane" />
              <div className="map-badge map-origin">{flightData.originCode}</div>
              <div className="map-badge map-destination">
                {flightData.destinationCode}
              </div>
              <div className="map-cloud cloud-left" />
              <div className="map-cloud cloud-right" />
            </div>
          </section>

          <section className="tracker-card status-card">
            <h2 className="tracker-title">Live Status</h2>
            <div className="detail-panel status-panel">
              <div className="status-head">
                <span className={`status-dot ${statusDetails.tone}`} />
                <div>
                  <h3>{statusDetails.label}</h3>
                  <p>{statusDetails.detail}</p>
                </div>
              </div>

              <div className="status-list">
                <div className="status-list-row">
                  <span>Boarding Time:</span>
                  <span>
                    {formatClockTime(flightData.boardingTime)} ({timezoneLabel})
                  </span>
                </div>
                <div className="status-list-row">
                  <span>Departure:</span>
                  <span>
                    {formatClockTime(flightData.departureTime)} ({timezoneLabel})
                  </span>
                </div>
                <div className="status-list-row">
                  <span>Arrival:</span>
                  <span>
                    {formatClockTime(flightData.arrivalTime)} ({arrivalTimezoneLabel})
                  </span>
                </div>
              </div>
            </div>

            <div className="terminal-strip">
              <div>
                <p>{`Terminal ${flightData.originTerminal}`}</p>
                <p>{`Gate ${flightData.originGate}`}</p>
              </div>
              <div className="terminal-arrow">→</div>
              <div>
                <p>{`Terminal ${flightData.destinationTerminal}`}</p>
                <p>{`Gate ${flightData.destinationGate}`}</p>
              </div>
            </div>
          </section>

          <section className="tracker-card checklist-card">
            <h2 className="tracker-title">Travel Checklist</h2>
            <div className="detail-panel checklist-panel">
              {checklistItems.map((item, index) => (
                <label className="checklist-item" key={`${item.label}-${index}`}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {
                      setChecklistItems((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, checked: !entry.checked }
                            : entry
                        )
                      );
                    }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FlightTrackerPage;
