import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(express.urlencoded({ extended: true })); //to properly parse the form data and make it accessible via req.body in your route handler.

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

import authrouter from "./routes/auth.router.js";
import userrouter from "./routes/user.router.js";
import listrouter from "./routes/listingrouter.js";

app.use("/api/auth", authrouter);
app.use("/api/user", userrouter);
app.use("/api/listing", listrouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server running on server port  3000");
});
