import validator from "validator";
import { TICKET_STATUS, TICKET_SEVERITY } from "./constant.js";

export const validateCreateAgent = (data) => {
  const { name, email, phone, description, dateCreated } = data;
  const errors = [];

  if (!name || typeof name !== "string" || name.length < 2) {
    errors.push("Name is required, must be a string, and have a minimum length of 2 characters.");
  }

  if (!email || !validator.isEmail(email)) {
    errors.push("Email is required and must be a valid email address.");
  }

  if (!phone || typeof phone !== "string" || !validator.isNumeric(phone) || phone.length !== 10) {
    errors.push("Phone is required, must be a numeric string, and have a length of 10 digits.");
  }

  if (!description || typeof description !== "string" || description.length < 10) {
    errors.push(
      "Description is required, must be a string, and have a minimum length of 10 characters."
    );
  }

  if (!dateCreated || !validator.isISO8601(dateCreated)) {
    errors.push("Date is required, and must be a valid date.");
  }

  return errors.length === 0 ? null : errors;
};

export const validateCreateTicket = (data) => {
  const { topic, description, dateCreated, severity, type, status } = data;
  const errors = [];

  if (!topic || typeof topic !== "string" || topic.length < 5) {
    errors.push("Topic is required, must be a string, and have a minimum length of 5 characters.");
  }

  if (!description || typeof description !== "string" || description.length < 10) {
    errors.push(
      "Description is required, must be a string, and have a minimum length of 10 characters."
    );
  }

  if (!dateCreated || !validator.isISO8601(dateCreated)) {
    errors.push("Date is required, and must be a valid date.");
  }

  if (!severity || !TICKET_SEVERITY.includes(severity)) {
    errors.push("Severity is required and must be one of LOW, MEDIUM, or HIGH");
  }

  if (!type || typeof type !== "string") {
    errors.push("Type is required, and must be a string");
  }

  if (!status || !TICKET_STATUS.includes(status)) {
    errors.push("Status is required and must be one of NEW, ASSIGNED, or RESOLVED");
  }

  return errors.length === 0 ? null : errors;
};
