"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AuthRoute_1 = __importDefault(require("./AuthRoute"));
const ProductRoute_1 = __importDefault(require("./ProductRoute"));
const CartRoutes_1 = __importDefault(require("./CartRoutes"));
router.use("/auth", AuthRoute_1.default);
router.use("/products", ProductRoute_1.default);
router.use("/cart", CartRoutes_1.default);
exports.default = router;
