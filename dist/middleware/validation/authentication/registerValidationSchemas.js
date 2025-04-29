"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ErrorResponse_1 = __importDefault(require("../../../messages/ErrorResponse"));
exports.registerUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().messages({
        "any.string": "First Name Must be a string",
        "any.required": "First Name is required",
    }),
    lastName: joi_1.default.string().required().messages({
        "any.string": "Last Name Must be a string",
        "any.required": "Last Name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "any.string": "Email Must be a string",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
    }),
    gender: joi_1.default.string().valid("male", "female").required().messages({
        "any.only": 'Gender must be either "male" or "female"',
        "any.required": "Gender is required",
        "string.base": "Gender must be a string",
    }),
});
const validateRegisterRequest = (schema) => {
    return (req, res, next) => {
        console.log("register body", req.body);
        const { error } = schema.validate(req.body, { allowUnknown: true });
        if (error) {
            return next(new ErrorResponse_1.default(error.details[0].message, 400));
        }
        next();
    };
};
exports.default = validateRegisterRequest;
