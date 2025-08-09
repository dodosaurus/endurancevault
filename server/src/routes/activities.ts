import { Router } from 'express';

const router = Router();

// Get user's activities
router.get('/', async (req, res) => {
  // TODO: Return user's synced activities
  res.json({ message: 'Get activities - to be implemented' });
});

// Get user's currency balance and transactions
router.get('/transactions', async (req, res) => {
  // TODO: Return user's transaction history
  res.json({ message: 'Get transactions - to be implemented' });
});

export default router;