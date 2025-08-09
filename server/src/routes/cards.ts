import { Router } from 'express';

const router = Router();

// Get all available cards
router.get('/', async (req, res) => {
  // TODO: Return all cards in the collection
  res.json({ message: 'Get all cards - to be implemented' });
});

// Get user's card collection
router.get('/collection', async (req, res) => {
  // TODO: Return user's owned cards
  res.json({ message: 'User collection - to be implemented' });
});

export default router;