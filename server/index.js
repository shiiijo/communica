const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://192.168.1.2:3000",
  })
);

app.get("/healthcheck", (req, res) => {
  res.json("health check ok");
});

app.post("/user/register", async (req, res) => {
  console.log(req.body);
  const { Fname, Femail, Fpassword } = req.body;
  const createdUser = await User.create({
    name: Fname,
    email: Femail,
    password: Fpassword,
  });
  var token = jwt.sign(
    { userId: createdUser._id },
    process.env.JWT_PRIVATE_KEY,
    {}
  );
  if (token) {
    console.log(token);
    return res.cookie("token", token).status(201).json("ok");
  }
  return res.json({
    error: "jwt error",
  });
});

app.listen("4040");
