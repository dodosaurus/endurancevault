import { Router } from 'express';
import { boosterService } from '../services/boosterService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Open a booster pack
router.post('/open', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const result = await boosterService.openBoosterPack(req.user.id);

    res.json(result);
  } catch (error) {
    console.error('Error opening booster pack:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      if (error.message === 'Insufficient currency') {
        return res.status(400).json({
          success: false,
          error: 'Insufficient currency. Booster packs cost 100 coins.'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to open booster pack'
    });
  }
});

// Get booster opening history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await boosterService.getBoosterHistory(req.user.id, page, limit);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching booster history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booster history'
    });
  }
});

// Get booster statistics
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const stats = await boosterService.getBoosterStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching booster stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booster statistics'
    });
  }
});

export default router;