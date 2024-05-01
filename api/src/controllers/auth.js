const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// Handle user login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next({
      message: "Please provide email and password",
      statusCode: 400,
    });
  }

  // Find the user with the given email
  const user = await User.findOne({ email });

  // If user does not exist, return an error
  if (!user) {
    return next({
      message: "The email is not yet registered to an account",
      statusCode: 400,
    });
  }

  // If user exists, check if the password matches
  const match = await user.checkPassword(password);

  // If password does not match, return an error
  if (!match) {
    return next({ message: "The password does not match", statusCode: 400 });
  }

  // If password matches, generate a JWT token for the user
  const token = user.getJwtToken();

  // Send the JWT token as response
  res.status(200).json({ success: true, token });
});

// Handle user signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  const user = await User.create({ fullname, username, email, password });

  const token = user.getJwtToken();

  res.status(200).json({ success: true, token });
});

// Get current user profile
exports.me = asyncHandler(async (req, res, next) => {
  const { avatar, username, fullname, email, _id, website, bio } = req.user;

  // Return the user details
  res
    .status(200)
    .json({
      success: true,
      data: { avatar, username, fullname, email, _id, website, bio },
    });
});
