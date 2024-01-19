import mongoose from "mongoose";
import validator from "validator";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Name must be of at least 2 Characters."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minLength: [10, "Phone number must contain 10 Digits."],
      maxLength: [10, "Phone number must contain 10 Digits."],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "Description must be of at least 10 Characters."],
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    dateCreated: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Agent = mongoose.model("Agent", agentSchema);
