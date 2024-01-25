import ErrorHandler from "../error/error.js";
import { Ticket } from "../models/ticketSchema.js";
import { Agent } from "../models/agentSchema.js";

import { getNextAgentId } from "../utils/roundRobin.js";
import { validateCreateTicket } from "../utils/validator.js";

import { TICKET_STATUS } from "../utils/constant.js";
import { TICKET_SEVERITY } from "../utils/constant.js";

export const getAllTickets = async (req, res, next) => {
  try {
    const {
      sortBy,
      sortOrder,
      status,
      severity,
      assignedTo,
      type,
      page = 1,
      itemsPerPage = 10,
    } = req.query;

    const filters = {};
    const sort = {};

    if (status) {
      filters.status = { $regex: new RegExp(status), $options: "i" };
    }
    if (severity) {
      filters.severity = { $regex: new RegExp(severity), $options: "i" };
    }
    if (assignedTo) {
      filters.assignedTo = { $regex: new RegExp(assignedTo), $options: "i" };
    }
    if (type) {
      filters.type = { $regex: new RegExp(type), $options: "i" };
    }

    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * itemsPerPage;

    const tickets = await Ticket.find(filters).sort(sort).skip(skip).limit(parseInt(itemsPerPage));
    const agentIds = tickets.map((ticket) => ticket.assignedTo);
    const agents = await Agent.find({ _id: { $in: agentIds } });
    const totalCount = await Ticket.countDocuments(filters);

    // Replacing ID with name
    const ticketsWithAgentNames = tickets.map((ticket) => {
      const agent = agents.find((agent) => agent._id.equals(ticket.assignedTo));
      return {
        ...ticket._doc,
        assignedTo: agent ? agent.name : null,
      };
    });
    res.status(201).json({ tickets: ticketsWithAgentNames, count: totalCount });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const { topic, description, dateCreated, severity, type, status, resolvedOn } = req.body;

    const validationErrors = validateCreateTicket(req.body);
    if (validationErrors) {
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    const assignedTo = await getNextAgentId();

    let resolvedTime;

    if (status === "RESOLVED") {
      resolvedTime = resolvedOn || new Date().toISOString();
    }

    const ticket = await Ticket.create({
      topic,
      description,
      dateCreated,
      severity,
      type,
      status,
      assignedTo,
      resolvedOn: resolvedTime,
    });
    res.status(201).json(ticket);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};

export const getAllFilterValues = async (req, res, next) => {
  try {
    const [typeArr, activeAgents] = await Promise.all([
      await Ticket.distinct("type"),
      await Agent.find({ active: true }, "_id name"),
    ]);

    const data = {
      severity: TICKET_SEVERITY,
      status: TICKET_STATUS,
      type: typeArr,
      assignedTo: activeAgents,
    };
    res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
};
