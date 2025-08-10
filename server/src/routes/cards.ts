import { Router } from 'express';
import { cardService, CardFilter } from '../services/cardService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { CardRarity } from '@prisma/client';

const router = Router();

// Get all available cards with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const filters: CardFilter = {};
    
    if (req.query.rarity && Object.values(CardRarity).includes(req.query.rarity as CardRarity)) {
      filters.rarity = req.query.rarity as CardRarity;
    }
    
    if (req.query.sport) {
      filters.sport = req.query.sport as string;
    }
    
    if (req.query.name) {
      filters.name = req.query.name as string;
    }
    
    if (req.query.nationality) {
      filters.nationality = req.query.nationality as string;
    }

    const result = await cardService.getAllCards(filters, page, limit);
    
    res.json({
      success: true,
      data: {
        cards: result.cards,
        pagination: {
          page,
          limit,
          totalCount: result.totalCount,
          totalPages: Math.ceil(result.totalCount / limit),
          hasNext: page * limit < result.totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cards'
    });
  }
});

// Get user's complete card collection (owned and not owned)
router.get('/collection', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const filters: CardFilter = {};
    
    if (req.query.rarity && Object.values(CardRarity).includes(req.query.rarity as CardRarity)) {
      filters.rarity = req.query.rarity as CardRarity;
    }
    
    if (req.query.sport) {
      filters.sport = req.query.sport as string;
    }
    
    if (req.query.name) {
      filters.name = req.query.name as string;
    }
    
    if (req.query.nationality) {
      filters.nationality = req.query.nationality as string;
    }

    const showOwnedOnly = req.query.owned === 'true';
    
    const collection = showOwnedOnly 
      ? await cardService.getUserOwnedCards(req.user.id, filters)
      : await cardService.getUserCardCollection(req.user.id, filters);

    const stats = await cardService.getUserCollectionStats(req.user.id);

    res.json({
      success: true,
      data: {
        collection,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user collection'
    });
  }
});

// Get collection statistics
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const stats = await cardService.getUserCollectionStats(req.user.id);
    const availableCards = await cardService.getAvailableCards();

    res.json({
      success: true,
      data: {
        userStats: stats,
        availableCards
      }
    });
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection statistics'
    });
  }
});

// Get specific card details
router.get('/:cardId', async (req, res) => {
  try {
    const cardId = parseInt(req.params.cardId);
    
    if (isNaN(cardId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid card ID'
      });
    }

    const card = await cardService.getCardById(cardId);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch card'
    });
  }
});

export default router;