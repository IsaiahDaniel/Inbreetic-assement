"use strict";
// import { createClient } from 'redis';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });
// redisClient.on('error', (err) => console.error('Redis Client Error', err));
// await redisClient.connect();
// export default redisClient;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisClient.connect();
    });
}
connectRedis();
exports.default = redisClient;
