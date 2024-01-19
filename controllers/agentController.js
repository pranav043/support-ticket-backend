import ErrorHandler from "../error/error.js";
import { Agent } from "../models/agentSchema.js";
import { validateCreateAgent } from "../utils/validator.js";

export const createAgent = async (req, res, next) => {
  try {
    const { name, email, phone, description, dateCreated } = req.body;

    const validationErrors = validateCreateAgent(req.body);
    if (validationErrors) {
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    const duplicateAgent = await Agent.findOne({ $or: [{ email }, { phone }] });
    if (duplicateAgent) {
      return next(new ErrorHandler("Agent with same Email or Phone already exists", 400));
    }

    const agent = await Agent.create({ name, email, phone, description, dateCreated });
    res.status(201).json(agent);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};
