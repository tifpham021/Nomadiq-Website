import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import Message from './models/faqs.model.js';
import User from './models/signup.model.js';

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/faqs", async (req,res) => {
    const question = req.body;

    if(!question) {
        return res.status(400).json({success:false, message: "Please type in a message before submitting"});
    }

    const newMessage = new Message(question);

    try {
        await newMessage.save();
        res.status(201).json({success: true, data:newMessage});
    } catch (error) {
        console.error("Error in Create message:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

app.post("/api/signup", async (req,res) => {
    const user = req.body;
    if (!user.username || !user.email || !user.password || !user.confirmpass) {
        return res.status(400).json({success:false, message: "Please fill out all fields"});
    }

    if (user.password !== user.confirmpass) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }
    const { confirmpass, ...userData } = user;
    const newUser = new User(userData)
    try {
        await newUser.save();
        res.status(201).json({success: true, data:newUser});
    } catch (error) {
        console.error("Error in Create user:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
})

app.listen(3000, () => {
    connectDB();
    console.log('Server started at http://localhost:3000'); 
});

