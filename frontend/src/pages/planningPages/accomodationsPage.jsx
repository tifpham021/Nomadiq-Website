import "./accomodationsPage.css";
import pinImage from "../../assets/bookings-img/placeholder_854853 4.png";
import outsideImage from "../../assets/bookings-img/outside.png";
import roomImage from "../../assets/bookings-img/room.png";
import { useEffect, useState } from "react";

const ACCOMMODATION_PRESETS = [
  {
    matches: ["hawaii", "honolulu", "waikiki", "oahu"],
    hotelName: "Outrigger Reef Waikiki Beach Resort",
    address: "2169 Kalia Rd, Honolulu, HI",
    roomDetails: "King Bed, Partial Ocean View",
    cityLabel: "Honolulu",
    accent: "tropical",
  },
  {
    matches: ["paris", "france"],
    hotelName: "Hotel Louvre Saint-Honore",
    address: "141 Rue Saint-Honore, Paris, France",
    roomDetails: "Queen Bed, City View",
    cityLabel: "Paris",
    accent: "city",
  },
  {
    matches: ["tokyo", "japan"],
    hotelName: "Shibuya Stream Excel Hotel Tokyu",
    address: "3 Chome-21-3 Shibuya, Tokyo, Japan",
    roomDetails: "Deluxe Twin, Skyline View",
    cityLabel: "Tokyo",
    accent: "urban",
  },
  {
    matches: ["london", "england", "uk", "united kingdom"],
    hotelName: "The Resident Covent Garden",
    address: "51 Bedford St, London, United Kingdom",
    roomDetails: "King Room, Courtyard View",
    cityLabel: "London",
    accent: "classic",
  },
];

const DEFAULT_PRESET = {
  hotelName: "Sample Destination Hotel",
  address: "123 Ocean Avenue, Sample City",
  roomDetails: "King Bed, Flexible Rate",
  cityLabel: "Sample City",
  accent: "tropical",
};

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

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

const titleCase = (value = "") =>
  String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const formatLongDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const getAccommodationPreset = (tripInfo) => {
  const destinationText = [
    getTripField(tripInfo, "city"),
    getTripField(tripInfo, "state"),
    getTripField(tripInfo, "country"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    ACCOMMODATION_PRESETS.find(({ matches }) =>
      matches.some((match) => destinationText.includes(match))
    ) || DEFAULT_PRESET
  );
};

const hasMeaningfulAccommodationData = (record) =>
  Boolean(
    record &&
      ["hotelName", "address", "roomDetails", "checkInDate", "checkOutDate"].some((key) =>
        String(record?.[key] || "").trim()
      )
  );

const buildAccommodationSummary = (tripInfo, accommodationInfo) => {
  const preset = getAccommodationPreset(tripInfo);
  const hasSavedAccommodation = hasMeaningfulAccommodationData(accommodationInfo);
  const arrivalDate =
    parseDate(accommodationInfo?.checkInDate) ||
    parseDate(getTripDateField(tripInfo, "arrival")) ||
    addDays(new Date(), 18);
  const departureDate =
    parseDate(accommodationInfo?.checkOutDate) ||
    parseDate(getTripDateField(tripInfo, "departure")) ||
    addDays(arrivalDate, 4);

  return {
    isPlaceholder: !hasSavedAccommodation,
    statusLabel: hasSavedAccommodation ? "Saved Accommodation" : "Sample Accommodation",
    helperText: hasSavedAccommodation
      ? "Using your saved lodging details."
      : "You haven't filled this out yet. Showing sample info.",
    hotelName: accommodationInfo?.hotelName || preset.hotelName,
    address: accommodationInfo?.address || preset.address,
    roomDetails: accommodationInfo?.roomDetails || preset.roomDetails,
    checkInTime: accommodationInfo?.checkInTime || "1:00 PM",
    checkOutTime: accommodationInfo?.checkOutTime || "11:00 AM",
    checkInDateLabel: formatLongDate(arrivalDate),
    checkOutDateLabel: formatLongDate(departureDate),
    cityLabel:
      accommodationInfo?.cityLabel ||
      titleCase(getTripField(tripInfo, "city")) ||
      preset.cityLabel,
    accent: accommodationInfo?.accent || preset.accent,
  };
};

const AccomodationsPage = () => {
  const [tripInfo, setTripInfo] = useState(null);
  const [accommodationInfo, setAccommodationInfo] = useState(null);

  useEffect(() => {
    setTripInfo(parseStoredJson("plan"));
    setAccommodationInfo(parseStoredJson("accommodationInfo"));
  }, []);

  const accommodation = buildAccommodationSummary(tripInfo, accommodationInfo);

  return (
    <div className="accomodations-page">
      <div className="accomodations-shell">
        <header className="accomodations-header">
          <h1>Your Booked Accommodations</h1>
        </header>

        <section className="accomodation-card">
          <div className="accomodation-visual-column">
            <div className={`accomodation-visual-stack accent-${accommodation.accent}`}>
              <div className="accomodation-photo accomodation-photo-exterior">
                <div className="photo-label">Exterior View</div>
                <img
                  src={outsideImage}
                  alt={`${accommodation.hotelName} exterior`}
                  className="accomodation-photo-image"
                />
              </div>

              <div className="accomodation-photo accomodation-photo-room">
                <div className="photo-label">Room Preview</div>
                <img
                  src={roomImage}
                  alt={`${accommodation.hotelName} room`}
                  className="accomodation-photo-image"
                />
              </div>
            </div>
          </div>

          <div className="accomodation-info-column">
            <div className="accomodation-status-row">
              <span
                className={`accomodation-status-chip ${
                  accommodation.isPlaceholder ? "sample" : "saved"
                }`}
              >
                {accommodation.statusLabel}
              </span>

              <p className="accomodation-helper-text">{accommodation.helperText}</p>
            </div>

            <h2>{accommodation.hotelName}</h2>

            <div className="accomodation-address-row">
              <img src={pinImage} alt="" />
              <p>{accommodation.address}</p>
            </div>

            <div className="accomodation-stay-grid">
              <div className="accomodation-stay-block">
                <h3>Check In</h3>
                <strong>{accommodation.checkInTime}</strong>
                <p>{accommodation.checkInDateLabel}</p>
              </div>

              <div className="accomodation-stay-block">
                <h3>Check Out</h3>
                <strong>{accommodation.checkOutTime}</strong>
                <p>{accommodation.checkOutDateLabel}</p>
              </div>
            </div>

            <p className="accomodation-room-line">
              <strong>Room Details:</strong> {accommodation.roomDetails}
            </p>

            <button type="button" className="accomodation-view-button">
              View More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccomodationsPage;
