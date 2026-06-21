
const path = require("path");
if (process.env.NODE_ENV !== "production") {

  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

// IMPORTS 
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const connectDB = require('./src/config/connectDB.js');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const User = require("./src/models/user.js");
const ExpressError = require("./src/utils/ExpressError.js");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const listingRouter = require("./src/routes/listing.js");
const reviewRouter = require("./src/routes/review.js");
const userRouter = require("./src/routes/user.js");
const adminRouter = require("./src/routes/admin.js");

// CREATING APP
const app = express();
app.set('trust proxy', 1);

connectDB().then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((err) => console.log("DB Connection Error:", err));

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [`${process.env.FRONTEND_URL}`]
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "src", "uploads")
    )
);

console.log(
    "Serving uploads from:",
    path.join(__dirname, "src", "uploads")
);

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,

  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  }
};



app.use(session(sessionOptions));


app.use("/api/listings", listingRouter);
app.use("/api/listing/:id/reviews", reviewRouter);
app.use("/api/auth", userRouter);

app.use("/api/admin", adminRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).json({
//     success: false,
//     error: message
//   });
// });

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
});
