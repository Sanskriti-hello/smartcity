import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('announcement')
      .select('announcement_id, title, content, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get announcements error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json(data);

  } catch (error) {
    console.error('Get announcements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;