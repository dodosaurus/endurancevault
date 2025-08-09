import { Router } from 'express';

const router = Router();

// Open a booster pack
router.post('/open', async (req, res) => {
  // TODO: Handle booster pack opening
  res.json({ message: 'Open booster - to be implemented' });
});

// Get booster opening history
router.get('/history', async (req, res) => {
  // TODO: Return user's booster opening history
  res.json({ message: 'Booster history - to be implemented' });
});

export default router;