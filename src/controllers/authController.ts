import { Request, Response, NextFunction } from 'express';
import { prismaUse } from '../server';
import { compare, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/badRequest';
import { ErrorCode } from '../exceptions/rootException';
import { NotFoundException } from '../exceptions/notFound';



export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailOrId, password } = req.body;
        const user = await prismaUse.user.findFirst({
            where: {
              OR: [
                { staffId: emailOrId },
                { email: emailOrId },
              ]
            }
          });

        if (!user) {
            throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
        }
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);
        }
        const changePassword = user.role === 'ADMIN' ? false : user.changePassword;

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
        res.json({ user: { ...user, password: undefined,changePassword }, token });

    } catch (error) {
        next(error);
    }
};
