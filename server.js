const express = require("express");
require("./config/dbConfig");
require(`dotenv`).config()
const port = process.env.port || 1188;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require(`express-session`)
const MongoDBStore = require('connect-mongodb-session')(session);
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const merchantRouter = require("./routers/merchantRouter");
const fileUploader = require("express-fileupload");
const categoryRouter = require("./routers/categoryRouter");
const cartRouter = require("./routers/cartRouter");
const keepServerAlive = require(`./helpers/keepServerAlive`)

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
const store = new MongoDBStore({
  uri: process.env.db, // Replace with your MongoDB connection URI
  collection: 'session'
});

store.on('error', function(error) {
  console.error(error);
});
app.use(session({
  secret: process.env.session_secret,  // Use a secure secret
  resave: false,              // Don't save the session if it wasn't modified
  saveUninitialized: false,   // Only save session when something is added
  store: store,               // Use the MongoDB store to persist sessions
  cookie: {
      maxAge: 1000 * 60 * 60 * 24,  // Session expires in 24 hours
      secure: process.env.NODE_ENV === 'production',  // Only secure in production
      httpOnly: true  // Ensure cookies are only accessible via HTTP (not JavaScript)
  }
}));
app.use(fileUploader({ useTempFiles: true }));
app.use(cors({ origin: "*", credentials: true}));
app.use(morgan("dev"));

app.use("/api/v1", userRouter);
app.use("/api/v1", merchantRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", cartRouter);

keepServerAlive();


app.get('/1', (req, res) => {
    res.send('Server is alive!');
});

app.get("/", (req, res) => {
  res.send("Welcome to Groceria!");
});

app.listen(port, () => {
  console.log("App is currently Up & Running, server is listening to port:", port);
});