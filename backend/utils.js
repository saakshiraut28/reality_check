/** @format */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Grid from "gridfs-stream";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

// Establish Mongoose connection
const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Match with the bucketName in storage
});

// Configure GridFsStorage for multer
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`, // Generate unique filenames
    bucketName: "uploads", // Must match with gfs.collection
  }),
});

const upload = multer({ storage });

// Exporting gfs instance for further use
const getGfsInstance = () => {
  if (!gfs) throw new Error("GridFS instance not initialized yet");
  return gfs;
};

export { upload, getGfsInstance };
