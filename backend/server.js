/** @format */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Capture from "./capture.model.js";

dotenv.config();

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Capture route
app.post("/capture", async (req, res) => {
  const { name, img } = req.body;

  if (!name || !img) {
    return res.status(400).json({
      success: false,
      message: "Please take a snap before submitting",
    });
  }

  const newCapture = new Capture({ name, img });

  try {
    await newCapture.save();
    res
      .status(201)
      .json({ success: true, message: "Capture added successfully!" });
  } catch (error) {
    console.error(`Error in creating capture: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Server Error in adding the capture" });
  }
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to the DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
