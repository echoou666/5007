const User = require("../models/User");
const Question = require("../models/Question");
const asyncHandler = require("../middlewares/asyncHandler");

// Get all users, without their password
exports.getUsers = asyncHandler(async (req, res, next) => {
  let users = await User.find().select("-password").lean().exec();

  users.forEach((user) => {
    user.isFollowing = false;
    const followers = user.followers.map((follower) => follower._id.toString());
    if (followers.includes(req.user.id)) {
      user.isFollowing = true;
    }
  });

  users = users.filter((user) => user._id.toString() !== req.user.id);

  res.status(200).json({ success: true, data: users });
});


// Get a single user by their username, without their password
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username })
    .select("-password")
    .populate({ path: "questions", select: "title answer discussionsCount likesCount files tags" })
    .populate({ path: "savedQuestions", select: "title answer discussionsCount likesCount tags" })
    .populate({ path: "followers", select: "avatar username fullname" })
    .populate({ path: "following", select: "avatar username fullname" })
    .lean()
    .exec();

  if (!user) {
    return next({
      message: `The user ${req.params.username} is not found`,
      statusCode: 404,
    });
  }

  user.isFollowing = false;
  const followers = user.followers.map((follower) => follower._id.toString());

  user.followers.forEach((follower) => {
    follower.isFollowing = false;
    if (req.user.following.includes(follower._id.toString())) {
      follower.isFollowing = true;
    }
  });

  user.following.forEach((user) => {
    user.isFollowing = false;
    if (req.user.following.includes(user._id.toString())) {
      user.isFollowing = true;
    }
  });

  if (followers.includes(req.user.id)) {
    user.isFollowing = true;
  }

  user.isMe = req.user.id === user._id.toString();

  res.status(200).json({ success: true, data: user });
});

exports.follow = asyncHandler(async (req, res, next) => {
  // make sure the user exists
  const user = await User.findById(req.params.id);

  if (!user) {
    return next({
      message: `No user found for id ${req.params.id}`,
      statusCode: 404,
    });
  }

  // make the sure the user is not the logged in user
  if (req.params.id === req.user.id) {
    return next({ message: "You can't unfollow/follow yourself", status: 400 });
  }

  // only follow if the user is not following already
  if (user.followers.includes(req.user.id)) {
    return next({ message: "You are already following him", status: 400 });
  }

  await User.findByIdAndUpdate(req.params.id, {
    $push: { followers: req.user.id },
    $inc: { followersCount: 1 },
  });
  await User.findByIdAndUpdate(req.user.id, {
    $push: { following: req.params.id },
    $inc: { followingCount: 1 },
  });

  res.status(200).json({ success: true, data: {} });
});

exports.unfollow = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next({
      message: `No user found for ID ${req.params.id}`,
      statusCode: 404,
    });
  }

  // make the sure the user is not the logged in user
  if (req.params.id === req.user.id) {
    return next({ message: "You can't follow/unfollow yourself", status: 400 });
  }

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user.id },
    $inc: { followersCount: -1 },
  });
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: req.params.id },
    $inc: { followingCount: -1 },
  });

  res.status(200).json({ success: true, data: {} });
});

exports.feed = asyncHandler(async (req, res, next) => {
  const following = req.user.following;

  const users = await User.find()
    .where("_id")
    .in(following.concat([req.user.id]))
    .exec();

  const questionIds = users.map((user) => user.questions).flat();

  const questions = await Question.find()
    .populate({
      path: "discussions",
      select: "text",
      populate: { path: "user", select: "avatar fullname username" },
    })
    .populate({ path: "user", select: "avatar fullname username" })
    .sort("-createdAt")
    .where("_id")
    .in(questionIds)
    .lean()
    .exec();

  questions.forEach((question) => {
    // is the loggedin user liked the question
    question.isLiked = false;
    const likes = question.likes.map((like) => like.toString());
    if (likes.includes(req.user.id)) {
      question.isLiked = true;
    }

    // is the loggedin saved this question
    question.isSaved = false;
    const savedQuestions = req.user.savedQuestions.map((question) => question.toString());
    if (savedQuestions.includes(question._id)) {
      question.isSaved = true;
    }

    // is the question belongs to the loggedin user
    question.isMine = false;
    if (question.user._id.toString() === req.user.id) {
      question.isMine = true;
    }

    // is the discussion belongs to the loggedin user
    question.discussions.map((discussion) => {
      discussion.isCommentMine = false;
      if (discussion.user._id.toString() === req.user.id) {
        discussion.isCommentMine = true;
      }
    });
  });

  res.status(200).json({ success: true, data: questions });
});

// Search request for a user by username.
exports.searchUser = asyncHandler(async (req, res, next) => {
  if (!req.query.username) {
    return next({ message: "The username cannot be empty", statusCode: 400 });
  }
    console.log('search name ' + req.query.username + ' info');
  const regex = new RegExp(req.query.username, "i");
  const users = await User.find({ username: regex });

  res.status(200).json({ success: true, data: users });
});

// Editing user information
exports.editUser = asyncHandler(async (req, res, next) => {
  const { avatar, username, fullname, website, bio, email } = req.body;

  const fieldsToUpdate = {};
  if (avatar) fieldsToUpdate.avatar = avatar;
  if (username) fieldsToUpdate.username = username;
  if (fullname) fieldsToUpdate.fullname = fullname;
  if (email) fieldsToUpdate.email = email;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { ...fieldsToUpdate, website, bio },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("avatar username fullname email bio website");

  res.status(200).json({ success: true, data: user });
});