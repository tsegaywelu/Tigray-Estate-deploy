import express from "express";
import {
  createListing,
  deletelisting,
  getlistbyid,
  updatelisting,
  searchlist,
} from "../conrollers/listing.controller.js";
import { verifytoken } from "../utilitis/verifyToken.js"; //but cookie is not stored on browser and i leave it

const router = express.Router();

router.post("/create", createListing);
router.delete("/deletelisting/:id", deletelisting);
router.post("/update/:id", updatelisting);
router.get("/getlist/:id", getlistbyid); //i did not need to verify user because i will use this route on home
router.get("/search", searchlist);

export default router;
