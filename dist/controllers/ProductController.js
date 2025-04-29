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
exports.getAllProducts = void 0;
const Product_js_1 = __importDefault(require("../models/Product.js"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const BaseResponseHandler_js_1 = __importDefault(require("../messages/BaseResponseHandler.js"));
const RedisProvider_js_1 = __importDefault(require("../providers/RedisProvider.js"));
const paginate_js_1 = require("../helpers/paginate.js");
// @route   GET /api/v1/products
// @desc    getting all products
// @access  Private
exports.getAllProducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedProducts = yield RedisProvider_js_1.default.get("products");
    console.log("cachedProducts", cachedProducts);
    const { page, limit = 10 } = req.query;
    const options = (0, paginate_js_1.getPaginateOptions)(page, limit);
    if (cachedProducts) {
        console.log("getting data from cache 1");
        const parsedProducts = JSON.parse(cachedProducts);
        console.log("getting data from cache 2");
        console.log("parsedProducts", parsedProducts);
        (0, BaseResponseHandler_js_1.default)({
            message: `Products Retrieved Successfully`,
            res,
            statusCode: 200,
            success: true,
            data: parsedProducts,
        });
        return;
    }
    const products = yield Product_js_1.default.paginate({}, options);
    const productsData = (0, paginate_js_1.transformPaginateResponse)(products);
    yield RedisProvider_js_1.default.set("products", JSON.stringify(productsData), { EX: 60 });
    (0, BaseResponseHandler_js_1.default)({
        message: `Products Retrived Successfully`,
        res,
        statusCode: 200,
        success: true,
        data: productsData,
    });
}));
