import { PrismaClient, CardRarity, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CardFilter {
  rarity?: CardRarity;
  sport?: string;
  name?: string;
  nationality?: string;
}

export interface CardWithCollection {
  id: number;
  name: string;
  sport: string;
  rarity: CardRarity;
  imageUrl: string | null;
  description: string | null;
  nationality: string | null;
  birthYear: number | null;
  baseScore: number;
  owned?: {
    quantity: number;
    obtainedAt: Date;
  } | null;
}

export class CardService {
  
  async getAllCards(filters?: CardFilter, page: number = 1, limit: number = 50): Promise<{ cards: any[], totalCount: number }> {
    const skip = (page - 1) * limit;
    
    const where: Prisma.CardWhereInput = {};
    
    if (filters?.rarity) {
      where.rarity = filters.rarity;
    }
    
    if (filters?.sport) {
      where.sport = {
        contains: filters.sport,
        mode: 'insensitive'
      };
    }
    
    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }
    
    if (filters?.nationality) {
      where.nationality = {
        contains: filters.nationality,
        mode: 'insensitive'
      };
    }

    const [cards, totalCount] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy: [
          { rarity: 'desc' }, // Legendary first, Common last
          { baseScore: 'desc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.card.count({ where })
    ]);

    return { cards, totalCount };
  }

  async getUserCardCollection(userId: number, filters?: CardFilter): Promise<CardWithCollection[]> {
    const where: Prisma.CardWhereInput = {};
    
    if (filters?.rarity) {
      where.rarity = filters.rarity;
    }
    
    if (filters?.sport) {
      where.sport = {
        contains: filters.sport,
        mode: 'insensitive'
      };
    }
    
    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }
    
    if (filters?.nationality) {
      where.nationality = {
        contains: filters.nationality,
        mode: 'insensitive'
      };
    }

    const cards = await prisma.card.findMany({
      where,
      include: {
        userCards: {
          where: { userId },
          select: {
            quantity: true,
            obtainedAt: true
          }
        }
      },
      orderBy: [
        { rarity: 'desc' },
        { baseScore: 'desc' },
        { name: 'asc' }
      ]
    });

    return cards.map(card => ({
      id: card.id,
      name: card.name,
      sport: card.sport,
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      description: card.description,
      nationality: card.nationality,
      birthYear: card.birthYear,
      baseScore: card.baseScore,
      owned: card.userCards.length > 0 ? {
        quantity: card.userCards[0].quantity,
        obtainedAt: card.userCards[0].obtainedAt
      } : null
    }));
  }

  async getUserOwnedCards(userId: number, filters?: CardFilter): Promise<CardWithCollection[]> {
    const collection = await this.getUserCardCollection(userId, filters);
    return collection.filter(card => card.owned);
  }

  async getCardById(cardId: number): Promise<any | null> {
    return await prisma.card.findUnique({
      where: { id: cardId }
    });
  }

  async addCardToUser(userId: number, cardId: number, quantity: number = 1): Promise<void> {
    await prisma.userCard.upsert({
      where: {
        userId_cardId: {
          userId,
          cardId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        userId,
        cardId,
        quantity
      }
    });
  }

  async getUserCollectionStats(userId: number): Promise<{
    totalCards: number;
    uniqueCards: number;
    collectionScore: number;
    rarityBreakdown: { [key in CardRarity]: { owned: number; total: number } };
  }> {
    const [userCards, allCards, rarityStats] = await Promise.all([
      prisma.userCard.findMany({
        where: { userId },
        include: {
          card: true
        }
      }),
      prisma.card.findMany(),
      prisma.card.groupBy({
        by: ['rarity'],
        _count: {
          id: true
        }
      })
    ]);

    const totalCards = userCards.reduce((sum, userCard) => sum + userCard.quantity, 0);
    const uniqueCards = userCards.length;
    const collectionScore = userCards.reduce((sum, userCard) => sum + (userCard.card.baseScore * userCard.quantity), 0);

    const rarityBreakdown = Object.values(CardRarity).reduce((acc, rarity) => {
      const totalInRarity = rarityStats.find(stat => stat.rarity === rarity)?._count.id || 0;
      const ownedInRarity = userCards.filter(userCard => userCard.card.rarity === rarity).length;
      
      acc[rarity] = {
        owned: ownedInRarity,
        total: totalInRarity
      };
      
      return acc;
    }, {} as { [key in CardRarity]: { owned: number; total: number } });

    return {
      totalCards,
      uniqueCards,
      collectionScore,
      rarityBreakdown
    };
  }

  async getAvailableCards(): Promise<{ rarity: CardRarity; count: number }[]> {
    return await prisma.card.groupBy({
      by: ['rarity'],
      _count: {
        id: true
      },
      orderBy: {
        rarity: 'desc'
      }
    }).then(results => 
      results.map(result => ({
        rarity: result.rarity,
        count: result._count.id
      }))
    );
  }
}

export const cardService = new CardService();