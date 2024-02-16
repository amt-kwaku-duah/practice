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
exports.getlecturers = exports.addlecturer = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const generateTemporaryPassword = () => {
    const temporaryPassword = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return temporaryPassword;
};
const generateLecturerID = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastLecturer = yield prisma.user.findFirst({
        where: { role: client_1.ROLE.LECTURER },
        orderBy: { staffId: 'desc' },
    });
    const lastUserId = lastLecturer ? parseInt(lastLecturer.staffId.split('-')[1]) : 0;
    const newLecturerId = `LEC-${String(lastUserId + 1).padStart(5, '0')}`;
    return newLecturerId;
});
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    return hashedPassword;
});
const addlecturer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lecturersData = req.body;
        // Check if lecturersData is an array
        if (!Array.isArray(lecturersData)) {
            throw new Error('Lecturers data must be provided in an array');
        }
        for (const lecturer of lecturersData) {
            const { firstName, lastName, email } = lecturer;
            const existingUser = yield prisma.user.findFirst({
                where: { email },
            });
            if (existingUser) {
                res.status(409).json({ message: `Email already exists for lecturer: ${email}` });
                return;
            }
            const temporaryPassword = generateTemporaryPassword();
            const newLecturerId = yield generateLecturerID();
            const newUser = yield prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: temporaryPassword,
                    staffId: newLecturerId,
                    role: client_1.ROLE.LECTURER,
                },
            });
            const hashedPassword = yield hashPassword(temporaryPassword);
            yield prisma.user.update({
                where: { id: newUser.id },
                data: {
                    password: hashedPassword,
                },
            });
            yield prisma.lecturer.create({
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    lecturerId: newLecturerId,
                },
            });
        }
        res.status(200).json({ message: 'Lecturers added successfully' });
    }
    catch (error) {
        console.error(error);
        const statusCode = error.status || 400;
        res.status(statusCode).json({ message: error.message || 'Bad Request' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.addlecturer = addlecturer;
const getlecturers = (req, res, next) => {
    return express_1.response.status(200).json({
        message: "Got here"
    });
    // try {
    //   const allLecturers = await prisma.user.findMany({
    //     where: {
    //       role: ROLE.LECTURER,
    //     },
    //     orderBy: { staffId: 'asc' },
    //     select: {
    //       id: true,
    //       firstName: true,
    //       lastName: true,
    //       staffId: true,
    //       email: true,
    //     },
    //   });
    //   res.status(200).json({
    //     data: allLecturers
    //   });
    // } catch (error: any) {
    //   console.error(error);
    //   const statusCode = error.status || 400;
    //   res.status(statusCode).json({ message: error.message || 'Bad Request' });
    // } finally {
    //   await prisma.$disconnect();
    // }
};
exports.getlecturers = getlecturers;
