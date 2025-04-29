import asyncHandler from "express-async-handler";
import User from "../models/User";
import ErrorResponse from "../messages/ErrorResponse";
import { convertToLowerCase, generateToken } from "../helpers/utils";
import Auth from "../models/Auth";
import { RegistrationType } from "../constants/enums/AuthEnums";
import baseResponseHandler from "../messages/BaseResponseHandler";

// @route   /api/v1/auth/register
// @desc    Register A User
// @access  Public

export const registerUser = asyncHandler(async (req, res, next) => {

  const { email, password, firstName, lastName, gender } =
    req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(
      new ErrorResponse("An account with this email already exists.", 400)
    );
  }

  const newUser: any = await User.create({
    email: convertToLowerCase(email),
    password,
    firstName,
    lastName,
    gender,
  });

  const token = generateToken(newUser._id);

  await Auth.create({ user: newUser._id, type: RegistrationType.GMAIL });

  baseResponseHandler({
    message: `Registeration Successfull`,
    res,
    statusCode: 201,
    success: true,
    data: { newUser, token: token }
  })

});

// @route   /api/v1/auth/login
// @desc    Login A User
// @access  Public

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const emailToLowerCase = convertToLowerCase(email);

  const user = await User.findOne({ email: emailToLowerCase });

  if (!email || !password) {
    return next(new ErrorResponse(`Please Provide Valid Credentials`, 404));
  }

  if (!user) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const passwordMatch = await user.matchPassword(password);

  if (!passwordMatch) {
    return next(new ErrorResponse(`Incorrect Login Details`, 404));
  }

  const token = generateToken(user._id);

  baseResponseHandler({
    message: `Registeration Successfull`,
    res,
    statusCode: 201,
    success: true,
    data: { user, token: token }
  })

});
