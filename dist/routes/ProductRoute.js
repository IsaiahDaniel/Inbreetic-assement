"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controllers/ProductController");
const protect_1 = require("../middleware/protect");
const router = express_1.default.Router();
router.get('/', protect_1.protect, ProductController_1.getAllProducts);
exports.default = router;
