
import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, createGrievanceSchema, updateGrievanceSchema } from '../middleware/validation';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all grievances
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    let query = supabase.from('grievance').select('grievance_id, title, status, created_at');

    if (req.user!.role === 'citizen') {
      query = query.eq('citizen_id', req.user!.sub);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get grievances error:', error);
      return res.status(500).json({ error: 'Failed to fetch grievances' });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single grievance
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('grievance')
      .select('*, grievance_photo(*)')
      .eq('grievance_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    if (req.user!.role === 'citizen' && data.citizen_id !== req.user!.sub) {
        return res.status(403).json({ error: 'Access denied' });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new grievance
router.post('/', authenticateToken, validateRequest(createGrievanceSchema), async (req: AuthRequest, res) => {
  try {
    const { title, description, service_id, location_text } = req.body;

    const { data, error } = await supabase
      .from('grievance')
      .insert({
        citizen_id: req.user!.sub,
        title,
        description,
        service_id,
        location_text,
      })
      .select()
      .single();

    if (error) {
      console.error('Create grievance error:', error);
      return res.status(500).json({ error: 'Failed to create grievance' });
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update grievance
router.put('/:id', authenticateToken, validateRequest(updateGrievanceSchema), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_provider_id } = req.body;

    if (req.user!.role === 'citizen') {
        return res.status(403).json({ error: 'Citizens cannot update grievances' });
    }

    const { data, error } = await supabase
      .from('grievance')
      .update({ status, assigned_provider_id, updated_at: new Date().toISOString() })
      .eq('grievance_id', id)
      .select()
      .single();

    if (error) {
      console.error('Update grievance error:', error);
      return res.status(500).json({ error: 'Failed to update grievance' });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
