"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lecturerController_1 = require("../controllers/lecturerController");
const lecturerRoutes = (0, express_1.Router)();
lecturerRoutes.post('/addlecturer', lecturerController_1.addlecturer);
lecturerRoutes.get('/getlecturers', lecturerController_1.getlecturers);
exports.default = lecturerRoutes;
