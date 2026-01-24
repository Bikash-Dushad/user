const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3001;
const cors = require("cors");
const { connectProducer } = require("./kafka/producer");

const connectDB = require("./config/db");
const redis = require("./config/redis");
const socketInit = require("./sockets");
const routes = require("./routers");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
});

app.get("/user", async (req, res) => {
  return res.send("Hi user");
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: "*" },
    });
    socketInit(io);
    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
    connectProducer();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
