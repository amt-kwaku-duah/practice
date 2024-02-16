import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction

): Promise<void> => {
  try {
    const { userId, newPassword, confirmPassword } = req.body;

    if (!userId || !newPassword || !confirmPassword) {
      throw new Error('userId, newPassword, and confirmPassword are required');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        changePassword: false
      },
    });

    res.status(200).json({ message: 'Password changed successfully', success:true });

  } catch (error: any) {
    console.error(error);
    const statusCode = error.status || 400;
    res.status(statusCode).json({ message: error.message || 'Bad Request' });
  } finally {
    await prisma.$disconnect();
  }
};
