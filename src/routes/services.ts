import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all services
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: result, error } = await supabase
.from('service')

    if (error) {
      console.error('Get services error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ services: result });

  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get service by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: service, error } = await supabase
      .from('Service')
      .select('*')
      .eq('service_id', id)
      .single();

    if (error || !service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json({ service });

  } catch (error) {
    console.error('Get service error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
