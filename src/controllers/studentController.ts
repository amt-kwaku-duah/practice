import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ROLE } from '@prisma/client';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import bcrypt from 'bcrypt';
import { studentEmailInvitation } from '../services/studentMail';
import { prismaUse } from '../server';

const prisma = new PrismaClient();

const generateStudentID = async (): Promise<string> => {
  const lastStudent = await prisma.user.findFirst({
    where: { role: ROLE.STUDENT },
    orderBy: { staffId: 'desc' },
  });

  const lastUserId = lastStudent ? parseInt(lastStudent.staffId.split('-')[1]) : 0;
  const newStudentId = `STU-${String(lastUserId + 1).padStart(5, '0')}`;

  return newStudentId;
};

const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const addStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentsData = req.body;
    for (const student of studentsData) {
      const { firstName, lastName, email } = student;

      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        console.log(`Email already exists for user: ${email}`);
        continue; // Skip the current iteration if the user already exists
      }

      const temporaryPassword = generateTemporaryPassword();
      const newStudentId = await generateStudentID();

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: temporaryPassword,
          staffId: newStudentId,
          role: ROLE.STUDENT,
          changePassword: true,
        },
      });

      const hashedPassword = await hashPassword(temporaryPassword);

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          password: hashedPassword,
        },
      });

      await prisma.student.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          studentId: newStudentId,
        },
      });

      await studentEmailInvitation(newUser, email, temporaryPassword);
    }
    res.status(200).json({
      message: 'Users and Students created successfully',
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const allStudents = async (req: Request, res: Response) => {
  try {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = 5;

    const lecturers = await prismaUse.user.findMany({
      where: {
        role: ROLE.STUDENT
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        staffId: true,
      },
      skip,
      take,
    });

    res.json({ lecturers });
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


