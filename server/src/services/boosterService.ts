import { PrismaClient, CardRarity, TransactionType } from '@prisma/client';
import { cardService } from './cardService';

const prisma = new PrismaClient();

export interface BoosterPackContents {
  cards: {
    id: number;
    name: string;
    sport: string;
    rarity: CardRarity;
    imageUrl: string | null;
    description: string | null;
    nationality: string | null;
    birthYear: number | null;
    baseScore: number;
    isNew: boolean; // Whether user got this card for first time
  }[];
  totalValue: number;
  rarityBreakdown: { [key in CardRarity]?: number };
}

export interface BoosterOpenResult {
  success: boolean;
  boosterOpen: {
    id: number;
    cost: number;
    openedAt: Date;
  };
  contents: BoosterPackContents;
  userStats: {
    currency: number;
    totalCards: number;
    uniqueCards: number;
    collectionScore: number;
  };
}

export class BoosterService {
  private readonly BOOSTER_COST = 100;
  private readonly CARDS_PER_PACK = 4; // 3 common + 1 with rarity chances
  
  // Rarity probabilities as per spec: 70% common, 20% uncommon, 7% rare, 2.5% epic, 0.5% legendary
  private readonly RARITY_WEIGHTS = {
    [CardRarity.COMMON]: 70,
    [CardRarity.UNCOMMON]: 20,
    [CardRarity.RARE]: 7,
    [CardRarity.EPIC]: 2.5,
    [CardRarity.LEGENDARY]: 0.5
  };

  /**
   * Open a booster pack for a user
   */
  async openBoosterPack(userId: number): Promise<BoosterOpenResult> {
    // Start database transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Get user and verify currency
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.currency < this.BOOSTER_COST) {
        throw new Error('Insufficient currency');
      }

      // 2. Deduct currency
      await tx.user.update({
        where: { id: userId },
        data: {
          currency: {
            decrement: this.BOOSTER_COST
          }
        }
      });

      // 3. Create booster open record
      const boosterOpen = await tx.boosterOpen.create({
        data: {
          userId,
          cost: this.BOOSTER_COST
        }
      });

