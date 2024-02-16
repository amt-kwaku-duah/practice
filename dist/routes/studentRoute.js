"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const studentRoutes = (0, express_1.Router)();
studentRoutes.post('/addstudent', studentController_1.addstudent);
exports.default = studentRoutes;
