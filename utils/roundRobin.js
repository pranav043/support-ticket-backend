import { Store } from "../models/storeSchema.js";
import { Agent } from "../models/agentSchema.js";

export const getNextAgentId = async () => {
  const [agents, lastAssignedAgentIndexDoc] = await Promise.all([
    Agent.find({ active: true }),
    Store.findOne({ key: "lastAssignedAgentIndex" }),
  ]);

  if (agents.length === 0) {
    throw new Error("No active agents available.");
  }

  const lastAssignedAgentIndex = lastAssignedAgentIndexDoc ? lastAssignedAgentIndexDoc.value : 0;

  await Store.findOneAndUpdate(
    { key: "lastAssignedAgentIndex" },
    { value: (lastAssignedAgentIndex + 1) % agents.length },
    { upsert: true }
  );

  const assignedTo = agents[lastAssignedAgentIndex]._id;

  return assignedTo;
};
