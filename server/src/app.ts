import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const ORIGIN1 = process.env.ORIGIN1;
const ORIGIN2 = process.env.ORIGIN2;

// Filter out undefined values from the origins
const allowedOrigins = [ORIGIN1, ORIGIN2].filter(
  (origin): origin is string => origin !== undefined
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: allowedOrigins, // Use filtered origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Respond to OPTIONS requests for preflight checks
app.options("*", cors(corsOptions));

import stampRoutes from "./routes/stamp.route";
app.use("/api", stampRoutes);

// Test login route
app.use("/login", (req, res) => {
  res.send("Hello from the Ara's Backend v2.");
});

export default app;
