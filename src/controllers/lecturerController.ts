import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ROLE } from '@prisma/client';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import { hashPassword } from '../utils/hashPassword';
import { lecturerEmailInvitation } from '../services/lecturerMail';
import { prismaUse } from '../server';

const prisma = new PrismaClient();

const generateLecturerID = async (): Promise<string> => {
  const lastLecturer = await prisma.user.findFirst({
    where: { role: ROLE.LECTURER },
    orderBy: { staffId: 'desc' },
  });

  const lastUserId = lastLecturer ? parseInt(lastLecturer.staffId.split('-')[1]) : 0;
  const newLecturerId = `LEC-${String(lastUserId + 1).padStart(5, '0')}`;

  return newLecturerId;
};

export const addLecturer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lecturersData = req.body;
    if (!Array.isArray(lecturersData)) {
      throw new Error('Lecturers data must be provided in an array');
    }

    for (const lecturer of lecturersData) {
      const { firstName, lastName, email } = lecturer;

      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({ message: `Email already exists for lecturer: ${email}` });
        return;
      }

      const temporaryPassword = generateTemporaryPassword();
      const newLecturerId = await generateLecturerID();

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: temporaryPassword,
          staffId: newLecturerId,
          role: ROLE.LECTURER,
        },
      });

      const hashedPassword = await hashPassword(temporaryPassword);

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          password: hashedPassword,
        },
      });

      await prisma.lecturer.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          lecturerId: newLecturerId,
        },
      });
      await lecturerEmailInvitation(newUser, email, temporaryPassword);
    }

    res.status(200).json({ message: 'Lecturers added successfully' });
  } catch (error: any) {
    console.error(error);
    const statusCode = error.status || 400;
    res.status(statusCode).json({ message: error.message || 'Bad Request' });
  } finally {
    await prisma.$disconnect();
  }
};


export const getAllLecturers = async (req: Request, res: Response) => {
  try {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = 5;

    const lecturers = await prismaUse.user.findMany({
      where: {
        role: ROLE.LECTURER,
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

export const deleteLecturer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staffIdToDelete = req.params.staffId;

    if (!staffIdToDelete) {
      throw new Error('Staff ID is required for deletion.');
    }

    const lecturerInUsers = await prisma.user.findFirst({
      where: {
        staffId: staffIdToDelete,
        role: ROLE.LECTURER,
      },
    });

    if (!lecturerInUsers) {
      res.status(404).json({ message: 'Lecturer not found.' });
      return;
    }

    // Delete the lecturer from the users table
    await prisma.user.delete({
      where: {
        id: lecturerInUsers.id,
      },
    });

    res.status(200).json({ message: 'Lecturer deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting lecturer:', error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

