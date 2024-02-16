"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_ORIGIN = exports.ADMIN_PASS = exports.ADMIN_MAIL = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ADMIN_MAIL = "duah229@gmail.com";
exports.ADMIN_PASS = "zuou lire cbpn srke";
exports.FRONTEND_ORIGIN = '';
