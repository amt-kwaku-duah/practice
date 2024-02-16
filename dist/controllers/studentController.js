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
exports.addstudent = void 0;
const client_1 = require("@prisma/client");
const passwordGenerator_1 = require("../utils/passwordGenerator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const studentMail_1 = require("../services/studentMail");
const prisma = new client_1.PrismaClient();
const generateStudentID = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastStudent = yield prisma.user.findFirst({
        where: { role: client_1.ROLE.STUDENT },
        orderBy: { staffId: 'desc' },
    });
    const lastUserId = lastStudent ? parseInt(lastStudent.staffId.split('-')[1]) : 0;
    const newStudentId = `STU-${String(lastUserId + 1).padStart(5, '0')}`;
    return newStudentId;
});
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    return hashedPassword;
});
const addstudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentsData = req.body;
        for (const student of studentsData) {
            const { firstName, lastName, email } = student;
            const existingUser = yield prisma.user.findFirst({
                where: { email },
            });
            if (existingUser) {
                console.log(`Email already exists for user: ${email}`);
                continue;
            }
            const temporaryPassword = (0, passwordGenerator_1.generateTemporaryPassword)();
            const newStudentId = yield generateStudentID();
            const newUser = yield prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: temporaryPassword,
                    staffId: newStudentId,
                    role: client_1.ROLE.STUDENT,
                },
            });
            const hashedPassword = yield hashPassword(temporaryPassword);
            yield prisma.user.update({
                where: { id: newUser.id },
                data: {
                    password: hashedPassword,
                },
            });
            yield prisma.student.create({
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    studentId: newStudentId,
                },
            });
            yield (0, studentMail_1.studentEmailInvitation)(newUser, email, temporaryPassword);
        }
        res.status(200).json({
            message: 'Users and Students created successfully',
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.addstudent = addstudent;
