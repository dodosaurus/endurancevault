import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { CreateUserData } from '../types';

const prisma = new PrismaClient();

export class UserService {
  async createOrUpdateUser(userData: CreateUserData) {
    return await prisma.user.upsert({
      where: { stravaId: userData.stravaId },
      update: {
        stravaAccessToken: userData.stravaAccessToken,
        stravaRefreshToken: userData.stravaRefreshToken,
        tokenExpiresAt: userData.tokenExpiresAt,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePictureUrl: userData.profilePictureUrl,
        country: userData.country,
        state: userData.state,
        city: userData.city,
      },
      create: userData,
    });
  }

  async findByStravaId(stravaId: string) {
    return await prisma.user.findUnique({
      where: { stravaId },
    });
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updateCurrency(userId: number, amount: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        currency: {
          increment: amount,
        },
      },
    });
  }

  async updateStravaTokens(userId: number, accessToken: string, refreshToken: string, expiresAt: Date) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken,
        tokenExpiresAt: expiresAt,
      },
    });
  }

  generateJWT(userId: number): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
  }

  verifyJWT(token: string): { userId: number } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    } catch {
      return null;
    }
  }
}