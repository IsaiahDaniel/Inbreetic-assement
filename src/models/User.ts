import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Schema, model, Query } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    // required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    // required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "A valid Email is Required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please Provide a Valid Email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: [8, "password must be atleast Eight characters"],
  },
  gender: {
    type: String,
    // required: [true, "Gender is Required"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }

  const hash = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, hash);
  next();
});

UserSchema.methods.matchPassword = async function (password: any) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

export interface IUser extends Document {
  email: string;
  password: string;
  matchPassword: any;
  firstName: string;
  lastName: string;
  gender: string;
  verificationCode: string;
}

const User = model<IUser>("user", UserSchema);

export default User;
