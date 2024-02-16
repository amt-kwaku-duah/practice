import { Router } from 'express';
import { errorHandler } from '../errorHandler';
import { changePassword } from '../controllers/changePassword';
import { passAuthMiddleware } from '../middlewares/passResetAuthM';

const changePassRoutes:Router = Router();
changePassRoutes.post('/change-password',[passAuthMiddleware],errorHandler(changePassword))
export default changePassRoutes;
