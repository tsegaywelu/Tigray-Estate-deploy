import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"; //i am importing here to add the dist folder
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
//adding the dist folder created after build my code
//and it shuold be after the api routes unless it will not work
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));
//below for any request it will run the index.html.
// This is particularly useful in Single Page Applications (SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

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
