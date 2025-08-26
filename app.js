const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./midddleware/authMiddleware");
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
// view engine
app.set("view engine", "ejs");

// database connection
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;
// const dbURI =
//   "mongodb+srv://jeyapriya3377:rOMY7dixmj9X25wI@backenddb.9rf8dby.mongodb.net/AuthenticationDB?retryWrites=true&w=majority&appName=BackendDB";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log('DB CONNENCTED');
    
    app.listen(PORT);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/home", (req, res) => res.render("home"));
app.get("/", (req, res) => res.render("home"));

app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

//cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader('Set-cookie', 'newUser=true');
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, secure: true }); //1000*60*60*24 one day in ms ,secure :true only accpets in http request or else use httpOny :true
  // res.cookie('isEmployee', true,{maxAge: 1000*60*60*24,httpOnly:true});//1000*60*60*24 one day in ms ,secure :true only accpets in http request or else use httpOny :true

  res.send("You got the cookie");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies);
});
