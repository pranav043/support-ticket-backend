import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model("Store", storeSchema);
