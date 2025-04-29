import { NextFunction } from "express";
import ErrorResponse from "../messages/ErrorResponse";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const getAuthUser = async (
  req: any,
  next: NextFunction
): Promise<any> => {
  const userId = req.user.id;

  if (!userId) {
    return next(new ErrorResponse(`User Id is required`, 400));
  }

  const user = await User.findOne({ _id: userId });

  // console.log("logged in user", user);

  if (!user) {
    return next(new ErrorResponse(`User Id is required`, 400));
  }

  return user;
};

export const generateToken = (id: any) => {
  const JWT_SECRET: any = process.env.JWT_SECRET;
  const tokenGen = jwt.sign({ id }, JWT_SECRET);
  return tokenGen;
};


export const convertToLowerCase = (text: string) => {
  return text.toLowerCase();
}