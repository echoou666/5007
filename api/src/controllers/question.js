const mongoose = require("mongoose");
const Question = require("../models/Question");
const User = require("../models/User");
const Discussion = require("../models/Discussion");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find();

  res.status(200).json({ success: true, data: questions });
});


exports.getQuestions_s = asyncHandler(async (req, res, next) => {
  const questions = await Question.find();

  res.status(200).json({ success: true, data: questions });
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id)
    .populate({
      path: "discussions",
      select: "text",
      populate: {
        path: "user",
        select: "username avatar",
      },
    })
    .populate({
      path: "user",
      select: "username avatar",
    })
    .lean()
    .exec();

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  // is the question belongs to loggedin user?
  question.isMine = req.user.id === question.user._id.toString();

  // is the loggedin user liked the question??
  const likes = question.likes.map((like) => like.toString());
  question.isLiked = likes.includes(req.user.id);

  // is the loggedin user liked the question??
  const savedQuestions = req.user.savedQuestions.map((question) => question.toString());
  question.isSaved = savedQuestions.includes(req.params.id);

  // is the discussion on the question belongs to the logged in user?
  question.discussions.forEach((discussion) => {
    discussion.isCommentMine = false;

    const userStr = discussion.user._id.toString();
    if (userStr === req.user.id) {
      discussion.isCommentMine = true;
    }
  });

  res.status(200).json({ success: true, data: question });
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (question.user.toString() !== req.user.id) {
    return next({
      message: "You are not authorized to delete this question",
      statusCode: 401,
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { questions: req.params.id },
    $inc: { questionCount: -1 },
  });

  await question.remove();

  res.status(200).json({ success: true, data: {} });
});

exports.addQuestion = asyncHandler(async (req, res, next) => {
  const { title, answer, tags,files } = req.body;
  const user = req.user.id;
  const tagsArray = tags.split("#").filter(tag => tag !== '');
  let question = await Question.create({ title, answer, tags: tagsArray, user,files });

  await User.findByIdAndUpdate(req.user.id, {
    $push: { questions: question._id },
    $inc: { questionCount: 1 },
  });

  question = await question
    .populate({ path: "user", select: "avatar username fullname" })
    .execPopulate();

  res.status(200).json({ success: true, data: question });
});

exports.toggleLike = asyncHandler(async (req, res, next) => {
  // make sure that the question exists
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (question.likes.includes(req.user.id)) {
    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index, 1);
    question.likesCount = question.likesCount - 1;
    await question.save();
  } else {
    question.likes.push(req.user.id);
    question.likesCount = question.likesCount + 1;
    await question.save();
  }

  res.status(200).json({ success: true, data: {} });
});

exports.addComment = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  let discussion = await Discussion.create({
    user: req.user.id,
    question: req.params.id,
    text: req.body.text,
  });

  question.discussions.push(discussion._id);
  question.discussionsCount = question.discussionsCount + 1;
  await question.save();

  discussion = await discussion
    .populate({ path: "user", select: "avatar username fullname" })
    .execPopulate();

  res.status(200).json({ success: true, data: discussion });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  const discussion = await Discussion.findOne({
    _id: req.params.discussionId,
    question: req.params.id,
  });

  if (!discussion) {
    return next({
      message: `No discussion found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  if (discussion.user.toString() !== req.user.id) {
    return next({
      message: "You are not authorized to delete this discussion",
      statusCode: 401,
    });
  }

  // remove the discussion from the question
  const index = question.discussions.indexOf(discussion._id);
  question.discussions.splice(index, 1);
  question.discussionsCount = question.discussionsCount - 1;
  await question.save();

  await discussion.remove();

  res.status(200).json({ success: true, data: {} });
});

exports.searchQuestion = asyncHandler(async (req, res, next) => {
  if (!req.query.title && !req.query.tag) {
    return next({
      message: "Please enter either title or tag to search for",
      statusCode: 400,
    });
  }

  let questions = [];

  if (req.query.title) {
    const regex = new RegExp(req.query.title, "i");
    questions = await Question.find({ title: regex });
  }

  if (req.query.tag) {
    const matchingQuestions = await Question.find({ tags: req.query.tag });
    questions.push(...matchingQuestions);
    console.log(questions)
  }


  res.status(200).json({ success: true, data: questions });
});

exports.toggleSave = asyncHandler(async (req, res, next) => {
  // make sure that the question exists
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next({
      message: `No question found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  const { user } = req;

  if (user.savedQuestions.includes(req.params.id)) {
    console.log("removing saved question");
    await User.findByIdAndUpdate(user.id, {
      $pull: { savedQuestions: req.params.id },
    });
  } else {
    console.log("saving question");
    await User.findByIdAndUpdate(user.id, {
      $push: { savedQuestions: req.params.id },
    });
  }

  res.status(200).json({ success: true, data: {} });
});
