import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

import dotenv from "dotenv";

dotenv.config();

const ORIGIN1 = process.env.ORIGIN1;
const ORIGIN2 = process.env.ORIGIN2;
app.use(
  cors({
    origin: [`${ORIGIN1}`, `${ORIGIN2}`],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

import stampRoutes from "./routes/stamp.route";
app.use("/api", stampRoutes);

app.use("/login", (req, res) => {
  res.send("Hello from the Ara's Backend.");
});

export default app;
