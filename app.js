require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const multer = require("multer");
const favicon = require("serve-favicon");
const MongoStore = require("connect-mongo")(session);

// Models

const User = require("./models/User");
const Spot = require("./models/Spot");

// Mongoose

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {})
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// App

const app = express();

// Config Middlewares

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Debug

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Config Views

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Session & Passport

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);

// Serialize & Deserialize

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, next) => {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(null, false, { message: "Usuário incorreto" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: "Senha incorreta" });
        }

        return next(null, user);
      });
    }
  )
);

// Session

app.use(passport.initialize());
app.use(passport.session());

// Flash

app.use(flash());

// Routes

app.use("/", require("./routes/main"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.use("/", require("./routes/hostRoutes"));

module.exports = app;
