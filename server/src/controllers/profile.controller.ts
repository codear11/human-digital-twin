import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/prisma';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    res.status(200).json({
      success: true,
      data: {
        ...profile,
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      name,
      age,
      gender,
      height,
      weight,
      bloodGroup,
      dob,
      occupation,
      education,
      emergencyContact,
      bio,
    } = req.body;

    // If name is updated, update User table as well
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        age: age !== undefined ? age : undefined,
        gender: gender !== undefined ? gender : undefined,
        height: height !== undefined ? height : undefined,
        weight: weight !== undefined ? weight : undefined,
        bloodGroup: bloodGroup !== undefined ? bloodGroup : undefined,
        dob: dob ? new Date(dob) : undefined,
        occupation: occupation !== undefined ? occupation : undefined,
        education: education !== undefined ? education : undefined,
        emergencyContact: emergencyContact !== undefined ? emergencyContact : undefined,
        bio: bio !== undefined ? bio : undefined,
      },
      create: {
        userId,
        age,
        gender,
        height,
        weight,
        bloodGroup,
        dob: dob ? new Date(dob) : undefined,
        occupation,
        education,
        emergencyContact,
        bio,
      },
    });

    // Also update health record BMI if height & weight available
    if (height && weight) {
      const hM = height / 100;
      const calculatedBmi = parseFloat((weight / (hM * hM)).toFixed(1));
      
      const latestHealth = await prisma.healthRecord.findFirst({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
      });

      if (latestHealth) {
        await prisma.healthRecord.update({
          where: { id: latestHealth.id },
          data: { bmi: calculatedBmi },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};
