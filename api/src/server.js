require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const question = require("./routes/question");
const connectToDb = require("./utils/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

connectToDb();
app.use(express.json());
app.use(cors());

app.use("/auth", auth);
app.use("/users", user);
app.use("/questions", question);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(
  PORT,
  console.log(`server started in ${process.env.NODE_ENV} mode at port ${PORT}`)
);
