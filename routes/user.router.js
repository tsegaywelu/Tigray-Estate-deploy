import express from "express";
const router = express.Router();
import {
  updateuser,
  deleteuser,
  getListings,
  getuser,
} from "../conrollers/user.controller.js";
import { verifytoken } from "../utilitis/verifyToken.js";

router.patch("/update/:id", updateuser);
router.delete("/delete/:id", deleteuser);
router.get("/getlist/:id", getListings); // this id is the user id who  is trying to get the list  verifytoken was very important here
router.get("/getuser/:id", getuser);
export default router;
//this is the default export and when we say import some thing it takes simply for this default
