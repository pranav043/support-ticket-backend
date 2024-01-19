import mongoose from "mongoose";
const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "SupportTicketSystem",
    })
    .then(() => {
      console.log("Connected to database successfully!");
    })
    .catch((err) => {
      console.log(`Unable to connect to DB! ${err}`);
    });
};

export default dbConnection;
