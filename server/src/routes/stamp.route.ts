import {
  createStamp,
  getStamps,
  deleteStamp,
  updateApprovalDate,
} from "../controllers/stamp.controller";
import { login } from "../controllers/login.controller";
import express from "express";

const router = express.Router();

// Stamp routes
router.post("/stamps", createStamp);
router.get("/stamps", getStamps);
router.delete("/stamps/:id", deleteStamp);
router.patch("/stamps", updateApprovalDate);

// Login route
router.post("/login", login);

export default router;
