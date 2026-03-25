import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Message from "./models/faqs.model.js";
import User from "./models/signup.model.js";
import UserPlan from "./models/planning.model.js";
import { Resend } from "resend";
import crypto from "crypto";
import fetch from "node-fetch";
import Itinerary from "./models/itinerary.model.js";
import cors from "cors";
import OpenAI from "openai";


dotenv.config();

const DEFAULT_FRONTEND_URL = "http://localhost:5173";
const allowedOrigins = (process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const primaryFrontendUrl = allowedOrigins[0] || DEFAULT_FRONTEND_URL;
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(express.json());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);

const apiKey = process.env.WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY;
const days = 5;

const formatDestination = ({ city, state, country }) =>
  [city, state, country].filter(Boolean).join(", ");

const getTripDates = (arrival, departure) => {
  const start = new Date(arrival);
  const end = new Date(departure);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }

  const dates = [];
  const current = new Date(start);

  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  if (dates.length === 0) {
    dates.push(start.toISOString().split("T")[0]);
  }

  return dates;
};

const sanitizeBoxes = (boxes = []) =>
  boxes
    .slice(0, 4)
    .map((box) => ({
      checked: Boolean(box?.checked),
      time: typeof box?.time === "string" ? box.time.trim() : "",
      activity: typeof box?.activity === "string" ? box.activity.trim() : "",
    }))
    .filter((box) => box.time || box.activity);

const normalizeGeneratedDays = (generatedDays = [], itineraryDates = []) =>
  itineraryDates.reduce((acc, date, index) => {
    const matchingDay =
      generatedDays.find((day) => day?.date === date) || generatedDays[index] || {};

    acc[date] = {
      dayBoxes: sanitizeBoxes(matchingDay.dayBoxes || []),
      nightBoxes: sanitizeBoxes(matchingDay.nightBoxes || []),
    };

    return acc;
  }, {});

const buildWeatherSummary = (forecastData, itineraryDates) => {
  const forecastByDate = new Map(
    (forecastData?.forecast?.forecastday || []).map((forecastDay) => [
      forecastDay.date,
      forecastDay,
    ])
  );

  return itineraryDates.map((date) => {
    const forecastDay = forecastByDate.get(date);

    if (!forecastDay) {
      return {
        date,
        summary: "Forecast unavailable. Use typical seasonal expectations for this destination.",
      };
    }

    return {
      date,
      summary: `${forecastDay.day.condition.text}, average ${forecastDay.day.avgtemp_f}F, high ${forecastDay.day.maxtemp_f}F, low ${forecastDay.day.mintemp_f}F, rain chance ${forecastDay.day.daily_chance_of_rain}%. Sunrise ${forecastDay.astro.sunrise}, sunset ${forecastDay.astro.sunset}.`,
    };
  });
};

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Error fetching weather data from API" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

