import express from "express";
const router = express.Router();
import { createAgent } from "../controllers/agentController.js";
import {
  getAllTickets,
  createTicket,
  getAllFilterValues,
} from "../controllers/ticketController.js";

router.post("/support-agents", createAgent);

router.get("/support-tickets", getAllTickets);
router.post("/support-tickets", createTicket);

router.get("/filter-fields", getAllFilterValues);

export default router;
