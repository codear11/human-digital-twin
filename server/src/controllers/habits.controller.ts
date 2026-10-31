import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';

export const getHabits = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const today = new Date().toISOString().split('T')[0];

    const habits = await prisma.habit.findMany({
      where: { userId, active: true },
      include: {
        logs: {
          where: { date: today },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = habits.map((h) => ({
      ...h,
      completedToday: h.logs.length > 0 && h.logs[0].completed,
      logs: undefined,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

export const createHabit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { name, category, targetFrequency, targetTime } = req.body;

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        category,
        targetFrequency: targetFrequency || 'daily',
        targetTime,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Habit tracker created successfully',
      data: habit,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleHabit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const habitId = req.params.id;
    const { date, completed } = req.body;

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      res.status(404).json({ success: false, message: 'Habit not found' });
      return;
    }

    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    let newStreak = habit.currentStreak;

    if (existingLog) {
      await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { completed },
      });
      if (!completed && newStreak > 0) {
        newStreak = Math.max(0, newStreak - 1);
      } else if (completed && !existingLog.completed) {
        newStreak += 1;
      }
    } else {
      if (completed) {
        newStreak += 1;
      }
      await prisma.habitLog.create({
        data: {
          habitId,
          userId,
          date,
          completed,
          streakAtLog: newStreak,
        },
      });
    }

    const longest = Math.max(habit.longestStreak, newStreak);
    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: longest,
      },
    });

    res.json({
      success: true,
      message: completed ? 'Habit completed!' : 'Habit unchecked',
      data: updatedHabit,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const habitId = req.params.id;

    await prisma.habit.deleteMany({
      where: { id: habitId, userId },
    });

    res.json({ success: true, message: 'Habit removed successfully' });
  } catch (err) {
    next(err);
  }
};
