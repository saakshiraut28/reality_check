/** @format */

import mongoose from "mongoose";

const captureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      match: /^[-\w]+\/[-\w+.]+$/,
    },
  },
  {
    timestamps: true,
  }
);

const Capture = mongoose.model("Capture", captureSchema);

export default Capture;