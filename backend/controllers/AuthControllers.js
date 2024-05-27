import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import SendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";
const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //check if password is correct

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("password does not match", 401));
  }

  sendToken(user, 200, res);
});

const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
//upload user avatar
const UploadUserAvatar = catchAsyncError(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

  //remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req.user.avatar.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  res.status(200).json({
    user,
  });
});
//forgot password
const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);
  try {
    await SendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Set the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get current user profile

const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});
//get all users
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

//get user details
const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id:${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    user,
  });
});

//update user details
const updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

//delete user
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id:${req.params.id}`, 404)
    );
  }

  //remove user avatar from cloudinary todo
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserPassword,
  getAllUsers,
  updateProfile,
  getUserDetails,
  updateUser,
  deleteUser,
  UploadUserAvatar,
};
