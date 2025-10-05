
import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get current citizen's full profile
router.get('/me/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const citizen_id = req.user!.sub;

    // Fetch citizen details
    const { data: citizen, error: citizenError } = await supabase
      .from('citizen')
      .select('*')
      .eq('citizen_id', citizen_id)
      .single();

    if (citizenError) throw citizenError;

    // Fetch vehicles owned by the citizen
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicle')
      .select('*')
      .eq('owner_id', citizen_id);

    if (vehiclesError) throw vehiclesError;

    // Fetch residency details
    const { data: residency, error: residencyError } = await supabase
      .from('citizen_residency')
      .select('house(*, zone(*))') // Join with house, and house with zone
      .eq('citizen_id', citizen_id);

    if (residencyError) throw residencyError;

    const fullProfile = {
      ...citizen,
      vehicles: vehicles || [],
      residences: residency || [],
    };

    res.json(fullProfile);

  } catch (error) {
    console.error('Error fetching citizen profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
