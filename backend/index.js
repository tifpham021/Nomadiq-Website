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

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
  })
);

const apiKey = process.env.VITE_WEATHER_API_KEY;
const days = 5;

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

app.use(express.json());

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
    const resetUrl = `http://localhost:5173/resetting-pass/${resetToken}`;

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

app.listen(3000, () => {
  connectDB();
  console.log("Server started at http://localhost:3000");
});
