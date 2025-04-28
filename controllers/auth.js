const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/UserModel')

//@desc       Register user
//@route      POST /api/v1/auth/register
//@access     Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = user.getSignedJwtToken();

  res
    .status(200)
    .json({ success: true, token })
});

//@desc       Login user
//@route      POST /api/v1/auth/login
//@access     Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide correct email and password', 400))
  }

  const user = await User.FindOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  const isMatched = await User.matchPassword(password);

  if (!isMatched) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  const token = user.getSignedJwtToken();

  res
    .status(200)
    .json({ success: true, token })
})