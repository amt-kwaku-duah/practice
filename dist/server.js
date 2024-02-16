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
exports.prismaUse = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const bcrypt_1 = require("bcrypt");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5023',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('Half Way there Yayyyy');
});
exports.prismaUse = new client_1.PrismaClient();
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield exports.prismaUse.user.findFirst({
            where: {
                role: client_1.ROLE.ADMIN
            }
        });
        if (!existingUser) {
            const hashedPassword = (0, bcrypt_1.hashSync)("RashHalimahGloria", 10);
            const staffID = 'GROUP-2';
            yield exports.prismaUse.user.create({
                data: {
                    firstName: "Rashida",
                    lastName: "Halimah",
                    email: "gloria@amalitech.org",
                    staffId: staffID,
                    password: hashedPassword,
                    role: client_1.ROLE.ADMIN
                }
            });
            console.log('User created successfully');
        }
        else {
            console.log('Admin user already exists');
        }
    }
    catch (error) {
        console.error('Error while creating user:', error);
    }
}));
