import express from 'express';
import { errorHandler } from '../errorHandler';
import { authMiddleware, lecturerMiddleware } from '../middlewares/authMiddleware';
import { createAssignment, getAssignmentById, updateAssignment, deleteAssignment } from '../controllers/assignmentController';

const assignmentRouter = express.Router();

// assignmentRouter.post('/assignments', authMiddleware, lecturerMiddleware, errorHandler(createAssignment));
// assignmentRouter.get('/assignments/:assignmentId', authMiddleware, getAssignmentById);
// assignmentRouter.put('/assignments/:assignmentId', authMiddleware, lecturerMiddleware, errorHandler(updateAssignment));
// assignmentRouter.delete('/assignments/:assignmentId', authMiddleware, lecturerMiddleware, errorHandler(deleteAssignment));

assignmentRouter.post('/assignments', errorHandler(createAssignment));
assignmentRouter.get('/assignments/:assignmentId', getAssignmentById);
assignmentRouter.put('/assignments/:assignmentId', errorHandler(updateAssignment));
assignmentRouter.delete('/assignments/:assignmentId', errorHandler(deleteAssignment));

export default assignmentRouter;
