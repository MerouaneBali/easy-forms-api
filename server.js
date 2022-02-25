// -------------------------- IMPORTS --------------------------

// LIB IMPORTS
const express = require("express");
const session = require("express-session");
const connectRedis = require("connect-redis");
const cors = require("cors");

// ROUTE IMPORTS
const authentication = require("./routes/authentication");
const profile = require("./routes/profile");
const projects = require("./routes/projects");
const forms = require("./routes/forms");
const unknown = require("./routes/*");

// INITAILIZATION BY IMPORTING
const env = require("./configs/env");
const { getMainConnection } = require("./connections/mongoose/mainConnection");
const {
  redisClient,
  redisAuthSessionClient,
} = require("./connections/redisConnection");
const { nodemailerClient } = require("./connections/nodemailerConnection");

const RedisStore = connectRedis(session);

// ----------------- SERVER INITAILIZATION --------------------

const port = process.env.PORT || process.env.EXPRESS_PORT;

const app = express();

app.listen(port, () => console.log(`Server: Running on ${port}`));

// --------------------- USING MIDDLEWARE ---------------------

// USING BODY PARSER
app.use(express.json());
app.use(
  session({
    name: "session",
    store: new RedisStore({ client: redisAuthSessionClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // if true browsers with only set cookie if front-end is on same domain
      // domain: "https://easy-forms.netlify.app",
      secure: true, // if true only transmit cookie over https
      // httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: Number(process.env.AUTHORIZATION_SESSION_EXPIRATION_TIME), // session max age in miliseconds
    },
  })
);
app.use(
  cors({
    origin: [
      "https://easy-forms.netlify.app",
      "http://localhost:3000",
      "https://localhost:3001",
    ],
    credentials: true,
  })
);
app.set("trust proxy", 1);
// ----------------------- USING ROUTES -----------------------

app.use("/authentication", authentication);
app.use("/profile", profile);
app.use("/projects", projects);
app.use("/forms", forms);
app.use("*", unknown);
