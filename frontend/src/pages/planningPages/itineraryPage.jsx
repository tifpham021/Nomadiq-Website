import "../planningPages/itineraryPage.css";
import background from "../../assets/planning-img/itinerary.png";
import lArrow from "../../assets/planning-img/left-arrow.png";
import rArrow from "../../assets/planning-img/right-arrow.png";
import map from "../../assets/planning-img/map.png";
import add from "../../assets/planning-img/add.png";
import trash from "../../assets/planning-img/trash.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDestinationSuggestions } from "./destinationSuggestions.js";
import { apiUrl } from "../../utils/api.js";

const MAX_BOXES = 4;

const formatTimeValue = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const hourMinuteMatch = trimmed.match(/^(\d{1,2})(?::(\d{0,2}))?$/);
  if (hourMinuteMatch) {
    const hour = Number.parseInt(hourMinuteMatch[1], 10);
    if (Number.isNaN(hour)) return trimmed;

    const minute = (hourMinuteMatch[2] || "00").padEnd(2, "0").slice(0, 2);
    return `${hour}:${minute}`;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");

  if (/^\d{3,4}$/.test(digitsOnly)) {
    const hourPart =
      digitsOnly.length === 3 ? digitsOnly.slice(0, 1) : digitsOnly.slice(0, 2);
    const minutePart =
      digitsOnly.length === 3 ? digitsOnly.slice(1) : digitsOnly.slice(2);
    const hour = Number.parseInt(hourPart, 10);

    if (Number.isNaN(hour)) return trimmed;

    return `${hour}:${minutePart.padEnd(2, "0").slice(0, 2)}`;
  }

  if (/^\d{1,2}$/.test(digitsOnly)) {
    const hour = Number.parseInt(digitsOnly, 10);
    if (Number.isNaN(hour)) return trimmed;

    return `${hour}:00`;
  }

  return trimmed;
};

const normalizeBoxes = (boxes = []) =>
  boxes
    .map((box) => ({
      time: formatTimeValue(box?.time || ""),
      activity: box?.activity?.trim() || "",
      checked: Boolean(box?.checked),
    }))
    .filter((box) => box.time || box.activity)
    .slice(0, MAX_BOXES);

