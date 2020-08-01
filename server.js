require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("Connected to database");
});

// Middleware is code that runs when the server gets a request but before it gets passed to the routes

// Let's server accept JSON as a body inside of GET, POST, etc elements
app.use(express.json());

// Routes all subscriber info
const subscribersRouter = require("./routes/subscribersRouter");

// localhost:3000/subscriber
app.use("/subscribers", subscribersRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
