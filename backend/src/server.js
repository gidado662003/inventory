require("dotenv").config();

const mongoose = require("mongoose");

const http = require("http");

const app = require("./app");

const PORT = process.env.PORT;

const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    mongoose.connect(process.env.MONGO_URI);
  });
}

startServer();