const ItineraryPage = () => {
  const [tripInfo, setTripInfo] = useState(null);
  const [tripLength, setTripLength] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [editing, setEditing] = useState(false);
  const [dayData, setDayData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const navigate = useNavigate();
  const suggestions = getDestinationSuggestions(tripInfo);
  const featuredSuggestion =
    suggestions[suggestionIndex % Math.max(suggestions.length, 1)];

  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?._id || storedUser?.id || "";
  };

  const getDateTemp = () => {
    if (!tripInfo?.date?.arrival) return "";

    const startDate = new Date(tripInfo.date.arrival);
    startDate.setDate(startDate.getDate() + currentPage);
    return startDate.toISOString().split("T")[0];
  };

  const updateDayBoxes = (newBoxes) => {
    const dateKey = getDateTemp();
    if (!dateKey) return;

    setDayData((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        dayBoxes: newBoxes.slice(0, MAX_BOXES),
      },
    }));
  };

  const updateNightBoxes = (newBoxes) => {
    const dateKey = getDateTemp();
    if (!dateKey) return;

    setDayData((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        nightBoxes: newBoxes.slice(0, MAX_BOXES),
      },
    }));
  };

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem("plan"));
    if (storedPlan) {
      setTripInfo(storedPlan);
    }
  }, []);

  useEffect(() => {
    if (!tripInfo?.date?.arrival || !tripInfo?.date?.departure) return;

    const start = new Date(tripInfo.date.arrival);
    const end = new Date(tripInfo.date.departure);
    const diffInTime = end - start;
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    setTripLength(Math.max(1, diffInDays));
  }, [tripInfo]);

  useEffect(() => {
    setSuggestionIndex(0);
  }, [tripInfo]);

  const getDateForPage = () => {
    if (!tripInfo?.date?.arrival) return "";

    const startDate = new Date(tripInfo.date.arrival);
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + currentPage);

    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const currentDateKey = getDateTemp();
  const currentDayBoxes = dayData[currentDateKey]?.dayBoxes || [];
  const currentNightBoxes = dayData[currentDateKey]?.nightBoxes || [];

  const loadItinerary = async () => {
    if (!tripInfo) return;

    const date = getDateTemp();
    const userId = getUserId();

    if (!date || !userId) return;

    try {
      const res = await fetch(
        apiUrl(`/api/plan-itinerary?userId=${userId}&date=${date}`)
      );

      if (!res.ok) {
        if (res.status !== 404) {
          console.error("Failed to load itinerary");
        }
        return;
      }

      const data = await res.json();

      setDayData((prev) => ({
        ...prev,
        [date]: {
          dayBoxes: normalizeBoxes(data.dayBoxes),
          nightBoxes: normalizeBoxes(data.nightBoxes),
        },
      }));
    } catch (err) {
      console.error("No itinerary found for this date:", err);
    }
  };

  const saveItinerary = async () => {
    if (!tripInfo) return;

    const date = getDateTemp();
    const userId = getUserId();

    if (!date || !userId) return;

    try {
      const sanitizedDayBoxes = normalizeBoxes(dayData[date]?.dayBoxes);
      const sanitizedNightBoxes = normalizeBoxes(dayData[date]?.nightBoxes);

      setDayData((prev) => ({
        ...prev,
        [date]: {
          ...(prev[date] || {}),
          dayBoxes: sanitizedDayBoxes,
          nightBoxes: sanitizedNightBoxes,
        },
      }));

      const payload = {
        userId,
        date,
        dayBoxes: sanitizedDayBoxes,
        nightBoxes: sanitizedNightBoxes,
      };

      await fetch(apiUrl("/api/plan-itinerary"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to save itinerary:", err);
    }
  };

  const persistCurrentPageState = async () => {
    const date = getDateTemp();

    if (!date || !dayData[date]) return;

    await saveItinerary();
  };

  useEffect(() => {
    loadItinerary();
  }, [tripInfo, currentPage]);

  const handleAddBoxDay = () => {
    if (currentDayBoxes.length >= MAX_BOXES) return;

    updateDayBoxes([
      ...currentDayBoxes,
      { time: "", activity: "", checked: false },
    ]);
  };

  const handleAddBoxNight = () => {
    if (currentNightBoxes.length >= MAX_BOXES) return;

    updateNightBoxes([
      ...currentNightBoxes,
      { time: "", activity: "", checked: false },
    ]);
  };

  const handleDeleteLastDayBox = () => {
    updateDayBoxes(currentDayBoxes.slice(0, -1));
  };

  const handleDeleteLastNightBox = () => {
    updateNightBoxes(currentNightBoxes.slice(0, -1));
  };

  const prevPage = async () => {
    if (currentPage === 0) return;

    await persistCurrentPageState();

    setCurrentPage((prev) => prev - 1);
  };

  const nextPage = async () => {
    if (currentPage >= tripLength - 1) return;

    await persistCurrentPageState();

    setCurrentPage((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    if (!tripInfo) {
      setGenerateError("Trip details were not found.");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      setGenerateError("Please log in before generating an itinerary.");
      return;
    }

    setIsGenerating(true);
    setGenerateError("");

    try {
      const res = await fetch(apiUrl("/api/generate-itinerary"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tripInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate itinerary.");
      }

      if (!data.itineraryByDate) {
        throw new Error("No itinerary was returned.");
      }

      const normalizedItineraryByDate = Object.fromEntries(
        Object.entries(data.itineraryByDate).map(([dateKey, itinerary]) => [
          dateKey,
          {
            dayBoxes: normalizeBoxes(itinerary?.dayBoxes),
            nightBoxes: normalizeBoxes(itinerary?.nightBoxes),
          },
        ])
      );

      setDayData((prev) => ({
        ...prev,
        ...normalizedItineraryByDate,
      }));
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      setGenerateError(error.message || "Failed to generate itinerary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPlanningInputs = (boxes, updateBoxes, readOnly = false) =>
    boxes.map((box, index) => (
      <div className="check-box-inputs" key={index}>
        <input
          type="checkbox"
          className="checkbox"
          checked={box.checked}
          onChange={(e) => {
            const newBoxes = [...boxes];
            newBoxes[index].checked = e.target.checked;
            updateBoxes(newBoxes);
          }}
        />
        <input
          type="text"
          className="check-box-time"
          placeholder="Time..."
          value={box.time || ""}
          readOnly={readOnly}
          onChange={(e) => {
            const newBoxes = [...boxes];
            newBoxes[index].time = e.target.value;
            updateBoxes(newBoxes);
          }}
          onBlur={(e) => {
            if (readOnly) return;

            const formattedTime = formatTimeValue(e.target.value);
            if (formattedTime === (box.time || "")) return;

            const newBoxes = [...boxes];
            newBoxes[index].time = formattedTime;
            updateBoxes(newBoxes);
          }}
        />
        <input
          type="text"
          className="check-box-text"
          placeholder="Enter activity..."
          value={box.activity || ""}
          readOnly={readOnly}
          onChange={(e) => {
            const newBoxes = [...boxes];
            newBoxes[index].activity = e.target.value;
            updateBoxes(newBoxes);
          }}
        />
      </div>
    ));

  const renderBottomButtons = () => (
    <>
      <div className="bottom-buttons">
        <button
          className="arrow"
          type="button"
          onClick={prevPage}
          disabled={currentPage === 0 || isGenerating}
        >
          <img src={lArrow} alt="Previous day" />
        </button>
        <button type="button" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "GENERATING..." : "GENERATE ME ONE"}
        </button>
        <button
          className="arrow"
          type="button"
          onClick={nextPage}
          disabled={currentPage === tripLength - 1 || isGenerating}
        >
          <img src={rArrow} alt="Next day" />
        </button>
      </div>
      {generateError ? <p className="generate-error">{generateError}</p> : null}
    </>
  );

  return (
    <div
      className="itinerary-wrapper"
      style={{
        background: `url(${background})`,
        backgroundPosition: "center",
        height: "87.5vh",
        width: "100vw",
      }}
    >
      <div className="left-boxes">
        <div className="heading">
          <h1 className="day" style={{ textTransform: "uppercase" }}>
            DAY {currentPage + 1}: {getDateForPage()}
          </h1>
          <button
            className="editing-button"
            type="button"
            onClick={async () => {
              if (editing) {
                await saveItinerary();
              }
              setEditing((prev) => !prev);
            }}
            disabled={isGenerating}
          >
            {editing ? "SAVE" : "EDIT"}
          </button>
        </div>
        {editing ? (
          <div className="itinerary">
            <div className="planning-boxes">
              <div className="planning-box1">
                <h2>Day Time</h2>
                {renderPlanningInputs(currentDayBoxes, updateDayBoxes)}
                <div className="editing-buttons">
                  <button type="button" onClick={handleAddBoxDay}>
                    <img src={add} alt="Add day activity" />
                  </button>
                  <button type="button" onClick={handleDeleteLastDayBox}>
                    <img src={trash} alt="Remove day activity" />
                  </button>
                </div>
              </div>
              <div className="planning-box2">
                <h2>Night Time</h2>
                {renderPlanningInputs(currentNightBoxes, updateNightBoxes)}
                <div className="editing-buttons">
                  <button type="button" onClick={handleAddBoxNight}>
                    <img src={add} alt="Add night activity" />
                  </button>
                  <button type="button" onClick={handleDeleteLastNightBox}>
                    <img src={trash} alt="Remove night activity" />
                  </button>
                </div>
              </div>
            </div>
            {renderBottomButtons()}
          </div>
        ) : (
          <div className="itinerary">
            <div className="planning-boxes">
              <div className="planning-box1">
                <h2>Day Time</h2>
                {renderPlanningInputs(currentDayBoxes, updateDayBoxes, true)}
              </div>
              <div className="planning-box2">
                <h2>Night Time</h2>
                {renderPlanningInputs(currentNightBoxes, updateNightBoxes, true)}
              </div>
            </div>
            {renderBottomButtons()}
          </div>
        )}
      </div>
      <div className="right-boxes">
        <div className="map-box">
          <img src={map} className="map" alt="Map preview" />
          <button type="button">
            View More
          </button>
        </div>
        <div className="suggestions-box">
          <h2>What You May Like</h2>
          <div className="suggestion-preview">
            <img
              src={featuredSuggestion.image}
              alt={featuredSuggestion.name}
              className="suggestion-preview-image"
            />
            <p className="suggestion-preview-name">{featuredSuggestion.name}</p>
          </div>
          <div className="suggestions-bottom">
            <button
              className="plus"
              type="button"
              onClick={() =>
                setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
              }
            >
              +
            </button>
            <button
              className="view-more"
              type="button"
              onClick={() =>
                setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
              }
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
