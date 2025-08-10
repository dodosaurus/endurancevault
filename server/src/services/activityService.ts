import { PrismaClient, ActivityType, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateActivityData {
  userId: number;
  stravaActivityId: string;
  name: string;
  type: ActivityType;
  distance: number;
  duration: number;
  startDate: Date;
  currencyEarned: number;
  summaryPolyline?: string;
}

interface CreateTransactionData {
  userId: number;
  type: TransactionType;
  amount: number;
  description?: string;
}

export class ActivityService {
  async createActivity(data: CreateActivityData) {
    return await prisma.activity.create({
      data: {
        ...data,
        processed: true,
      },
    });
  }

  async findByStravaId(stravaActivityId: string) {
    return await prisma.activity.findUnique({
      where: { stravaActivityId },
    });
  }

  async createTransaction(data: CreateTransactionData) {
    return await prisma.transaction.create({
      data,
    });
  }

  calculateCurrency(distance: number, activityType: string): number {
    // Distance is in meters, convert to kilometers
    const distanceKm = distance / 1000;
    const baseCoins = 10; // 10 coins per km

    // Activity multipliers as defined in our system
    let multiplier = 1; // Default for walking/hiking
    
    const type = activityType.toLowerCase();
    if (type.includes('run') || type === 'running') {
      multiplier = 2; // 2x for running
    } else if (type.includes('ride') || type === 'cycling' || type === 'bike') {
      multiplier = 0.5; // 0.5x for cycling
    }

    return Math.floor(distanceKm * baseCoins * multiplier);
  }

  mapActivityType(stravaType: string): ActivityType {
    const type = stravaType.toLowerCase();
    
    if (type.includes('run') || type === 'running') {
      return ActivityType.RUN;
    } else if (type.includes('ride') || type === 'cycling' || type.includes('bike')) {
      return ActivityType.RIDE;
    } else if (type.includes('walk') || type === 'walking') {
      return ActivityType.WALK;
    } else if (type.includes('hike') || type === 'hiking') {
      return ActivityType.HIKE;
    } else {
      return ActivityType.OTHER;
    }
  }

  async getUserActivities(userId: number, limit = 20) {
    return await prisma.activity.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: limit,
    });
  }

  generateMapThumbnailUrl(polyline: string, size = '200x120'): string {
    if (!polyline || !process.env.GOOGLE_MAPS_API_KEY) {
      return '';
    }
    
    return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=color:0xff6b35ff|weight:3|enc:${polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}&maptype=roadmap&format=png`;
  }

  async getUserTransactions(userId: number, limit = 20) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}