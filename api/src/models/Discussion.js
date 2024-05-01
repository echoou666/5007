const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  question: {
    type: mongoose.Schema.ObjectId,
    ref: "Question",
    required: true,
  },

  text: {
    type: String,
    required: [true, "Please enter the discussion"],
    trim: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Discussion", CommentSchema);