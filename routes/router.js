import express from "express";
const router = express.Router();
import { getAllTickets, createTicket } from "../controllers/ticketController.js";
import { createAgent } from "../controllers/agentController.js";

router.post("/support-agents", createAgent);
router.get("/support-tickets", getAllTickets);
router.post("/support-tickets", createTicket);

export default router;
