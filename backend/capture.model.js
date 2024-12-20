/** @format */

import mongoose from "mongoose";

const captureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Capture = mongoose.model("Capture", captureSchema);

export default Capture;
