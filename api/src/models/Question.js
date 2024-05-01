const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: [true, "Please enter the title"],
    trim: true,
  },

  answer: {
    type: String,
    required: [true, "Please enter the answer"],
    trim: true,
  },

  tags: {
    type: [String],
  },

  files: {
    type: [String],
    validate: (v) => v === null || v.length > 0,
  },

  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],

  likesCount: {
    type: Number,
    default: 0,
  },

  discussions: [{ type: mongoose.Schema.ObjectId, ref: "Discussion" }],
  discussionsCount: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);