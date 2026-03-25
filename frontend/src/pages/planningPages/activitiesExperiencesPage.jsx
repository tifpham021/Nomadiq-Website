import "./activitiesExperiencesPage.css";
import { useEffect, useState } from "react";
import pinImage from "../../assets/activities-experiences-img/placeholder_854853 2.png";
import snorkelImage from "../../assets/activities-experiences-img/snorkling 1.png";
import cruiseImage from "../../assets/activities-experiences-img/catamaran cruise 1.png";
import ticketImage from "../../assets/activities-experiences-img/ticket.png";
import calendarImage from "../../assets/activities-experiences-img/calendar.png";
import messageImage from "../../assets/activities-experiences-img/message.png";

const SAMPLE_EXPERIENCES = [
  {
    title: "Snorkeling at Hanauma Bay",
    dayOffset: 0,
    startTime: "12:00 PM",
    endTime: "2:00 PM",
    location: "Hanauma Bay Nature Preserve",
    included: "Snorkeling gear, guide",
    status: "Confirmed",
    theme: "snorkel",
  },
  {
    title: "Sunset Catamaran Cruise",
    dayOffset: 1,
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    location: "2335 Kalakaua Ave, Honolulu, HI",
    included: "Drinks, snacks, views",
    status: "Confirmed",
    theme: "cruise",
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

const formatLongDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const titleCase = (value = "") =>
  String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const collectStoredExperiences = (stored) => {
  if (Array.isArray(stored)) return stored;
  if (Array.isArray(stored?.activities)) return stored.activities;
  if (Array.isArray(stored?.experiences)) return stored.experiences;
  if (Array.isArray(stored?.items)) return stored.items;
  return [];
};

const inferTheme = (record) => {
  const text = [
    record?.title,
    record?.name,
    record?.location,
    record?.included,
    record?.details,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(snorkel|dive|reef|beach|bay)/.test(text)) return "snorkel";
  if (/(cruise|catamaran|sail|boat|harbor|pier)/.test(text)) return "cruise";
  if (/(food|market|tasting|dinner|brunch|cook)/.test(text)) return "food";
  if (/(museum|gallery|tower|history|temple|louvre|borderless)/.test(text)) {
    return "culture";
  }
  return "city";
};

const normalizeExperience = (record, fallbackDate) => {
  const startDate = parseDate(record?.date || record?.startDate || record?.datetime) || fallbackDate;
  const dateLabel = startDate ? formatLongDate(startDate) : titleCase(record?.date || "");
  const startTime = String(record?.startTime || record?.timeStart || record?.time || "").trim();
  const endTime = String(record?.endTime || record?.timeEnd || "").trim();
  const timeLabel =
    record?.timeLabel ||
    (startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime || "Time TBD");

  return {
    title: record?.title || record?.name || "Planned Experience",
    dateLabel: dateLabel || "Date TBD",
    timeLabel,
    location: record?.location || record?.address || "Location TBD",
    included: record?.included || record?.details || "Details will appear here",
    status: titleCase(record?.status || "Confirmed"),
    theme: record?.theme || inferTheme(record),
  };
};

const hasMeaningfulExperienceData = (items) =>
  items.some((item) =>
    ["title", "name", "location", "address", "included", "details"].some((key) =>
      String(item?.[key] || "").trim()
    )
  );

const buildExperienceSummary = (tripInfo, storedExperiences) => {
  const storedItems = collectStoredExperiences(storedExperiences);
  const hasSavedExperiences = hasMeaningfulExperienceData(storedItems);
  const arrivalDate =
    parseDate(getTripDateField(tripInfo, "arrival")) || addDays(new Date(), 18);

  const items = hasSavedExperiences
    ? storedItems.map((item, index) => normalizeExperience(item, addDays(arrivalDate, index)))
    : SAMPLE_EXPERIENCES.map((item) =>
        normalizeExperience(
          {
            ...item,
            date: addDays(arrivalDate, item.dayOffset || 0),
          },
          addDays(arrivalDate, item.dayOffset || 0)
        )
      );

  return {
    isPlaceholder: !hasSavedExperiences,
    statusLabel: hasSavedExperiences ? "Saved Experiences" : "Sample Experiences",
    helperText: hasSavedExperiences
      ? "Using your saved activity details."
      : "You haven't filled this out yet. Showing sample info.",
    items,
  };
};

const getExperienceImage = (experience) => {
  const text = [experience?.title, experience?.location, experience?.included]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(snorkel|reef|bay|ocean|dive|beach)/.test(text)) {
    return snorkelImage;
  }

  if (/(cruise|catamaran|boat|harbor|pier|sunset|sail)/.test(text)) {
    return cruiseImage;
  }

  return cruiseImage;
};

const ActivitiesExperiencesPage = () => {
  const [tripInfo, setTripInfo] = useState(null);
  const [experiencesInfo, setExperiencesInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setTripInfo(parseStoredJson("plan"));
    setExperiencesInfo(
      parseStoredJson("activitiesInfo") || parseStoredJson("experiencesInfo")
    );
  }, []);

  const experienceSummary = buildExperienceSummary(tripInfo, experiencesInfo);
  const normalizedSearch = searchValue.trim().toLowerCase();
  const visibleExperiences = experienceSummary.items.filter((item) => {
    if (!normalizedSearch) return true;

    return [item.title, item.location, item.included, item.dateLabel]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  return (
    <div className="activities-experiences-page">
      <div className="activities-experiences-shell">
        <header className="activities-experiences-header">
          <div className="activities-header-copy">
            <h1>Your Booked Experiences</h1>

            <div className="activities-status-row">
              <span
                className={`activities-status-chip ${
                  experienceSummary.isPlaceholder ? "sample" : "saved"
                }`}
              >
                {experienceSummary.statusLabel}
              </span>
              <p>{experienceSummary.helperText}</p>
            </div>
          </div>

          <label className="activities-search-bar" aria-label="Search experiences">
            <span className="activities-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>
        </header>

        <div className="activities-experience-list">
          {visibleExperiences.length ? (
            visibleExperiences.map((experience, index) => (
              <section className="activities-experience-card" key={`${experience.title}-${index}`}>
                <div className={`activities-experience-visual theme-${experience.theme}`}>
                  <img
                    src={getExperienceImage(experience)}
                    alt={experience.title}
                    className="activities-experience-image"
                  />
                  <span className="activities-visual-tag">
                    {experience.theme === "snorkel"
                      ? "Ocean Adventure"
                      : experience.theme === "cruise"
                        ? "Sunset Cruise"
                        : experience.theme === "food"
                          ? "Local Favorite"
                          : experience.theme === "culture"
                            ? "Booked Tour"
                            : "City Experience"}
                  </span>
                </div>

                <div className="activities-experience-content">
                  <h2>{experience.title}</h2>
                  <p className="activities-experience-time">
                    {experience.dateLabel} <span>|</span> {experience.timeLabel}
                  </p>

                  <div className="activities-experience-location">
                    <img src={pinImage} alt="" />
                    <p>{experience.location}</p>
                  </div>

                  <p className="activities-experience-included">
                    <strong>Included:</strong> {experience.included}
                  </p>

                  <div className="activities-experience-status">
                    <strong>Status:</strong>
                    <span className="activities-status-dot" aria-hidden="true" />
                    <span className="activities-status-text">
                      {String(experience.status || "Confirmed").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="activities-experience-actions">
                  <div className="activities-ticket-row">
                    <button type="button" className="activities-ticket-button">
                      View Ticket
                    </button>

                    <button
                      type="button"
                      className="activities-icon-button"
                      aria-label="View ticket"
                    >
                      <img src={ticketImage} alt="" className="activities-button-icon-image ticket" />
                    </button>
                  </div>

                  <button type="button" className="activities-secondary-button">
                    <img src={calendarImage} alt="" className="activities-button-icon-image" />
                    Add to Calendar
                  </button>

                  <button type="button" className="activities-secondary-button">
                    <img src={messageImage} alt="" className="activities-button-icon-image" />
                    Message Provider
                  </button>
                </div>
              </section>
            ))
          ) : (
            <section className="activities-empty-state">
              <h2>No experiences match your search.</h2>
              <p>Try a different keyword or clear the search field.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesExperiencesPage;
