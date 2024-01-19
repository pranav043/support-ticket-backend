import mongoose from "mongoose";
import { TICKET_STATUS, TICKET_SEVERITY } from "../utils/constant.js";

const ticketSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      minLength: [5, "Topic must be of at least 5 Characters."],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "Description must be of at least 10 Characters."],
    },
    dateCreated: {
      type: Date,
      required: false,
      default: Date.now,
    },
    severity: {
      type: String,
      required: true,
      enum: TICKET_SEVERITY,
    },
    type: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "NEW",
      enum: TICKET_STATUS,
    },
    resolvedOn: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
