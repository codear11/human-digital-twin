import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';

export const getGoals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = goals.map((g) => {
      const percentage = g.targetValue > 0
        ? Math.min(100, Math.round((g.currentValue / g.targetValue) * 100))
        : 0;
      return {
        ...g,
        progressPercentage: percentage,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

export const createGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { category, title, description, targetValue, currentValue, unit, deadline, priority } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId,
        category,
        title,
        description,
        targetValue,
        currentValue: currentValue || 0,
        unit,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'MEDIUM',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Goal established successfully',
      data: goal,
    });
  } catch (err) {
    next(err);
  }
};

export const updateGoalProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const goalId = req.params.id;
    const { currentValue, status } = req.body;

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      res.status(404).json({ success: false, message: 'Goal not found' });
      return;
    }

    let resolvedStatus = status || goal.status;
    if (!status && currentValue >= goal.targetValue) {
      resolvedStatus = 'COMPLETED';
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentValue,
        status: resolvedStatus,
      },
    });

    res.json({
      success: true,
      message: 'Goal progress updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const goalId = req.params.id;

    await prisma.goal.deleteMany({
      where: { id: goalId, userId },
    });

    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (err) {
    next(err);
  }
};
