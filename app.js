const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const cors = require("cors-express");
const multer = require("multer");

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const callcenterRouter = require("./routes/callcenter");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const options = {
  allow: {
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    headers: "Content-Type, Authorization",
  },
  max: {
    age: null,
  },
};

dotenv.config();
const app = express();
const mongoDB_Uri = `${process.env.db_uri}`;

app.use(cors(options));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https://cdn.socket.io/4.5.4/socket.io.min.js"],
      scriptSrc: ["'self'", "https://cdn.socket.io/4.5.4/socket.io.min.js"],
      styleSrc: ["'self'"],
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage }).single("file"));

app.use(process.env.api, authRouter);
app.use(process.env.api, adminRouter);
app.use(process.env.api, callcenterRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ success: false, message: message });
});

mongoose
  .set("strictQuery", false)
  .connect(mongoDB_Uri)
  .then((result) => {
    const server = app.listen(process.env.PORT, "localhost", () => {
      console.log("listening on port " + process.env.PORT);
    });
    const io = require("./socket").initIo(server);
    io.on("connection", (socket) => {
      console.log("client connected on socket: " + socket.id);
    });
  })
  .catch((err) => {
    console.log(err);
  });