      // 4. Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.SPENT_BOOSTER,
          amount: -this.BOOSTER_COST,
          description: `Opened booster pack #${boosterOpen.id}`,
          boosterOpenId: boosterOpen.id
        }
      });

      // 5. Generate cards for the pack
      const selectedCards = await this.generateBoosterCards(tx);

      // 6. Record cards in booster_cards table
      await tx.boosterCard.createMany({
        data: selectedCards.map(card => ({
          boosterOpenId: boosterOpen.id,
          cardId: card.id
        }))
      });

      // 7. Add cards to user's collection
      const cardAssignmentResults = await this.addCardsToUser(tx, userId, selectedCards);

      // 8. Get updated user stats
      const updatedUser = await tx.user.findUnique({
        where: { id: userId }
      });

      const userStats = await cardService.getUserCollectionStats(userId);

      // 9. Prepare result
      const contents: BoosterPackContents = {
        cards: selectedCards.map((card, index) => ({
          ...card,
          isNew: cardAssignmentResults[index].isNew
        })),
        totalValue: selectedCards.reduce((sum, card) => sum + card.baseScore, 0),
        rarityBreakdown: this.calculateRarityBreakdown(selectedCards)
      };

      return {
        success: true,
        boosterOpen: {
          id: boosterOpen.id,
          cost: this.BOOSTER_COST,
          openedAt: boosterOpen.openedAt
        },
        contents,
        userStats: {
          currency: updatedUser!.currency,
          totalCards: userStats.totalCards,
          uniqueCards: userStats.uniqueCards,
          collectionScore: userStats.collectionScore
        }
      };
    });
  }

  /**
   * Generate cards for a booster pack based on rarity distribution
   */
  private async generateBoosterCards(tx: any) {
    const selectedCards = [];

    // First 3 cards are guaranteed common
    for (let i = 0; i < 3; i++) {
      const commonCard = await this.selectRandomCardByRarity(tx, CardRarity.COMMON);
      selectedCards.push(commonCard);
    }

    // 4th card uses rarity distribution
    const fourthCardRarity = this.selectRandomRarity();
    const fourthCard = await this.selectRandomCardByRarity(tx, fourthCardRarity);
    selectedCards.push(fourthCard);

    return selectedCards;
  }

  /**
   * Select a random rarity based on weighted probabilities
   */
  private selectRandomRarity(): CardRarity {
    const random = Math.random() * 100; // 0-100
    let cumulativeProbability = 0;

    // Check from highest rarity to lowest to ensure proper distribution
    const rarities = [CardRarity.LEGENDARY, CardRarity.EPIC, CardRarity.RARE, CardRarity.UNCOMMON, CardRarity.COMMON];
    
    for (const rarity of rarities) {
      cumulativeProbability += this.RARITY_WEIGHTS[rarity];
      if (random <= cumulativeProbability) {
        return rarity;
      }
    }

    // Fallback to common (should never happen)
    return CardRarity.COMMON;
  }

  /**
   * Select a random card of a specific rarity
   */
  private async selectRandomCardByRarity(tx: any, rarity: CardRarity) {
    const availableCards = await tx.card.findMany({
      where: { rarity }
    });

    if (availableCards.length === 0) {
      throw new Error(`No cards available for rarity: ${rarity}`);
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  }

  /**
   * Add cards to user's collection
   */
  private async addCardsToUser(tx: any, userId: number, cards: any[]) {
    const results = [];

    for (const card of cards) {
      // Check if user already has this card
      const existingUserCard = await tx.userCard.findUnique({
        where: {
          userId_cardId: {
            userId,
            cardId: card.id
          }
        }
      });

      const isNew = !existingUserCard;

      // Add or increment card
      await tx.userCard.upsert({
        where: {
          userId_cardId: {
            userId,
            cardId: card.id
          }
        },
        update: {
          quantity: {
            increment: 1
          }
        },
        create: {
          userId,
          cardId: card.id,
          quantity: 1
        }
      });

      results.push({ cardId: card.id, isNew });
    }

    return results;
  }

  /**
   * Calculate rarity breakdown for pack contents
   */
  private calculateRarityBreakdown(cards: any[]): { [key in CardRarity]?: number } {
    const breakdown: { [key in CardRarity]?: number } = {};
    
    cards.forEach(card => {
      breakdown[card.rarity] = (breakdown[card.rarity] || 0) + 1;
    });

    return breakdown;
  }

  /**
   * Get user's booster opening history
   */
  async getBoosterHistory(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [boosters, totalCount] = await Promise.all([
      prisma.boosterOpen.findMany({
        where: { userId },
        include: {
          cards: {
            include: {
              card: true
            }
          }
        },
        orderBy: {
          openedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.boosterOpen.count({ where: { userId } })
    ]);

    const formattedBoosters = boosters.map(booster => ({
      id: booster.id,
      cost: booster.cost,
      openedAt: booster.openedAt,
      cards: booster.cards.map(boosterCard => ({
        id: boosterCard.card.id,
        name: boosterCard.card.name,
        sport: boosterCard.card.sport,
        rarity: boosterCard.card.rarity,
        imageUrl: boosterCard.card.imageUrl,
        baseScore: boosterCard.card.baseScore
      })),
      totalValue: booster.cards.reduce((sum, boosterCard) => sum + boosterCard.card.baseScore, 0),
      rarityBreakdown: this.calculateRarityBreakdown(booster.cards.map(bc => bc.card))
    }));

    return {
      boosters: formattedBoosters,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get booster statistics
   */
  async getBoosterStats(userId: number) {
    const [totalOpened, totalSpent, favoriteRarity] = await Promise.all([
      prisma.boosterOpen.count({ where: { userId } }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.SPENT_BOOSTER
        },
        _sum: {
          amount: true
        }
      }),
      prisma.boosterCard.groupBy({
        by: ['cardId'],
        where: {
          boosterOpen: {
            userId
          }
        },
        _count: {
          cardId: true
        },
        orderBy: {
          _count: {
            cardId: 'desc'
          }
        },
        take: 1
      })
    ]);

    return {
      totalBoostersOpened: totalOpened,
      totalCurrencySpent: Math.abs(totalSpent._sum.amount || 0),
      averageCostPerBooster: totalOpened > 0 ? Math.abs(totalSpent._sum.amount || 0) / totalOpened : 0
    };
  }
}

export const boosterService = new BoosterService();