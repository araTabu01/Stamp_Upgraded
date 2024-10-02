import {
  createStamp,
  getStamps,
  deleteStamp,
  updateApprovalDate,
  updateSubstituteName, // Import the new controller function
} from "../controllers/stamp.controller";
import { login } from "../controllers/login.controller";
import express from "express";

const router = express.Router();

// Stamp routes
router.post("/stamps", createStamp);
router.get("/stamps", getStamps);
router.delete("/stamps/:id", deleteStamp);
router.patch("/stamps", updateApprovalDate);
router.patch("/stamps/substitute-name", updateSubstituteName); // Add new route

// Login route
router.post("/login", login);

export default router;
