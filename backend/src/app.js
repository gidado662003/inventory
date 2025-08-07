const express = require("express");
const cors = require("cors");
const api = require("./routes/api");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api", api);
module.exports = app;
