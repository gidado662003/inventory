const express = require("express");
const cors = require("cors");
const api = require("./routes/api");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api", api);
module.exports = app;
