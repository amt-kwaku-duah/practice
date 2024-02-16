import { Router } from 'express';
import authRoutes from './authRouter';
import studentRoutes from './studentRoute';
import lecturerRoutes from './lecturerRoute';
import changePassRoutes from './changePassRoute';
import assignmentRouter from './assignmentRoutes';

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes)
rootRouter.use('/students',studentRoutes)
rootRouter.use('/lecturers',lecturerRoutes)
rootRouter.use('/new',changePassRoutes)
rootRouter.use('/default',assignmentRouter)

export default rootRouter;
