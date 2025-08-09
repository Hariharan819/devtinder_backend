const express = require("express");
const connectDB = require("./src/config/database");

const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
//middleware for receiving body-data from post api
app.use(express.json());
//reading cookie from req.body
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
//require  our db model

const AuthRoute = require("./src/routes/AuthRoute");
const ProfileRoute = require("./src/routes/ProfileRoute");
const RequestRouter = require("./src/routes/request");
const UserRouter = require("./src/routes/user");
app.use("/", AuthRoute);
app.use("/profile", ProfileRoute);
app.use("/", RequestRouter);
app.use("/", UserRouter);

//connect db and after that server listen to the port 3000
connectDB()
  .then(() => {
    console.log("Database is connected sucessfully....");
    app.listen(3000, () => {
      console.log("server is succcesfully running on port:3000...");
    });
  })
  .catch((err) => {
    console.error("Database is not connected");
  });
