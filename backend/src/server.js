const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";

// Load environment variables from .env.{environment} file
dotenv.config({ path: `.env.${env}` });

const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);

async function startServer() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${env} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    console.log("💡 Make sure MongoDB is running on your system");
    process.exit(1);
  }
}

startServer();
