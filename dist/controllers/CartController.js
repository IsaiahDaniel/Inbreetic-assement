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
exports.checkoutCart = exports.removeFromCart = exports.addToCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorResponse_js_1 = __importDefault(require("../messages/ErrorResponse.js"));
const BaseResponseHandler_js_1 = __importDefault(require("../messages/BaseResponseHandler.js"));
const utils_1 = require("../helpers/utils");
// @route   POST /api/v1/cart
// @desc    Add Item To cart
// @access  Private
exports.addToCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        return next(new ErrorResponse_js_1.default(`Quantity must be greater than 0`, 400));
    }
    ;
    const user = yield (0, utils_1.getAuthUser)(req, next);
    const userId = user._id;
    let cart = yield Cart_1.default.findOne({ userId });
    if (!cart) {
        cart = new Cart_1.default({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex((i) => i.productId.equals(productId));
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    }
    else {
        cart.items.push({ productId, quantity });
    }
    yield cart.save();
    (0, BaseResponseHandler_js_1.default)({
        message: `Product Added To Cart Successfully`,
        res,
        statusCode: 201,
        success: true,
        data: cart,
    });
}));
// @route   DELETE /api/v1/cart
// @desc    Remove Item To cart
// @access  Private
exports.removeFromCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.body;
    const cart = yield Cart_1.default.findOne({ userId });
    if (!cart) {
        return next(new ErrorResponse_js_1.default(`Cart Not Found`, 404));
    }
    ;
    cart.items.pull({ productId });
    yield cart.save();
    (0, BaseResponseHandler_js_1.default)({
        message: `Product Removed From cart`,
        res,
        statusCode: 200,
        success: true,
        data: cart,
    });
}));
// @route   POST /api/v1/cart/checkout
// @desc    Checkout Cart
// @access  Private
exports.checkoutCart = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield (0, utils_1.getAuthUser)(req, next);
        const userId = user._id;
        const cart = yield Cart_1.default.findOne({ userId }).populate('items.productId').session(session);
        console.log("cart", cart);
        if (!cart || cart.items.length === 0) {
            return next(new ErrorResponse_js_1.default(`Cart Is Empty`, 400));
        }
        ;
        for (const item of cart.items) {
            if (!item.productId) {
                return next(new ErrorResponse_js_1.default(`Product Item Not Found In cart`, 404));
            }
            const product = yield Product_1.default.findOne({ _id: item.productId._id }).session(session);
            // ${item.productId.name}
            if (!product || product.stock < item.quantity) {
                return next(new ErrorResponse_js_1.default(`Not enough stock for this item`, 404));
            }
            product.stock -= item.quantity;
            yield product.save({ session });
        }
        cart.set('items', []);
        yield cart.save({ session });
        yield session.commitTransaction();
        (0, BaseResponseHandler_js_1.default)({
            message: `Checkout Was successfull`,
            res,
            statusCode: 200,
            success: true,
            data: cart
        });
    }
    catch (err) {
        yield session.abortTransaction();
        return next(new ErrorResponse_js_1.default(`${err.message ? err.message : "Something Went Wrong"}`, 500));
    }
    finally {
        session.endSession();
    }
}));
