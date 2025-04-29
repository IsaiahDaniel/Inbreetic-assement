"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../middleware/protect");
const CartController_1 = require("../controllers/CartController");
const router = express_1.default.Router();
router.post('/add', protect_1.protect, CartController_1.addToCart);
router.post('/remove', protect_1.protect, CartController_1.removeFromCart);
router.post('/checkout', protect_1.protect, CartController_1.checkoutCart);
exports.default = router;