app.post("/api/faqs", async (req, res) => {
  const question = req.body;

  if (!question) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please type in a message before submitting",
      });
  }

  const newMessage = new Message(question);

  try {
    await newMessage.save();
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("Error in Create message:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/signup", async (req, res) => {
  const user = req.body;
  if (!user.username || !user.email || !user.password || !user.confirmpass) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill out all fields" });
  }

  if (user.password !== user.confirmpass) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
  const { confirmpass, ...userData } = user;
  const newUser = new User(userData);
  try {
    await newUser.save();
    res
      .status(201)
      .json({
        success: true,
        data: newUser,
        message: "Your account was successfully created!",
      });
  } catch (error) {
    console.error("Error in Create user:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(". ") });
    }

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists." });
    }

    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill out all fields" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/resetting-pass-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please enter the email you registered with",
      });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "This email isn't in our database" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 10 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save({ validateBeforeSave: false });

    // Return reset URL to frontend
    const resetUrl = `${primaryFrontendUrl}/resetting-pass/${resetToken}`;

    await resend.emails.send({
      from: "Nomadiq <onboarding@resend.dev>", // or use your verified domain
      to: email,
      subject: "Reset Your Password",
      html: `
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset it (valid for 10 minutes):</p>
            <a href="${resetUrl}">${resetUrl}</a>
        `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email!",
    });
  } catch (err) {
    console.error("Email error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/resetting-password/:token", async (req, res) => {
  const { password } = req.body;
  console.log("Incoming token:", req.params.token);
  console.log("Password:", password);
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() },
    });
    console.log("User found:", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/choose-destination-dates", async (req, res) => {
  const { destination, userId, date, transportation } = req.body;
  const { arrival, departure } = date;
  console.log("Request body:", req.body);
  if (
    !destination ||
    !destination.city ||
    !destination.country ||
    !userId ||
    !transportation ||
    !arrival ||
    !departure
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  if (!destination || !destination.city || !destination.country) {
    return res
      .status(400)
      .json({
        success: false,
        message: "City and country required inside destination",
      });
  }
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  if (!date || !date.arrival || !date.departure) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Arrival and departure dates are required",
      });
  }
  if (!transportation) {
    return res
      .status(400)
      .json({ success: false, message: "Transportation is required" });
  }

  try {
    const userPlan = new UserPlan({
      city: destination.city,
      state: destination.state,
      country: destination.country,
      userId,
      date,
      transportation,
    });
    await userPlan.save();
    return res.status(200).json({
      success: true,
      message: "Plan was saved successfully",
      userPlan,
    });
  } catch (error) {
    console.error("Error saving plan:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/plan-itinerary", async (req, res) => {
  try {
    const { userId, date, dayBoxes, nightBoxes } = req.body;

    const updated = await Itinerary.findOneAndUpdate(
      { userId, date },
      { dayBoxes, nightBoxes },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error saving itinerary", error: err });
  }
});

app.get("/api/plan-itinerary", async (req, res) => {
  const { userId, date } = req.query;
  const itinerary = await Itinerary.findOne({ userId, date });
  if (!itinerary) return res.status(404).json({ error: "Not found" });
  res.json(itinerary);
});

app.post("/api/generate-itinerary", async (req, res) => {
  const { userId, tripInfo } = req.body;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key is not configured" });
    }

    if (!userId || !tripInfo?.city || !tripInfo?.country || !tripInfo?.date?.arrival || !tripInfo?.date?.departure) {
      return res.status(400).json({ error: "Missing trip details" });
    }

    const destination = formatDestination(tripInfo);
    const itineraryDates = getTripDates(
      tripInfo.date.arrival,
      tripInfo.date.departure
    );

    if (itineraryDates.length === 0) {
      return res.status(400).json({ error: "Trip dates are invalid" });
    }

    let weatherSummary = [];

    if (apiKey) {
      const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(destination)}&days=${Math.min(Math.max(itineraryDates.length, 1), days)}`;
      const weatherResponse = await fetch(forecastUrl);

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        weatherSummary = buildWeatherSummary(weatherData, itineraryDates);
      }
    }

    const prompt = `
Return valid JSON only with this shape:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayBoxes": [
        { "checked": false, "time": "9:00 AM", "activity": "string" }
      ],
      "nightBoxes": [
        { "checked": false, "time": "6:30 PM", "activity": "string" }
      ]
    }
  ]
}

Create a trip itinerary for:
- Destination: ${destination}
- Arrival date: ${tripInfo.date.arrival}
- Departure date: ${tripInfo.date.departure}
- Transportation: ${tripInfo.transportation || "Not specified"}
- Dates to fill exactly: ${itineraryDates.join(", ")}

Weather context by date:
${weatherSummary.length > 0 ? weatherSummary.map((day) => `- ${day.date}: ${day.summary}`).join("\n") : "- Weather forecast unavailable. Use reasonable assumptions for the destination and season."}

Rules:
- Return one object per listed date, in the same order.
- Put daytime activities in "dayBoxes" and evening activities in "nightBoxes".
- Include 2 to 4 boxes in each section.
- Keep "checked" false for every item.
- Use concise activity text that fits a UI input box.
- Use specific times.
- Prefer realistic tourist activities, meals, neighborhoods, landmarks, and weather-aware suggestions.
- Do not include markdown or any text outside the JSON object.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a travel planner that returns strict JSON for a trip itinerary UI.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || "{}");
    const itineraryByDate = normalizeGeneratedDays(
      parsed.days || [],
      itineraryDates
    );

    const hasGeneratedActivities = Object.values(itineraryByDate).some(
      (day) => day.dayBoxes.length > 0 || day.nightBoxes.length > 0
    );

    if (!hasGeneratedActivities) {
      return res.status(500).json({ error: "Generated itinerary was empty" });
    }

    await Promise.all(
      itineraryDates.map((date) =>
        Itinerary.findOneAndUpdate(
          { userId, date },
          {
            userId,
            date,
            dayBoxes: itineraryByDate[date].dayBoxes,
            nightBoxes: itineraryByDate[date].nightBoxes,
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.json({ itineraryByDate });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

connectDB();

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
