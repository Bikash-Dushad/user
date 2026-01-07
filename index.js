const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

const connectDB = require("./config/db");
const routes = require("./routers");

const dotenv = require("dotenv");
dotenv.config();

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
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
