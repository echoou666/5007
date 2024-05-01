require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const discussion = require("./models/Discussion");
const Question = require("./models/Question");

mongoose.connect(process.env.MONGOURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const deleteData = async () => {
  try {
    await User.deleteMany();
    await discussion.deleteMany();
    await Question.deleteMany();
    console.log("Deleted data...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("not enough arguments");
  process.exit(1);
}
