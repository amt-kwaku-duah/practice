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
exports.studentEmailInvitation = void 0;
const mailer_1 = require("../utils/mailer");
const fs_1 = require("fs");
const handlebars_1 = __importDefault(require("handlebars"));
const secrets_1 = require("../secrets");
const studentEmailInvitation = (student, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield fs_1.promises.readFile("src/templates/studentInvite.html", "utf-8");
    const template = handlebars_1.default.compile(location);
    const placeHolders = {
        firstName: student.firstName,
        lastName: student.lastName,
        email: email,
        password: password,
        id: student.staffId,
        frontURL: secrets_1.FRONTEND_ORIGIN
    };
    const textMessage = 'Student Invited to ...';
    const htmlMessage = template(placeHolders);
    return mailer_1.transporter.sendMail({
        from: secrets_1.ADMIN_MAIL,
        to: email,
        subject: "Claim Your Student Account Now",
        text: "Hello",
        html: htmlMessage
    });
});
exports.studentEmailInvitation = studentEmailInvitation;
