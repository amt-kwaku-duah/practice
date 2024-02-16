"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const studentRoute_1 = __importDefault(require("./studentRoute"));
const lecturerRoute_1 = __importDefault(require("./lecturerRoute"));
const rootRouter = (0, express_1.Router)();
rootRouter.use('/auth', authRouter_1.default);
rootRouter.use('/student', studentRoute_1.default);
rootRouter.use('/lecturer', lecturerRoute_1.default);
// rootRouter.use('/lecturers',getlecturers)
rootRouter.use("/lecturers", lecturerRoute_1.default);
exports.default = rootRouter;
