const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";

// Load environment variables from .env.{environment} file
dotenv.config();

const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/inventoryDB";
console.log(MONGODB_URI);
const server = http.createServer(app);

async function startServer() {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
}

startServer();
