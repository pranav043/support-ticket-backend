import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./database/dbConnection.js";
import router from "./routes/router.js";
import { errorMiddleware } from "./error/error.js";

const app = express();
dotenv.config({ path: "./.env" });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.get("/", (req, res) => {
  res.send("Server");
});

//Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

app.use("/api", router);

//404 catch
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route Not Found!" });
});

app.use(errorMiddleware);

export default app;
