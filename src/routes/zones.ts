import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all zones
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: result, error } = await supabase
.from('zone');

    if (error) {
      console.error('Get zones error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ zones: result });

  } catch (error) {
    console.error('Get zones error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get zone by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: zone, error } = await supabase
      .from('zones')
      .select('*')
      .eq('zone_id', id)
      .single();

    if (error || !zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    return res.json({ zone });

  } catch (error) {
    console.error('Get zone error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
