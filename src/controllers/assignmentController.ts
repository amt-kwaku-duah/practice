import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ROLE } from '@prisma/client';


interface AuthenticatedRequest extends Request {
    user: {
      id: number;
      staffId: string;
      role: ROLE;
    };
  }

const prisma = new PrismaClient();

const generateAssignmentCode = async (): Promise<string> => {
  const lastAssignment = await prisma.assignment.findFirst({
    orderBy: { id: 'desc' },
  });

  const lastAssignmentId = lastAssignment ? lastAssignment.id : 0;
  const newAssignmentId = lastAssignmentId + 1;

  return `ASS-${String(newAssignmentId).padStart(3, '0')}`;
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, deadline, isPublished } = req.body;

    if (!title || !description || !deadline) {
      throw new Error('Title, description, and deadline are required.');
    }

    const assignmentCode = isPublished ? await generateAssignmentCode() : null;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        deadline,
        isPublished,
        assignmentCode,
        lecturerId: req.user.id,
      },
    });

    res.status(201).json({ assignment });
  } catch (error: any) {
    console.error(error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const getAssignmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignmentId = req.params.assignmentId;

    if (!assignmentId) {
      throw new Error('Assignment ID is required.');
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(assignmentId, 10) },
    });

    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found.' });
      return;
    }

    res.json({ assignment });
  } catch (error: any) {
    console.error(error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const updateAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignmentId = req.params.assignmentId;
    const { title, description, deadline, isPublished } = req.body;

    if (!assignmentId || !title || !description || !deadline) {
      throw new Error('Assignment ID, title, description, and deadline are required.');
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(assignmentId, 10) },
      data: {
        title,
        description,
        deadline,
        isPublished,
      },
    });

    res.json({ updatedAssignment });
  } catch (error: any) {
    console.error(error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const assignmentId = req.params.assignmentId;

    if (!assignmentId) {
      throw new Error('Assignment ID is required.');
    }

    await prisma.assignment.delete({
      where: { id: parseInt(assignmentId, 10) },
    });

    res.status(204).end();
  } catch (error: any) {
    console.error(error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};
