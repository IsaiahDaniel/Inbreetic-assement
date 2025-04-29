"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const ErrorResponse_1 = __importDefault(require("../messages/ErrorResponse"));
const utils_1 = require("../helpers/utils");
const Auth_1 = __importDefault(require("../models/Auth"));
const AuthEnums_1 = require("../constants/enums/AuthEnums");
const BaseResponseHandler_1 = __importDefault(require("../messages/BaseResponseHandler"));
// @route   /api/v1/auth/register
// @desc    Register A User
// @access  Public
exports.registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName, gender } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse_1.default("An account with this email already exists.", 400));
    }
    const newUser = yield User_1.default.create({
        email: (0, utils_1.convertToLowerCase)(email),
        password,
        firstName,
        lastName,
        gender,
    });
    const token = (0, utils_1.generateToken)(newUser._id);
    yield Auth_1.default.create({ user: newUser._id, type: AuthEnums_1.RegistrationType.GMAIL });
    (0, BaseResponseHandler_1.default)({
        message: `Registeration Successfull`,
        res,
        statusCode: 201,
        success: true,
        data: { newUser, token: token }
    });
}));
// @route   /api/v1/auth/login
// @desc    Login A User
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const emailToLowerCase = (0, utils_1.convertToLowerCase)(email);
    const user = yield User_1.default.findOne({ email: emailToLowerCase });
    if (!email || !password) {
        return next(new ErrorResponse_1.default(`Please Provide Valid Credentials`, 404));
    }
    if (!user) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const passwordMatch = yield user.matchPassword(password);
    if (!passwordMatch) {
        return next(new ErrorResponse_1.default(`Incorrect Login Details`, 404));
    }
    const token = (0, utils_1.generateToken)(user._id);
    (0, BaseResponseHandler_1.default)({
        message: `Registeration Successfull`,
        res,
        statusCode: 201,
        success: true,
        data: { user, token: token }
    });
}));
