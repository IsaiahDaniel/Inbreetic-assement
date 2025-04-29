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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_js_1 = __importDefault(require("./models/Product.js"));
const User_js_1 = __importDefault(require("./models/User.js"));
const config_1 = __importDefault(require("./config/"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongodb.mongoUri);
        console.log("MongoDB connected");
        // Clear existing
        yield Product_js_1.default.deleteMany({});
        yield User_js_1.default.deleteMany({});
        // Seed Products
        const products = [
            { name: "Wireless Mouse", price: 29.99, stock: 100 },
            { name: "Mechanical Keyboard", price: 79.99, stock: 50 },
            { name: "HD Monitor", price: 149.99, stock: 30 },
            { name: "USB-C Charger", price: 19.99, stock: 200 },
        ];
        const createdProducts = yield Product_js_1.default.insertMany(products);
        // Seed Users with hashed passwords
        const rawUsers = [
            {
                email: "alice@example.com",
                password: "password123",
                firstName: "Bob",
                lastName: "Alice",
                gender: "female",
            },
            {
                email: "stevejobs@example.com",
                password: "password456",
                firstName: "Steve",
                lastName: "Jobs",
                gender: "male",
            },
        ];
        const users = yield Promise.all(rawUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                email: user.email,
                password: yield bcryptjs_1.default.hash(user.password, 10),
            });
        })));
        const createdUsers = yield User_js_1.default.insertMany(users);
        console.log("Seeded users:", createdUsers.map((u) => u.email));
        console.log("Seeded products:", createdProducts.map((p) => p.name));
        process.exit();
    }
    catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
});
seed();
