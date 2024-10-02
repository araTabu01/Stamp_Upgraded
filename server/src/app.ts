import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import dotenv from "dotenv";

dotenv.config();

const app = express();

const ORIGIN1 = process.env.ORIGIN1;
const ORIGIN2 = process.env.ORIGIN2;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

console.log("First allowed origin is ", ORIGIN1);
console.log("Second allowed origin is ", ORIGIN2);
app.use(
  cors({
    origin: [`${ORIGIN1}`, `${ORIGIN2}`],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "PUT"],
    credentials: true,
  })
);

import stampRoutes from "./routes/stamp.route";
app.use("/api", stampRoutes);

app.use("/login", (req, res) => {
  res.send("Hello from the Ara's Backend v2.");
});

export default app;
