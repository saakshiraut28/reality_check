/** @format */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Capture from "./capture.model.js";
import multer from "multer";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// Multer for parsing formData
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to the DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Capture route for blobs stored in MongoDB
app.post("/capture", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const newCapture = new Capture({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
  });

  try {
    await newCapture.save();
    res.status(201).json({ message: "Blob saved successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Route to fetch a file
app.get("/capture/:id", async (req, res) => {
  try {
    const capture = await Capture.findById(req.params.id);
    if (!capture) {
      return res.status(404).json({ error: "Blob not found" });
    }
    res.contentType(capture.contentType);
    res.send(capture.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Route to fetch metadata for all captures
app.get("/captures", async (req, res) => {
  try {
    const captures = await Capture.find({}, "_id name");
    res.status(200).json(captures);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
